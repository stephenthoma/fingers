/* jslint node: true, browser: true*/
'use strict';

var murmur = require('murmur');
var swfobject = require('swfobject');

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

Finger.prototype.hasFlash = function() {
  if (navigator.plugins["Shockwave Flash"]) {
    return true;
  }
  return false;
};

Finger.prototype.getFlashVersion = function() {
  if (this.hasFlash()) {
    return {flash_ver: swfobject.getFlashPlayerVersion()};
  }
};

Finger.prototype.setFlashLSO = function() {
  var swf_div = document.createElement("div");
  swf_div.setAttribute("id", "swfcontainer");
  document.body.appendChild(swf_div);

  var flashvars = {everdata: "55555"};
  swfobject.embedSWF("lso.swf", "swfcontainer", "1", "1", "9.0.0", false, flashvars);
};

var finger = new Finger();
console.log(finger.getPrint());
