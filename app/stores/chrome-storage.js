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
    let _this = this;
    return new Promise(function(resolve) {
      chrome.storage.local.get(_this.key, function(response) {
        console.log(response);
        resolve(response);
      });
    });

  },

  clear: function() {
    chrome.storage.local.remove(this.key, this.loginCallback);
    this._lastData = {};
  }
});
