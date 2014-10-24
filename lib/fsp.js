'use strict';
var fs = require('fs'),
	exec = require('child_process').exec,
	util = require('util'),
	path = require('path');


var osv = 1;
if (-1 != require('os').platform().indexOf('win32')) {
	osv = 2;
}

exports.mkdirs = function(dir, cb) {
	if (1 == osv) {
		exec("mkdir -p " + dir, cb);
	} else if (2 == osv) {
		exec("md " + dir, cb);
	}
};


exports.mv = function(src, dst, cb) {
	if (util.isArray(src)) {
		src = src.join(' ');
	}
	if (1 == osv) {
		exec("mv -f " + src + " " + dst, cb);
	} else if (2 == osv) {
		exec("move /Y " + src + " " + dst, cb);
	}
};


exports.mvf = function(src ,dst, cb){
	exports.mkdirs(/\/|\\$/.test(dst)?src:path.dirname(dst), function(e,so,se){
		if(e || se){
			return cb(e,so,se);
		}
		exports.mv(src,dst,cb);
	});
};


exports.cp = function(src, dst, cb) {
	if (util.isArray(src)) {
		src = src.join(' ');
	}
	if (1 == osv) {
		exec("cp -fR " + src + " " + dst, cb);
	} else if (2 == osv) {
		exec("copy /Y " + src + " " + dst, cb);
	}
};

exports.cpf = function(src ,dst, cb){
	exports.mkdirs(/\/|\\$/.test(dst)?src:path.dirname(dst), function(e,so,se){
		if(e || se){
			return cb(e,so,se);
		}
		exports.cp(src,dst,cb);
	});
};

exports.rm = function(f, cb) {
	if (util.isArray(f)) {
		f = f.join(' ');
	}
	if (1 == osv) {
		exec("rm -rf " + f, cb);
	} else if (2 == osv) {
		exec("del /F /Q " + f, cb);
	}
};