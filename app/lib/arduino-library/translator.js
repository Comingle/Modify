import IntelHEX from './intel-hex';

const Translator = {};

Translator.binToIntelHEX = Translator.binToHex;

Translator.binToHex = function (bin) {
  let byteCount = 16;
  let startAddress = 0;
  let useRecordHeader = true;

  bin = new IntelHEX(bin, byteCount, startAddress, useRecordHeader);
  bin.createRecords();
  return bin.getHEXFile();
};

Translator.binToHex2 = function (bin) {
  let bufferView = new Uint8Array(bin);
  let hexes = [];
  for (let i = 0; i < bufferView.length; ++i) {
    hexes.push(bufferView[i]);
  }
  return hexes;
};

Translator.intelHEXToBin = function (hex) {
  hex = new IntelHEX(hex);
  return hex.parse();
};

Translator.hexArrayToBin = function (hex) {
  let buffer = new ArrayBuffer(hex.length);
  let bufferView = new Uint8Array(buffer);
  for (let i = 0; i < hex.length; i++) {
    bufferView[i] = hex[i];
  }
  return buffer;
};

Translator.isHexFormat = function(data) {
  let isHexChars, seperatedWithNewLine;
  isHexChars = /^:([A-Fa-f0-9]{2}){8,9}/.test(data);
  seperatedWithNewLine = true;
  if (data.split(':').length > 2) {
    seperatedWithNewLine =
      data.split(':').length === data.split('\n').length ||
      data.split(':').length === data.split('\n').length - 1;
  }
  return isHexChars && seperatedWithNewLine;
};

Translator.hexRep = function (intArray) {
  let buf = '[';
  let sep = ';';
  for (let i = 0; i < intArray.length; ++i) {
    let h = intArray[i].toString(16);
    if (h.length === 1) { h = '0' + h; }
    buf += (sep + '0x' + h);
    sep = ',';
  }
  buf += ']';
  return buf;
};

Translator.storeAsTwoBytes = function (n) {
  let lo = (n & 0x00FF);
  let hi = (n & 0xFF00) >> 8;
  return [hi, lo];
};

export default Translator;
