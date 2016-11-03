/* jslint node: true, browser: true*/
'use strict';

var murmur = require('murmur');

function Finger () {
  if (!(this instanceof Finger)) return new Finger();
}

Finger.prototype.getPrint = function() {
  var metrics = {};
  metrics.language = this.getLanguage();
  metrics.platform = this.getPlatform();
  metrics.timezone = this.getTimezone();
  metrics.resolution = this.getScreenResolution();

  return murmur.hash128(JSON.stringify(metrics)).hex();
};

Finger.prototype.getLanguage = function() {
  if (navigator.language) {
    return navigator.language.toLowerCase();
  }
};

Finger.prototype.getPlatform = function() {
  if (navigator.platform) {
    return navigator.platform;
  }
};

Finger.prototype.getTimezone = function() {
  return new Date().getTimezoneOffset();
};

Finger.prototype.getScreenResolution = function() {
  return [window.screen.availHeight, window.screen.availWidth];
};

var finger = new Finger();
console.log(finger.getPrint());
