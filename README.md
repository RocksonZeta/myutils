myutils
=======
[![Build Status](https://travis-ci.org/RocksonZeta/myutils.svg?branch=master)](https://travis-ci.org/RocksonZeta/myutils)
[![Coverage Status](https://coveralls.io/repos/RocksonZeta/myutils/badge.png?branch=master)](https://coveralls.io/r/RocksonZeta/myutils?branch=master)
[![NPM version](https://badge.fury.io/js/myutils.svg)](http://badge.fury.io/js/myutils)
[![Dependency Status](https://david-dm.org/RocksonZeta/myutils.svg)](https://david-dm.org/RocksonZeta/myutils)

[![NPM](https://nodei.co/npm/myutils.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/myutils/)

Some useful utils.

##installation
```
$ npm install myutils --save
```

###Example:
```js
'use strict';
require('should');
var utils = require('myutils');

utils.version.compare("1.0" , "1.0.1").should.equal(-1);
utils.net.ipToInt('192.168.0.1').should.equal(3232235521);
```

##API:
invoke convention: `module.$method` should use like this `yield module.$method` in [co](https://github.com/tj/co) or [koa](https://github.com/koajs/koa) envirment.

###hash
- **md5(str)** - md5 string in hex.
- **sig(str,alg)** - hash str with specified alg like 'md5,sha1...'.
- **md5File(file, cb)** - md5 a file.
- **sigFile(file,alg ,cb)** - signature a file with specified alg.
- **timer33(str)** - 
- **$md5File(file)** - md5 file.eg. `yield hash.$md5File('xx')`.
- **$sigFile(file,alg)** - signature a file with specified alg.eg.`yield hash.$sigFile('xx','sha1')`

###net
- **ipToInt(ip)** - ipToInt('192.168.0.1') ==  3232235521;
- **intToIp(ip)** - '192.168.0.1' ==  intToIp(3232235521);

###random
- **nextInt(max)** - generate random integer in [0,max).

###version
- **compare(v1,v2)** - version compare. eg.compare("1.0" , "1.0.1") will be -1.v1 > v2 => 1; v1 == v2 => 0; v1 < v2 => -1

###object
- **parse(jsonStr)** - parse a json string to object with no exception throwing. if `jsonStr` is not a string type,it will return `jsonStr` directly;


###fsp
implements with use system command 
- **mkdirs(dir, cb)** - 
- **mv(src, dst, cb)** - 
- **mvf(src, dst, cb)** - force move ,if dst dir not exits ,create it.
- **cp(src, dst, cb)** - copy
- **cpf(src, dst, cb)** - force copy,if dst dir not exits ,create it.
- **rm(src, cb)** - 
- **$mkdirs(dir)** - 
- **$mv(src, dst)** - 
- **$mvf(src, dst)** - force move ,if dst dir not exits ,create it.
- **$cp(src, dst)** - copy
- **$cpf(src, dst)** - force copy,if dst dir not exits ,create it.
- **$rm(src)** - 

###mysql
- **getSql(table,key,value,keys)** - generate get sql.
- **postSql(table,object)** - generate post sql.
- **putSql(table,key,value,keys)** - generate put sql.
- **delSql(table,key,value,keys)** - generate delete sql.
- **psql(startIndex,pageSize)** - page sql. `psql(0,20)->' limit 0,20'`;`psql(1)->' limit 1'` , `psql()->''` ,`psql(20 ,0) -> ''`;
- **build(sql , params)** - replace `(':k1,:k2 ',{k1:"v1",k2:"v2"})` -> `'v1,v2'`.
- **ukvs(opt ,[prefix])** - {k1:'v1',k2:'v2'} -> `k1`=v1,`k2`=v2 .
- **ks(table,key,value,keys)** - keys. ['k1','k2'] -> k1,k2.
- **cks(['k1','k2'] -> :k1,:k2)** - colon keys. `['k1','k2']` -> `:k1,:k2`.
- **kvs(ks ,[prefix])** - ['k1','k2'] -> `k1`=:k1,`k2`=:k2 .
- **inSql(fieldName , array , [isAnd] ,[page])** - eg.`('f' , [1,2,...,1000])` -> `f in (1,2,3...200) or f in(201,...)` .
- **batch(con,sqls,page,needResult,cb)** - batch execute sqls.
- **$batch(con,sqls,page,needResult)** - batch execute sqls, used in co,must use `yield mysql.$batch(con,sqls,page,needResult)` .

### collection
- **group(array,key)** - group `array` by the `key`.`array` should like [{} ,{}].return {key:[]}
- **groupOne(array,key)** - group `array` by the `key` , each group only has the on record. return {key:{}}
- **col(array,key,keepNullValue)** - extract one column from array.if `keepNullValue` is true,the return will keep the null value.



###image
heihei...

