// Largely pulled from https://github.com/nfriedly/Javascript-Flash-Cookies
// and https://github.com/samyk/evercookie/blob/master/assets/evercookie.swf
package {

import flash.display.Sprite;
import flash.external.ExternalInterface;
import flash.text.TextField;
import flash.text.Font;
import flash.system.Security;
import flash.net.SharedObject;
import flash.net.SharedObjectFlushStatus;

public class Finger extends Sprite {

  // The JS callback functions should all be on a global variable at SwfStore.<namespace>.<function name>
  private var jsNamespace:String = "Finger.fingerstore.";

  private var namespaceCheck:RegExp = /^[a-z0-9_\/]+$/i;
  private var logText:TextField;

  public function Finger() {
    if (!ExternalInterface.available) {
      return;
    }
    ExternalInterface.marshallExceptions = true;

    if (this.loaderInfo.parameters.namespace && !namespaceCheck.test(this.loaderInfo.parameters.namespace)) {
      return;
    }

    // Get external log function
    if (this.loaderInfo.parameters.namespace) {
      jsNamespace = "Finger['" + this.loaderInfo.parameters.namespace+ "'].";
    }

    Security.allowDomain("*");
    Security.allowInsecureDomain("*");

    var dataStore:SharedObject = SharedObject.getLocal(this.loaderInfo.parameters.namespace);

    // Setup external interface
    ExternalInterface.addCallback("setLSO", setValue);
    ExternalInterface.addCallback("getLSO", getValue);
    ExternalInterface.addCallback("getFonts", getSystemFonts);

    ExternalInterface.call(jsNamespace + "swfLoad");
  }

  private function onError(errStr:String):void {
    if (ExternalInterface.available) {
      ExternalInterface.call(jsNamespace + "swfError", errStr);
    }
  }

  // Store lso data
  private function setValue(key:String, val:*):void {
    var dataStore:SharedObject = SharedObject.getLocal(this.loaderInfo.parameters.namespace);
    log('Setting ' + key + ' = ' + val);
    dataStore.data[key] = val;
    flush(dataStore);
  }

  // Get lso data
  private function getValue(key:String):String {
    var dataStore:SharedObject = SharedObject.getLocal(this.loaderInfo.parameters.namespace);
    if (dataStore.data.hasOwnProperty(key)) {
      var val:String = dataStore.data[key];
      return val;
    }
    else {
      return null;
    }
  }

  // Flush dataStore changes
  private function flush(dataStore:SharedObject):void {
    var flushStatus:String = null;
    try {
      flushStatus = dataStore.flush(10000);
    } catch (error:Error) {
      onError("Unable to write SharedObject to disk: " + error.message);
    }
  }

  private function getSystemFonts():Array {
    return Font.enumerateFonts(true).sortOn("fontName", Array.CASEINSENSITIVE);
  }

  // Send logs to js
  private function log(str:String):void {
    ExternalInterface.call(jsNamespace + "swfLog", 'debug', 'swfStore', 'FLASH: '+ str);
  }
}
}
