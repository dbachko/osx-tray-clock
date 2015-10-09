'use strict';

const fs = require('fs');


var nconf = require('nconf').file({
  file: getConfPath() + '/config.json'
});

function setSettings(settingKey, settingValue) {
  nconf.set(settingKey, settingValue);
  nconf.save();
}

function getSettings(settingKey) {
  nconf.load();
  return nconf.get(settingKey);
}

function getConfPath() {
  var confPath = `${process.env['HOME']}/.osx-tray-clock`;

  // Generate config path if not exists
  mkdirSync(confPath);

  return confPath;
}

function mkdirSync(path) {
  try {
    fs.mkdirSync(path);
  } catch(e) {
    if ( e.code != 'EEXIST' ) throw e;
  }
}

module.exports = {
  setSettings: setSettings,
  getSettings: getSettings
};
