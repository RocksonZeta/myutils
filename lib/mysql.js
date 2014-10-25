'use strict';


exports.getSql = function(table,key,value,keys){
	var mysql = require('mysql');
	return "select "+exports.ks(keys)+" from `"+table+"` where `"+key+"`="+mysql.escape(value);
};

exports.postSql = function(table,object){
	var keys = Object.keys(object);
	var mysql = require('mysql');
	var sql = 'insert into `'+table+'` ('+exports.ks(keys)+') values(';
	for(var i = 0 ; i < keys.length;i++){
		sql +=mysql.escape(object[keys[i]]);
		if(i<keys.length-1)sql +=',';
	}
	sql+=")";
	return sql;
};

exports.putSql = function(table,key,value,newValues){
	var mysql = require('mysql');
	var sql = "update `"+table+"` set ";
	var keys = Object.keys(newValues);
	for(var i = 0 ; i < keys.length;i++){
		sql +="`"+keys[i]+"`="+mysql.escape(newValues[keys[i]]);
		if(i<keys.length-1)sql +=',';
	}
	sql +=" where `"+key+"`="+mysql.escape(value);
	return sql;
};

exports.delSql = function(table,key,value){
	var mysql = require('mysql');
	return "delete from `"+table+"` where `"+key+"`="+mysql.escape(value);
};

/**

*/
exports.psql = function(startIndex , pageSize){
	if('undefined' == typeof startIndex){
		return "";
	}
	if(!pageSize || 0>= pageSize){
		return ' limit '+ startIndex;
	}
	return ' limit '+startIndex+','+pageSize;
};

/**
replace (':k1,:k2 ',{k1:"v1",k2:"v2"}) -> 'v1,v2';
*/
exports.build =  function(sql , params){
	params = params ||{};
	return sql.replace(/:(\w+?)\b/g ,function(k1,k2){
		return require('mysql').escape(params[k2]);
	});
};

/**
update key and values.{k1:'v1',k2:'v2'} -> `k1`=v1,`k2`=v2;
@param {string|optional} p - prefix. eg.p.`k1`
*/
exports.ukvs = function(opt ,p){
	var sql ="";
	for(var i in opt){
		sql += (p?p+".":"")+'`'+i+"`="+require('mysql').escape(opt[i])+",";
	}
	return sql.substring(0 , sql.length-1);
};

/**
keys
['k1','k2'] -> k1,k2
if has prefix, (['k1','k2'] ,'p') - >p.`k1`,p.`k2`
*/
exports.ks = function(ks , p){
	var sql ="";
	for(var i in ks){
		sql += (p?p+".":"")+'`'+ks[i]+"`";
		if(i<ks.length-1){
			sql+=",";
		}
	}
	return sql;
};

/**
colon keys
['k1','k2'] -> :k1,:k2
*/
exports.cks = function(ks){
	var sql ="";
	for(var i in ks){
		sql += ':'+ks[i];
		if(i<ks.length-1){
			sql+=",";
		}
	}
	return sql;
};

/**
['k1','k2'] -> `k1`=:k1,`k2`=:k2
*/
exports.kvs = function(ks ,p){
	var sql ="";
	for(var i in ks){
		sql += (p?p+".":"")+'`'+ks[i]+"`=:"+ks[i];
		if(i<ks.length-1){
			sql+=",";
		}
	}
	return sql;
};


/**
@param {string} f - field name 
@param {string} arr - target array
@param {bool|optional} and in block link.true link will be 'and' ,false link is 'or'.default false.
return {string} - ('f' , [1,2,...,1000]) -> f in (1,2,3...200) or f in(201,...);
*/
exports.inSql = function(f , arr , and ,page){
	if(!arr||0>=arr.length){
		return " in (null)";
	}
	page = page|| 200;
	var r = " "+f+" in ";
	for(var i = 0 ; i < arr.length ;i++){
		if(1 == (i+1)%page){
			r+="(";
		}
		r+=require('mysql').escape(arr[i]);
		if(i<arr.length-1 && 0!==((i+1)%page) ){
			r+=',';
		}
		if(0 === (i+1)%page || i==arr.length-1){
			r+=")";
		}
		if(0 === (i+1)%page && i!==arr.length-1){
			r+=and ?" and "+f+" in ":" or "+f+" in ";
		}
	}
	return r;
};


/**
how to test in travis?
*/
exports.batch = function(con,sqls,page,needResult,cb){
	page = page || 200;
	var index = 0 ;
	var result =[];
	function exe() {
		if(index>=sqls.length){
			if(needResult){
				return cb();
			}
			return cb(null ,result);
		}
		var sql = "";
		while(index<sqls.length){
			sql += sqls[index]+";";
			index++;
			if(0 === index%page){
				break;
			}
		}
		con.query(sql , function(e,r){
			if(e){
				return cb(e);
			}
			if(needResult){
				result = result.concat(r);
			}
			exe();
		});
	}
	exe();
};

exports.$batch = function(con,sqls,page,needResult){
	return function(done){
		exports.batch(con,sqls,page,needResult,done);
	};
};