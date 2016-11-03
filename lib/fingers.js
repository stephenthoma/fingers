/* jslint node: true, browser: true*/
'use strict';

var murmur = require('murmur');

function Finger () {
  if (!(this instanceof Finger)) return new Finger();
}

Finger.prototype.getPrint = function() {
  var metrics = {};
  metrics.language = this.getLanguage();

  return murmur.hash128(JSON.stringify(metrics)).hex();
};

Finger.prototype.getLanguage = function() {
  if (navigator.language) {
    return navigator.language.toLowerCase();
  }
};

var finger = new Finger();
console.log(finger.getPrint());
