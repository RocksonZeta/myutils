'use strict';
var crypto = require('crypto'),
	fs = require('fs');


exports.md5 = function(str) {
	var md5sum = crypto.createHash('md5');
	return md5sum.update(str).digest('hex');
};

/**
signature string
@param {string} str -  
@param {string} alg -  eg.md5 ,sha1
@return {string} 
*/
exports.sig = function(str,alg) {
	var md5sum = crypto.createHash(alg);
	return md5sum.update(str).digest('hex');
};
exports.sigFile = function(file,alg ,cb) {
	var sig = crypto.createHash(alg);
	var s = fs.ReadStream(file);
	s.on('data', function(d) {
		sig.update(d);
	});
	s.on('end', function() {
		var d = sig.digest('hex');
		cb(null, d);
	});
};
exports.md5File = function(file, cb) {
	exports.sigFile(file ,'md5' , cb);
};
exports.timer33 = function(str){
	var hash = 0;
    for(var i = 0; i < str.length; i++){
		hash = ((hash << 5) + hash) + str.charCodeAt(i);
	}
	return hash;
};