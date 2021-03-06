import events from "events";

export const WEDATA_URL =
  "http://wedata.net/databases/AutoPagerize/items_all.json";

class Prefs {
  constructor(defaultKeys) {
    this._defaultKeys = defaultKeys;
    this._emitter = new events.EventEmitter();

    browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local") {
        Object.keys(changes).forEach((key) => {
          this._emitter.emit(key, changes[key].newValue, changes[key].oldValue);
        });
      }
    });
  }
  get(keysArray) {
    const keysObject = {};
    keysArray.forEach((key) => {
      keysObject[key] = this._defaultKeys[key];
    });
    return browser.storage.local.get(keysObject);
  }
  async set(keysObject) {
    await browser.storage.local.set(keysObject);
  }
  on(keyName, listener) {
    this._emitter.on(keyName, listener);
  }
  off(keyName, listener) {
    this._emitter.removeListener(keyName, listener);
  }
}

export default new Prefs({
  siteinfoList: [WEDATA_URL],
  siteinfoCache: {},
  userSiteinfo: "",
  excludeList: [],
  openLinkInNewTab: true,
  addHistory: false,
  globalDisable: false,
});
