To browserify the javascript run browserify or watchify ie:
`watchify src/fingers.js -d -o dist/script.js -v`

Either use the included SWF file, or compile from source with the Flex SDK via:
`mxmlc -o finger.swf Finger.as`

The Flex SDK can be downloaded from https://www.adobe.com/devnet/flex/flex-sdk-download.html
If compilation fails with error `Error: This Java instance does not support a 32-bit JVM.`,
open the mxmlc file and set `D32=''` on line 47.
