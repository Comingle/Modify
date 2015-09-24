// Fortunately any problems with parameters passed into chrome.serial throws an error
import Data from './data';
import translator from './translator';

let connectionOptions = {
  persistent: false, // Flag indicating whether or not the connection should be left open when the application is suspended (see Manage App Lifecycle). The default value is "false." When the application is loaded, any serial connections previously opened with persistent=true can be fetched with getConnections.
  name: 'myApp', // An application-defined string to associate with the connection.
  bufferSize: 4096, // The size of the buffer used to receive data. The default value is 4096.
  bitrate: 9600, // this is the normal connecting value. The requested bitrate of the connection to be opened. For compatibility with the widest range of hardware, this number should match one of commonly-available bitrates, such as 110, 300, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200. There is no guarantee, of course, that the device connected to the serial port will support the requested bitrate, even if the port itself supports that bitrate. 9600 will be passed by default.
  dataBits: 'eight', // "eight" will be passed by default.
  parityBit: 'no', // "no" will be passed by default.
  stopBits: 'one', // "one" will be passed by default.
  ctsFlowControl: false, // Flag indicating whether or not to enable RTS/CTS hardware flow control. Defaults to false.
  sendTimeout: 0, // The maximum amount of time (in milliseconds) to wait for a send operation to complete before calling the callback with a "timeout" error. If zero, send timeout errors will not be triggered. Defaults to 0.
  receiveTimeout: 0 // The maximum amount of time (in milliseconds) to wait for new data before raising an onReceiveError event with a "timeout" error. If zero, receive timeout errors will not be raised for the connection. Defaults to 0.
};

class SerialApiWrapper {
  constructor (serialApi, device) {
    this.validateParams(arguments);
    this.serialApi = serialApi;
    this.connectionOptions = JSON.parse(JSON.stringify(connectionOptions));
    this.devicePath = device.path;
  }

  static getDevices (serialApi) {
    return new Promise( function (resolve, reject) {
      serialApi.getDevices( function (response) {
        if (response) {
          resolve(response);
        } else {
          reject();
        }
      });
    });
  }

  connect (bitrate) {
    let serialApiWrapper = this;
    let options = this.connectionOptions;
    let serialApi = this.serialApi;
    let devicePath = this.devicePath;
    if (bitrate) { options.bitrate = bitrate; }

    return new Promise( function (resolve, reject) {
      serialApi.connect(devicePath, options, function (connection) {
        if (connection) {
          connection.id = connection.connectionId;
          serialApiWrapper.connection = connection;
          resolve(connection);
        } else {
          reject(connection);
        }
      });
    });
  }

  disconnect (connectionId) {
    let serialApiWrapper = this;
    let serialApi = this.serialApi;
    return new Promise( function (resolve) {
      serialApi.disconnect(connectionId, function (response) {
        serialApiWrapper.connection = null;
        console.log("PGM disconnect: " + response);
        resolve(response);
      });
    });
  }

  // must pass a Data instance
  send (data) {
    this.validateData(data);
    this.validateConnection();
    let id = this.connection.id;
    let serialApi = this.serialApi;
    // console.log('PAYLOAD 2 : ', translator.binToHex2(data.getBin()));

    return new Promise( function (resolve) {
      serialApi.send(id, data.getBin(), function (sent) {
        resolve(sent);
      });
    });
  }

  // flush buffers
  flush () {
    let id = this.connection.id;
    let serialApi = this.serialApi;
    return new Promise( function (resolve) {
      serialApi.flush(id, function(result) {
        resolve(result);
      })
    })
  }

  listen (callback) {
    this.serialApi.onReceive.addListener(callback);
  }

  unlisten (callback) {
    console.log("unlisten: " + this.serialApi.onReceive.hasListener(callback));
    this.serialApi.onReceive.removeListener(callback);
  }

  // PRIVATE

  validateParams (args) {
    if (!args[0]) {
      throw new Error('You must pass in a serial api object as your first argument.');
    } else if (!args[1]) {
      throw new Error('You must pass in a device that has a "path" property as your second agrument.');
    }
  }

  validateData (data) {
    if (!(data instanceof Data)) {
      throw new Error('You must pass send an instance of Data.');
    }
  }

  validateConnection () {
    if (!this.connection || !this.connection.id) {
      throw new Error('You must be connected to a device.');
    }
  }
}

export default SerialApiWrapper;
