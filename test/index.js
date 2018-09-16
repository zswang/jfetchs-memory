
const jfetchs = require('../')
      

describe("src/index.ts", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  
  

  it("store():base", function () {
    examplejs_printLines = [];
    var store = new jfetchs.MemoryStore()
store.save('k1', 'data1', 1).then(reply => {
  examplejs_print(reply)
  assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
})
store.load('k1').then(reply => {
  examplejs_print(reply)
  assert.equal(examplejs_printLines.join("\n"), "data1"); examplejs_printLines = [];
})
store.remove('k1').then(reply => {
  examplejs_print(reply)
  assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
})
store.remove('k1').then(reply => {
  examplejs_print(reply)
  assert.equal(examplejs_printLines.join("\n"), "false"); examplejs_printLines = [];
})
store.load('k1').then(reply => {
  examplejs_print(reply)
  assert.equal(examplejs_printLines.join("\n"), "undefined"); examplejs_printLines = [];
})
  });
          
  it("store():expire", function (done) {
    examplejs_printLines = [];
    var store2 = new jfetchs.MemoryStore()
store2.save('k2', 'data2', 0.1).then(reply => {
  examplejs_print(reply)
  assert.equal(examplejs_printLines.join("\n"), "true"); examplejs_printLines = [];
})
store2.load('k2').then(reply => {
  examplejs_print(reply)
  assert.equal(examplejs_printLines.join("\n"), "data2"); examplejs_printLines = [];
})
setTimeout(() => {
  store2.load('k2').then(reply => {
    examplejs_print(reply)
    assert.equal(examplejs_printLines.join("\n"), "undefined"); examplejs_printLines = [];
    done();
  })
}, 200)
  });
          
  it("store():gc", function (done) {
    examplejs_printLines = [];
    var store3 = new jfetchs.MemoryStore()
store3.save('k3-1', 'data3-1', 0.1)
store3.save('k3-2', 'data3-2', 2)
setTimeout(() => {
  store3.gc().then(reply => {
    examplejs_print(JSON.stringify(reply))
    assert.equal(examplejs_printLines.join("\n"), "[\"k3-1\"]"); examplejs_printLines = [];
    done();
  })
}, 200)
  });
          
});
         