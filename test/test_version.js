'use strict';

var version = require('../').version;
require('should');

describe('version' , function(){
	it('compare - normal tests should be okay' , function(){
		version.compare('1.1' , '1.0').should.equal(1);
		version.compare('1.0' , '1.1').should.equal(-1);
		version.compare('1.1' , '1.1').should.equal(0);
		version.compare('1.1.0' , '1.1').should.equal(1);
	});
	it('compare - abnormal tests should be okay' , function(){
		version.compare('1.0' , null).should.equal(1);
		version.compare(null , '1.0').should.equal(-1);
		version.compare(null , null).should.equal(0);
		version.compare(null , 0).should.equal(0);
		version.compare(1 ,1).should.equal(0);
		version.compare(1.0 ,1).should.equal(0);
		version.compare(1.0 ,'1.0').should.equal(-1);
	});

});