'use strict';


/**
parse a json string , no exception throws
@param {string|object} if jsonStr not a string , it will be return jsonStr directly.
*/
exports.parse = function(jsonStr){
	if('string' != typeof jsonStr){
		return jsonStr;
	}
	try{
		return JSON.parse(jsonStr);
	}catch(e){
		return null;
	}
};