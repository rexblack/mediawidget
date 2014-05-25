'use strict';

/*globals elopts:false */


describe("Merge", function() {
 
  loadFixtures("test.html");
  
  var element = $('#test')[0];
  var options = elopts(element, {
    def: 'default', 
    option: 'default'
  });
  
  it("options.def should return 'default'", function() {
    expect(options.def === "default").toBeTruthy();
  });
  
  it("options.option should not return 'default'", function() {
    expect(options.option === "default").not.toBeTruthy();
  });
  
});