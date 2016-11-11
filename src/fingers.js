/* jslint node: true, browser: true*/
'use strict';

var murmur = require('murmur');
var swfobject = require('swfobject');

function Finger() {
  if (!(this instanceof Finger)) return new Finger();

  this.has_flash = false;
  if (this._hasFlash()) {
    this.has_flash = true;
    this.swf_ready = false;
    this.swf_container_id = "fingerstore";
    Finger[this.swf_container_id] = this; // Namespacing to make Flash happy

    this._embedSWFObject(this.swf_container_id);
    // Error out if has flash but can't connect to SWF
    this._timeout = setTimeout(function() {
      Finger[this.swf_container_id].swfError(new Error("Failed to load SWF."), 'js');
    }, 5000);
  }
}

Finger.prototype.getPrint = function() {
  var metrics = {};
  metrics = this.gatherDeviceMetrics(metrics);
  if (!this.has_flash) {
    console.log(murmur.hash128(JSON.stringify(metrics)).hex());
  }
  else {
    if (self.getPrint === undefined) {
      self = this;
    }

    if (this.swf_ready) {
      metrics.lso = this.getFlashLSO();
      metrics.flash_fonts = this.getFlashFonts();
      console.log(metrics);
      console.log(murmur.hash128(JSON.stringify(metrics)).hex());
    }
    else { // Wait for swf to be ready
      setTimeout(function() {
        self.getPrint();
      }, 300);
    }
  }
};

Finger.prototype.gatherDeviceMetrics = function(metrics) {
  metrics.language = this.getLanguages();
  metrics.platform = this.getPlatform();
  metrics.timezone = this.getTimezone();
  metrics.resolution = this.getScreenResolution();
  metrics.flash = this.getFlashVersion();
  return metrics;
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

Finger.prototype._hasFlash = function() {
  if (navigator.plugins["Shockwave Flash"]) {
    return true;
  }
  return false;
};

Finger.prototype.getFlashVersion = function() {
  var res = {};
  if (this.has_flash) {
    res.swf_ver = swfobject.getFlashPlayerVersion();
    res.nav_ver = navigator.plugins["Shockwave Flash"].description
                  .split("Shockwave Flash").pop();
  }
  return res;
};

Finger.prototype._embedSWFObject = function(container_id) {
  var swf_div = document.createElement("object");
  swf_div.setAttribute("id", container_id);
  swf_div.position = "absolute";
  swf_div.style.top = "-1000px";
  swf_div.style.left = "-1000px";
  document.body.appendChild(swf_div);

  var FlashVars = {namespace: container_id};
  var params = {allowScriptAccess: "always"};
  swfobject.embedSWF("finger.swf", container_id, "1", "1", "9.0.0", false,
                     FlashVars, params);
};

Finger.prototype.setFlashLSO = function(value) {
  this._checkSwfReady();
  window[this.swf_container_id].setLSO('finger', value);
};

Finger.prototype.getFlashLSO = function() {
  this._checkSwfReady();
  return window[this.swf_container_id].getLSO('finger');
};

Finger.prototype.getFlashFonts = function() {
  this._checkSwfReady();
  return window[this.swf_container_id].getFonts();
};

Finger.prototype._checkSwfReady = function() {
  if (!this.swf_ready) {
    throw "SWF connection not yet established.";
  }
};

Finger.prototype.swfReady = function() {
  var lso;
  if (this.getFlashLSO()) {
    lso = this.getFlashLSO();
  }
  else {
    lso = murmur.hash128(Math.random().toString()).hex();
    this.setFlashLSO(lso);
  }
};

// Flash callback function called on connection success
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

// Finger must be a global for Flash communication
window.Finger = Finger;

var finger = new Finger();
finger.getPrint();
