'use strict';
var random = require('../').random;
require('should');

describe('random' , function(){
	it('nextInt' , function(){
		var r= random.nextInt(0);
		r.should.equal(0);
	});
});