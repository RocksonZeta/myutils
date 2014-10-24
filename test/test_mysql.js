'use strict';

var mysql = require('../').mysql,
debug = require('debug')('mysql');
require('should');

describe('mysql' , function(){
	it('.getSql' , function(){
		var sql = mysql.getSql('users' , 'id',1,['name','age']);
		debug(sql);
		sql.should.equal("select `name`,`age` from `users` where `id`=1");
	});
	it('#postSql' , function(){
		var sql = mysql.postSql('users' , {name:"jim",age:12});
		debug(sql);
		sql.should.equal("insert into `users` (`name`,`age`) values('jim',12)");
	});
	it('#putSql' , function(){
		var sql = mysql.putSql('users','id',1,{name:"jim",age:12});
		debug(sql);
		sql.should.equal("update `users` set `name`='jim',`age`=12 where `id`=1");
	});
	it('#delSql' , function(){
		var sql = mysql.delSql('users','id',1);
		debug(sql);
		sql.should.equal("delete from `users` where `id`=1");
	});
	it('#build' , function(){
		var sql = mysql.build(':k1,:k2,:k1',{k1:'v1',k2:'v2'});
		debug(sql);
		sql.should.equal("'v1','v2','v1'");
	});
	it('#ukvs' , function(){
		var sql = mysql.ukvs({k1:'v1',k2:'v2'});
		debug(sql);
		sql.should.equal("`k1`='v1',`k2`='v2'");
	});
	it('#ks' , function(){
		var sql = mysql.ks(['k1','k2']);
		debug(sql);
		sql.should.equal("`k1`,`k2`");
	});
	it('#kvs' , function(){
		var sql = mysql.kvs(['k1','k2']);
		debug(sql);
		sql.should.equal("`k1`=:k1,`k2`=:k2");
	});
	it('#cks' , function(){
		var sql = mysql.cks(['k1','k2']);
		debug(sql);
		sql.should.equal(":k1,:k2");
	});
	it('#inSql' , function(){
		var arr = [];
		for(var i = 0 ; i < 5 ;i++)arr.push(i);
		var sql = mysql.inSql('id',arr,false,2);
		debug(sql);
		sql.should.equal(" id in (0,1) or id in (2,3) or id in (4)");
	});
});