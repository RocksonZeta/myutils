'use strict';

var object = require('../').object;
require('should');

describe('object' , function(){
	it('parse should be okay' , function(){
		object.parse("1").should.equal(1);
		object.parse({a:1}).should.eql({a:1});
		(null == object.parse("{43")).should.be.ok;
	});


});