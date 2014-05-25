'use strict';

/*globals elopts:false */


describe("Custom", function() {
 
  loadFixtures("test.html");
  
  var element = $('#test')[0];
 
  var options = elopts.newInstance({
    json: false, 
    dataset: false, 
    cdata: false, 
    params: false
  })(element);
  
  it("options.option should not return 'test1'", function() {
    expect(options.option === 'test1').not.toBeTruthy();
  });
  
  it("options.json should not return an array containing 'test2'", function() {
    expect(options.json instanceof Array).not.toBeTruthy();
  });
  
  it("options.data should not return an object containing a key named 'result' having a string of 'test3'", function() {
    expect(typeof options.data === "object" && options.data.result === "test3").not.toBeTruthy();
  });
  
  it("options.param2 should not return 'test4'", function() {
    expect(options.param2 === "test4").not.toBeTruthy();
  });

});