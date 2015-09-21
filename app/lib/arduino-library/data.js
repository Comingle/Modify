// This class will have to hold representations of data in all formats.
// There will be:
//   arrays of single hex values
//   arrays of "pages" of values (I guess hex and binary?)
//   I guess binary data, whatever form that holds
// For consistancy content is kept as binary
import translator from './translator';

let defaultPageSize = 128;

class Data {
  constructor (data, type, pageSize) {
    this.content = [];
    this.pageSize = pageSize || defaultPageSize;

    switch (type) {
      case 'binary':
        this.addBin(data);
        break;
      case 'intelHEX':
        this.addIntelHex(data);
        break;
      default:
        this.addHex(data);
        break;
    }
  }

  // INTERFACE

  getBin () {
    return translator.hexArrayToBin(this.content);
  }

  addHex (data) {
    // let bin = translator.binToHex2(data);
    this.content = this.content.concat(data);
  }

  addBin (data) {
    this.content = this.content.concat(data);
  }

  addIntelHex (data) {
    let bin = translator.intelHEXToBin(data);
    let newContent = this.content.concat(bin);
    this.content = newContent;
  }

  // PRIVATE

  coerceToHex (data) {
    let coerceHex = this.coerceHex;

    if (Array.isArray(data)) {
      return data.map( function (hex) {
        return coerceHex(hex);
      });
    } else {
      return coerceHex(data);
    }
  }

  coerceHex (hex) {
    let int = parseInt(hex);
    let resolvesToInt = (typeof int === 'number') && (int % 1 === 0);
    let withinHexRange = (int >= 0) && (int <= 255);

    if (resolvesToInt && withinHexRange) {
      return int;
    } else {
      throw new Error(`Must be able to coerce "${hex}" to an integer between 0 and 255.`);
    }
  }

  isHexFile (data) {
    let seperatedWithNewLine, isHexChars;
    isHexChars = /^:([A-Fa-f0-9]{2}){8,9}/.test(data);
    seperatedWithNewLine = true;
    if (data.split(':').length > 2) {
      seperatedWithNewLine =
        (data.split(':').length === data.split('\n').length) ||
        (data.split(':').length === data.split('\n').length - 1);
    }
    return isHexChars && seperatedWithNewLine;
  }

  getPage(pageNum) {
    let page = this.content.slice(pageNum * this.pageSize, (pageNum + 1) * this.pageSize);
    return page;
  }
}

export default Data;
