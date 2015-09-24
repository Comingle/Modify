import translator from './translator';
// import SerialApiWrapper from './serial-api-wrapper';
import commands from './avr109-commands';
import Data from './data';

class Avr109 {
  constructor (serial) {
    this.connection = this.getConnection(serial);
    // Arduino and the board both have a serial obj.
    // This allows an Arduino instance to have multiple boards, each connected to their own serial port.
    // potentially an Arduino instance should not have a serial obj?
    this.serial = serial;
    this.bootloaderBitrate = 1200;
    this.dataBitrate = 57600; // this came from chrome-arduino
    this.flashSize = 28672;
    this.pageSize = 128;
    this.commands = commands;
    this.pages = [];
    this.verifyPages = [];
    this.responseHandler = this.defaultHandler;
    this.listenToDevice();
    this.totalPages = this.flashSize / this.pageSize;
    return this;
  }

  // INTERFACE

  downloadSketch () {
    let self = this;
    return new Promise(function(resolve) {
      self.startProgramming().then( function (success) {
        if (success) {
          self.readSketchPages().then( function (sketch) {
            console.log('Finished reading sketch pages.');
            resolve(sketch);
          });
        }
      });
    });
  }

  uploadSketch (data) {
    let self = this;
    for (let i = 0; i < self.totalPages; i++) {
      let page = data.getPage(i);
      if (page.length > 0) {
        if (page.length < self.pageSize) {
          page = self.pad(page);
        }
        self.pages[i] = page;
        self.verifyPages[i] = page;
      } else {
        break;
      }
    }
    return new Promise(function(resolve) {
      return self.startProgramming().then( function (success) {
        if (success) {
          self.writeSketchPages().then( function () {
            self.verifySketch().then( function () {
              console.log('Finished uploading sketch.');
              resolve();
            });
          });
        }
      });
    });
  }

  // PRIVATE

  verifySketch () {
    let self = this;

    return new Promise(function(resolve, reject) {
      self.readSketchPages().then( function (sketch) {
        if (!self.verifyPages) {
          console.log("no sketch to verify.");
          return;
        }
        let uploadedData = translator.intelHEXToBin(sketch);
        let origPages = self.verifyPages;
        let originalData = [];
        for (let i = 0; i < self.verifyPages.length; i++) {
          for (let k = 0; k < self.verifyPages[i].length; k++) {
            originalData.push(self.verifyPages[i][k]);
          }
        }
        let misMatch = 0;
        for (let j = 0; j < originalData.length; j++) {
          if (uploadedData[j] != originalData[j]) {
            console.log("data mismatch at " + j);
            console.log("uploaded: " + uploadedData[j]);
            console.log("original: " + originalData[j]);
            misMatch++;
          }
          if (misMatch > 5) break;
        }
        console.log('Finished verifying sketch.');
        resolve();
      });
    });
  }



  readSketchPages () {
    let self = this;
    return new Promise( function (success) {
      // store the success function in a handler so the readPageHandler listener
      // can run it when we're done downloading from the toy.
      // FYI, success is the 'then(...)' after readSketchPages, which
      // may include code to resolve other promises. (this was really confusing)
      self.resolveHandler = success;

      self.setAddressTo(0).then( function () {
        self.readPage(0);
      });
    });
  }

  // Read a page, set a serial listener for the response code (usually CR / 0x0D)
  // Read next page upon response.
  readPage (pageNum) {
    let board = this;
    if (pageNum === this.totalPages) {
      return true;
    } else {
      let readPage = this.commands.readPage;
      let typeFlash = this.commands.typeFlash;
      let sizeBytes = translator.storeAsTwoBytes(this.pageSize);
      let data = new Data([readPage, sizeBytes[0], sizeBytes[1], typeFlash]);

      board.responseHandler = this.readPageAndRequestNext;
      board.serial.send(data);

    }
  }

  // read next page after receiving ack from board of previous page read.
  readPageAndRequestNext (args) {
    this.readPageHandler(args);
    if (this.pages.length < this.totalPages) {
      this.readPage(this.pages.length);
    }
  }

  readPageHandler (args) {
    let _this = this;
    let hexData = translator.binToHex2(args.data);
    let pages = this.pages;

    // don't put ACKs from the microprocessor in to sketch data
    // these happen at the beginning.
    if (pages.length === 0) {
      for (let i = 0; i < hexData.length; i++) {
        if (hexData[i] != 13) break;
        if (i === hexData.length-1 && hexData[i] === 13) {
          return;
        }
      }
    }

    pages.push(hexData);
    if (pages.length >= this.totalPages) {
      let data = [].concat.apply([], pages);
      let sketch = translator.binToHex(data);
      //console.log('sketch : ', sketch);
      this.stopProgramming().then(function() {
        _this.resolveHandler(sketch);
      })
    }
  }

  writeSketchPages () {
    console.log('writing sketch pages');
    let self = this;
    return new Promise( function (resolve) {
      self.resolveHandler = resolve;
      self.setAddressTo(0).then( function () {
        self.writePage();
      });
    });
  }

  writePage () {
    let board = this;
    if (board.pages.length === 0) {
      return true;
    } else {
      let pageSize = this.pageSize;
      let writePage = this.commands.writePage;
      let typeFlash = this.commands.typeFlash;
      let sizeBytes = translator.storeAsTwoBytes(pageSize);
      let payload = board.pages[0];

      if (payload.length < 1) {
        board.verifySketch();
      }

      let data = new Data([writePage, sizeBytes[0], sizeBytes[1], typeFlash]);
      data.addHex(payload);

      board.responseHandler = this.writePageAndRequestNext;
      board.serial.send(data);
      board.pages.splice(0,1);
    }
  }

  writePageAndRequestNext() {
    let _this = this;
    if (this.pages.length > 0) {
      setTimeout(function() {
        _this.writePage();
      }, 25);
    } else {
      // unlike readPageAndRequestNext, we don't want to stop programming after getting
      // to the last page since we're going to read the pages and verify.
      _this.resolveHandler();
    }

  }

  pad (payload) {
    while (payload.length % this.pageSize !== 0) {
      payload.push(255);
    }
    return payload;
  }

  setAddressTo (bitNum) {
    let self = this;
    let pageNum = (pageNum - 1) * this.pageSize;
    let setAddress = self.commands.setAddress;
    var addressBytes = translator.storeAsTwoBytes(bitNum);
    let data = new Data([setAddress, addressBytes[1], addressBytes[0]]);
    return self.serial.send(data);
  }

  kickBootloaderConnect () {
    var bitrate = this.bootloaderBitrate;
    var dataBitrate = this.dataBitrate;
    var serial = this.serial;
    var id = serial.connection.id;

    return new Promise( function (resolve) {
      // bootloader wont be kicked if already connected
      serial.disconnect(id).then( function (status) {
        if (status) {
          // the idiomatic way of starting bootlaoder mode is to connect with a bitrate of 1200, and then disconnect
          // that's just how it is
          serial.connect(bitrate).then( function (connection) {
            serial.disconnect(connection.connectionId).then( function (status2) {
              if (!status2) {
                throw new Error('Could not disconnect so could not kick bootloader');
              } else {
                // the bootloader needs 2 seconds to get ready
                setTimeout(function() {
                  console.log('Reconnecting...');
                  serial.connect(dataBitrate).then( function () {
                    resolve(true);
                  });
                }, 2000);
              }
            });
          });
        }
      });
    });
  }

  startProgramming () {
    let board = this;
    return new Promise( function (resolve) {
      board.kickBootloaderConnect().then( function () {
        console.log('kick bootloader')
        board.enterProgrammingMode().then( function (success2) { // XXX error checking from serial.send
          console.log('enter programming mode')
          if (success2) {
            resolve(true);
          }
        }).catch( function (fail2) {
          throw new Error('Could not enter programming mode : ' + fail2);
        });
      });
    });
  }

  enterProgrammingMode () {
    let serial = this.serial;
    let data = new Data(this.commands.enterProgrammingMode, 'hex');
    console.log('programming mode', this.commands.enterProgrammingMode);
    console.log('DATA',data);
    return serial.send(data);
  }

  stopProgramming () {
    let board = this;
    board.responseHandler = board.defaultHandler;
    return new Promise(function(resolve) {
      board.leaveProgrammingMode().then( function () {
      board.exitBootloader().then( function () {
        board.serial.unlisten(board.serialListener);
        board.serialListener = board.defaultHandler.bind(board);
        board.pages = [];
        resolve();
        });
      });
    });
  }

  exitBootloader () {
    let serial = this.serial;
    let data = new Data(this.commands.exitBootloader);
    return serial.send(data);
  }

  leaveProgrammingMode () {
    let serial = this.serial;
    let data = new Data(this.commands.leaveProgrammingMode);
    return serial.send(data);
  }

  listenToDevice () {
    this.serialListener = this.readDispatcher.bind(this);
    this.serial.listen(this.serialListener);
    return true;
  }

  readDispatcher (readArg) {
    this.responseHandler(readArg);
    return;
  }

  defaultHandler (response) {
    console.log('Basic response handler called.');
  };

  getConnection (serial) {
    var connection = serial.connection;
    if (connection) {
      return connection;
    } else {
      throw new Error('Avr109 must be passed a valid connection.');
    }
  }
}

export default Avr109;
