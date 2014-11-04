'use strict';

/**
[0,max)
*/
exports.nextInt = function(max){
	return Math.floor(Math.random()*max);
};

var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
/**
128bit id'len should be 22 , 
*/
exports.ruid = function(len){
	len = len||20;
	var r = '';
	for(var i = 0 ; i < len ;i++){
		r+= str[exports.nextInt(str.length)];
	}
	return r;
};
