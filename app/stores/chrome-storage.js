import LocalStorage from 'simple-auth/stores/local-storage';

export default LocalStorage.extend({

  loginCallback: function (response) {
    console.log(response);
  },

  persist: function(data) {
    var _data = {};
    _data[this.key] = data;
    chrome.storage.local.set(_data, this.loginCallback);
    this._lastData = this.restore();
  },

  restore: function() {
    var data = chrome.storage.local.get(this.key, this.loginCallback);
    return data;
  },

  clear: function() {
    chrome.storage.local.remove(this.key, this.loginCallback);
    this._lastData = {};
  }
});
