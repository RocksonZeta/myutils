/**
dispose records like [{id:1,name:"",},....]

*/
'use strict';
(function(){
	var records = {};
	var root, previousRecords;

    root = this;
    if (root != null) {
      previousRecords = root.records;
    }

	records.find = function(rs , rules , combineType) {
		combineType = combineType || "&";
		var result = [];
		for(var i = 0 ; i <rs.length ;i++){
			if(records.match(rs[i] , combineType ,rules)){
				result.push(rs[i]);
			}
		}
		return result;
	};

	/**
	@param {object} record 
	@param {string} directive - directly match. age
	@param {any} 10 , {id:1}

	*/
	var basicDirectives = {
		"&":1,		//and
		"|":1,		//or
		"!":1,		//not
		">":1,
		">=":1,
		"<":1,
		"<=":1,
		"~":1,		//regexp pattern
		"@":1,		//in
		"#":1,		//fn
	};
	function match(record,directive,params) {
		if(!basicDirectives[directive]){
			return record[directive] == params;
		}
		var k ,i;
		switch (directive) {
			case "&":
					if(params instanceof Array){
						for(i=0 ;i < params.length ;i++ ){
							for(k in params[i]){
								if(!match(record ,k, params[i][k]))return false;
							}
						}
					}
					if(!(params instanceof Array) && 'object' == typeof params) {
						for(k in params){
							if(!match(record,k, params[k]))return false;
						}
					}
				break;
			case "|":
					if(params instanceof Array){
						for(i=0 ;i < params.length ;i++ ){
							for(k in params[i]){
								if(match(record ,k, params[i][k]) )break;
							}
						}
						return false;
					}
					if(!(params instanceof Array) && 'object' == typeof params) {
						var ok = false;
						for(k in params){
							if(match(record ,k, params[k]) ){
								ok = true;
								break;
							}
						}
						if(!ok)return false;
					}
				break;
			case "!":
				if(!(params instanceof Array) && 'object' == typeof params) {
					var ok = false;
					for(k in params){
						if(!match(record ,k, params[k]) ){
							ok = true;
							break;
						}
					}
					if(!ok)return false;
				}
				break;
			case ">":
				for(k in params){
					if(record[k]<=params[k]){
						return false;
					}
				}
				break;
			case ">=":
				for(k in params){
					if(record[k]<params[k]){
						return false;
					}
				}
				break;
			case "<":
				for(k in params){
					if(record[k]>=params[k]){
						return false;
					}
				}
				break;
			case "<=":
				for(k in params){
					if(record[k]>params[k]){
						return false;
					}
				}
				break;
			case "@":
				for(k in params){
					if(params[k] instanceof Array){
						if(-1 === params[k].indexOf(record[k]))return false;
					}
					if(!(params[k] instanceof Array) && 'object' == typeof params[k]) {
						if(!params[k][record[k]])return false;
					}
					if(params[k] != record[k])return false;
				}
				break;
			case "~":
				for(k in params){
					if(params[k] instanceof RegExp){
						if(!params[k].test(record[k]))return false;
					}
					if(params[k] instanceof Array){
						if(-1 != params[k].indexOf(record[k]))return false;
					}
				}
				break;
			case "#":
				for(k in params){
					if('function' == typeof params[k]){
						if(!params[k](record))return false;
					}
					if(params[k] instanceof Array){
						for(i = 0 ; i < params[k].length ;i++){
							if(!params[k][i](record))return false;
						}
					}
				}
				break;

		}
		return true;
	}

	records.match = match;

	/**
	a[b].d[e.f].g ->[a b c d e.f g]
	*/
	records.resovlePath = function(path) {
		var result = []; 
		var s = 0;
		var c ;
		var part =''; //path part
		for(var i = 0 ; i < path.length ;i++){
			c = path[i];
			switch(s){
				case 0:  //status .path;dot path ; switch .->0,[ ->1
				if('.' == c){
					if(part){
						result.push(part);
						part='';
					}
					break;
				}
				if('[' == c){
					if(part){
						result.push(part);
						part='';
					}
					s = 1;
					break;
				}
				part += c;
				break;
				case 1:  // status [path; switch ] ->end ]
					if(']' == c){
						if(part){
							result.push(part);
							part='';
						}
						s = 0;
						break;
					}
					part+= c;
				break;
			}
		}
		if(0 === s && ''!==part){
			result.push(part);
		}
		return result;
	};

	records.getValue = function(object , path) {
		var pathes = records.resovlePath(path);
		var value = object;
		for(var i = 0 ;i  <  pathes.length ;i++){
			pathes[i] = pathes[i];
			if(''=== pathes[i]){
				continue;
			}

			if(!value){
				return value;
			}
			value = value[pathes[i]];
		}
		return value;
	};


	records.cols = function(rs ,pathArgs) {
		var pathMap = {};
		var i;
		if(pathArgs instanceof Array){
			for(i = 0 ; i< pathArgs.length ;i++){
				pathMap[pathArgs[i]] = pathArgs[i];
			}
		}else if(arguments.length>2 || 'string' == typeof pathArgs){
			for(i =1 ; i<arguments.length;i++){
				pathMap[arguments[i]] = arguments[i];
			}
		}else{
			pathMap = pathArgs;
		}
		var result = [];
		for(i = 0 ; i < rs.length ;i++){
			var val ={};
			for(var path in pathMap){
				val[pathMap[path]] = records.getValue(rs[i], path);
			}
			result.push(val);
		}
		return result;
	};

	records.col = function(rs,path,ignoreNullValue) {
		var result = [];
		var val;
		for(var i = 0 ; i < rs.length ;i++){
			val = records.getValue(rs[i], path);
			if(ignoreNullValue && (null === val || 'undefined' == typeof val)){
				continue;
			}
			result.push(val);
		}
		return result;
	};
	records.combine = function(rs , key ,value) {
		var r = {};
		for(var i = 0 ; i < rs.length ;i++){
			r[rs[i][key]] = rs[i][value];
		}
		return r;
	}

	// Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = records;
    }
    // AMD / RequireJS
    else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return records;
        });
    }
    // included directly via <script> tag
    else {
        root.records = records;
    }

}());