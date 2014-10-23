'use strict';
exports.group = function(arr , k){
	var r  = {};
	for(var i in arr){
		if(!r[arr[i][k]] ){
			r[arr[i][k]] = [arr[i]];
		}else{
			r[arr[i][k]].push(arr[i]);
		}
	}
	return r;
};

exports.groupOne = function(arr , k){
	var r  = {};
	for(var i in arr){
		r[arr[i][k]] = arr[i];
	}
	return r;
};

exports.col =function(arr , k , n){
	var r = [];
	if(!arr){
		return r;
	}
	for(var i in arr){
		if(!arr[i][k] && !n){
			continue;
		}
		r.push(arr[i][k]);
	}
	return r;
};
