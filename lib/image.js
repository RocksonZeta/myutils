'use strict';
var gm = require('gm');
/**
@param {object} opt
@param {string} opt.src
@param {string} opt.dst
@param {string|optional} opt.format - eg. png or jpg
@param {int|optional} opt.width
@param {int|optional} opt.height
@param {int|optional} opt.quality - [0-100],the higher ,the better
@param {int|optional} opt.depth - [0-32]
@param {int|optional} opt.colors - [0-256]
@param {object|optional} opt.gmOpt -  gm options. eg.{imageMagick: true}
@param {object|optional} opt.resizeOpt -  
@cb {function} make thumb over ,it will be called.
*/
exports.thumb = function(opt, cb){
	var g = gm(opt.src);
	if(opt.gmOpt){
		g.options(opt.gmOpt);
	}
	g.size(function(e , size){
		if(e){
			return cb(e);
		}
		var wr = opt.width/size.width || 0;
		var hr = opt.height/size.height || 0;
		var s = (wr>=hr?true:false);
		var mw ,mh ; //middle width , midel height
		var x =0 , y=0;
		if(s){ // use width
			mw = opt.width;
			mh = Math.ceil(size.height*wr);
			y = Math.floor((mh-opt.height)/2);
		}else{
			mw = Math.ceil(size.width*hr);
			mh = opt.height;
			x = Math.floor((mw-opt.width)/2);
		}
		g.resize(mw,mh,opt.resizeOpt).crop(opt.width,opt.height,x,y);
		if(opt.depth)g.bitdepth(opt.depth);
		if(opt.colors)g.colors(opt.colors);
		if(opt.format)g.setFormat(opt.format);
		if('undefined' != typeof opt.quality){
			g.quality(opt.quality);
		}
		g.write(opt.dst , function(e){
			return cb(e,  opt.dst);
		});
	});
};

/**
make multi thumbs
@param {object} opt - options
@param {string} opt.src
@param {array} sizes - thumb sizes
@param {string|optional} opt.dstFn - function(size,opt) ，default function: image.sizeFile
@param {string|optional} opt.format - eg. png or jpg
@param {int|optional} opt.quality - [0-100],the higher ,the better
@param {int|optional} opt.depth - [0-32]
@param {int|optional} opt.colors - [0-256]
@param {object|optional} opt.gmOpt -  gm options. eg.{imageMagick: true}
@param {object|optional} opt.resizeOpt -  

*/
exports.thumbs = function(opt , cb){
		if(!opt.sizes || opt.sizes.length<=0){
		return cb();
	}
	var i = 0 ;
	var files = [];
	function r(){
		exports.thumb({
			gmOpt:opt.gmOpt,
			src:opt.src,
			dst:opt.dstFn?opt.dstFn(opt.src,opt.size[i],opt): exports.sizeFile(opt.src,opt.sizes[i]),
			width:opt.sizes[i][0],
			height:opt.sizes[i][1],
			quality:opt.quality,
			format:opt.format,
			colors:opt.colors,
			depth:opt.depth,
			resizeOpt:opt.resizeOpt, 
		} , function(e , file){
			if(e){
				return cb(e);
			}
			files[i] = file;
			i+=1;
			if(i>=opt.sizes.length){
				return cb(null ,files);
			}else{
				r();
			}
		});
	}
	r();
};

/**
convert /xx/xx.jpg,[100,200] -> /xx/xx.100x200.jpg
@param {string} file - eg./image/jim.jpg
@param {array} size - [width,height], eg.[100,200]
@return {string} - eg. /image/jim.100x200.jpg
*/
exports.sizeFile = function(file ,size){
	var li = file.lastIndexOf('.');
	if(!size || 0===size.length){
		return file;
	}
	if(-1 == li ){
		return file+size.join('x');
	}else{
		return file.substring(0,li)+'.'+size.join('x')+file.substring(li);
	}
};