var chromedriver = require('chromedriver');
var binPath = chromedriver.path;
module.exports = {
  before : function(done) {
    console.log('starting chromedriver');
    chromedriver.start();
    done();
  },

  after : function(done) {
    console.log('stopping chromedriver');
    chromedriver.stop();
    done();
  }
};
