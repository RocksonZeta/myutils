'use strict';

/**
version compare. eg.compare("1.0" , "1.0.1") will be -1. 
@param {string} v1 - version 1
@param {string} v2 - version 2
@return int [1,0,-1]
v1 > v2 => 1
v1 == v2 => 0
v1 < v2 => -1
*/
exports.compare = function(v1 , v2){
	var v1s = v1.split('.');
	var v2s = v2.split('.');
	var m = v1s.length>v2s.length?v1s.length:v2s.length;
	for(var i = 0 ; i < m ;i++){
		if(!v1s[i]){
			return -1;
		}
		if(!v2s[i]){
			return 1;
		}
		if(v1s[i] && v2s[i] &&v1s[i]*1>v2s[i]*1){
			return 1;
		}
		if(v1s[i] && v2s[i] && v1s[i]*1<v2s[i]*1){
			return -1;
		}
	}
	return 0;
};