'use strict';
var records = require('../').records;
require('should');
describe('records' , function(){
	it('normal find' , function(){
		var data = [];
		for(var i = 0 ; i < 10 ;i++){
			data.push({id:i, age:i*3 , name:"n"+i});
		}
		var result = records.find(data , {'>':{id:5},'<':{id:8} });
		console.log(result)
		// result.length.should.equal(4);
	});
	it('#getValue' , function(){
		var data = {a1:{a11:{a111:[1,2,3]}} , a2:{a21:{a211:1}}};
		records.getValue(data,'a1.a11.a111.0').should.equal(1);
		// result.length.should.equal(4);
	});
	it('#cols' , function(){
		var data = [{a1:{a11:{a111:[1,2,3]}} , a2:{a21:{a211:1}}},{a1:{a11:1} , a2:{a21:{a211:3}}}];
		// records.cols(data,'a1.a11.a111.1').should.equal(1);
		records.cols(data,'a1[a11][a111].1').should.equal(1);
		// result.length.should.equal(4);
	});
});
