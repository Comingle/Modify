import LocalStorage from 'simple-auth/stores/local-storage'

export default LocalStorage.extend({

  logginCallback: function (response) {
    console.log(response);
  },

  persist: function(data) {
    var _data = {}
    _data[this.key] = data;
    chrome.storage.local.set(_data, this.logginCallback);
    this._lastData = this.restore();
  },

  restore: function() {
    var data = chrome.storage.local.get(this.key, this.logginCallback);
    return data;
  },

  clear: function() {
    chrome.storage.local.remove(this.key, this.logginCallback);
    this._lastData = {};
  }
});
