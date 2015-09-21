const Avr109Commands = {
  softwareVersion: 0x56, // V
  enterProgrammingMode: 0x50, // P
  leaveProgrammingMode: 0x4c, // L 76
  setAddress: 0x41, // A 65
  writePage: 0x42, // B; TODO: WRITE_PAGE
  typeFlash: 0x46, // F TYPE_FLASH
  exitBootloader: 0x45, // E 69
  readPage: 0x67, // g
  cr: 0x0D, // 13
  failed: 0x3F // ? 63
};

export default Avr109Commands;
