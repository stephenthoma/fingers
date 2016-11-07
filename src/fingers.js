/* jslint node: true, browser: true*/
'use strict';

var murmur = require('murmur');
var swfobject = require('swfobject');

function Finger () {
  if (!(this instanceof Finger)) return new Finger();

  if (this.hasFlash()) {
    this.swf_ready = false;
    this.swf_container_id = "fingerstore";
    Finger[this.swf_container_id] = this;

    this.embedSWFObject(this.swf_container_id);
    this._timeout = setTimeout(function() {
      Finger[this.swf_container_id].swfError(new Error("Failed to load SWF."), 'js');
    }, 5000);
  }
};

Finger.prototype.getPrint = function() {
  var metrics = {};
  metrics.language = this.getLanguages();
  metrics.platform = this.getPlatform();
  metrics.timezone = this.getTimezone();
  metrics.resolution = this.getScreenResolution();
  metrics.flash = this.getFlashVersion();

  return murmur.hash128(JSON.stringify(metrics)).hex();
};

Finger.prototype.getLanguages = function() {
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
  var res = {};
  if (this.hasFlash()) {
    res.flash_ver = swfobject.getFlashPlayerVersion();
  }
  else {
    res.flash_ver = null;
  }
  return res;
};

Finger.prototype.embedSWFObject = function(container_id) {
  var swf_div = document.createElement("object");
  swf_div.setAttribute("id", container_id);
  swf_div.position = "absolute";
  swf_div.style.top = "-1000px";
  swf_div.style.left = "-1000px";
  document.body.appendChild(swf_div);

  var FlashVars = {namespace: container_id};
  var params = {allowScriptAccess: "always"}
  swfobject.embedSWF("storage.swf", container_id, "1", "1", "9.0.0", false, FlashVars, params);
};

Finger.prototype.setFlashLSO = function(value) {
  this._checkSwfReady();
  window[this.swf_container_id].set('finger', value);
};

Finger.prototype.getFlashLSO = function() {
  this._checkSwfReady();
  return window[this.swf_container_id].get('finger');
};

Finger.prototype._checkSwfReady = function() {
  if (!this.swf_ready) {
    throw "SWF connection not yet established."
  }
};

Finger.prototype.swfReady = function() {
  this.setFlashLSO('vallll');
  console.log(this.getFlashLSO());
};

Finger.prototype.swfLoad = function() {
  var that = this;
  setTimeout(function() {
    clearTimeout(that._timeout);
    that.swf_ready = true;
    that.swfReady();
  }, 0);
};

Finger.prototype.swfLog = function(type, source, msg) {
  console.log(msg);
};

Finger.prototype.swfError = function(err, source) {
  console.log(err);
};

window.Finger = Finger;

var finger = new Finger();
console.log(finger.getPrint());
