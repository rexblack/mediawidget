'use strict';

/*globals elopts:false */


describe("Basic", function() {
 
  loadFixtures("test.html");
  
  var element = $('#test')[0];
  var options = elopts(element);
  
  it("options.option should return 'test1'", function() {
    expect(options.option === 'test1').toBeTruthy();
  });
  
  it("options.json should return an array containing 'test2'", function() {
    expect(options.json instanceof Array).toBeTruthy();
  });
  
  it("options.data should return an object containing a key named 'result' having a string of 'test3'", function() {
    expect(typeof options.data === "object" && options.data.result === "test3").toBeTruthy();
  });
  
  it("options.param2 should return 'test4'", function() {
    expect(options.param2 === "test4").toBeTruthy();
  });

});