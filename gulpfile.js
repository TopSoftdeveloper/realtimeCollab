/*eslint-disable */
require('gulp').task('front_end_test', require('gulp-jsx-coverage').createTask({
  src: ['assets/app/test/**/*.js'],  // will pass to gulp.src as mocha tests
  isparta: false,                                  // use istanbul as default
  istanbul: {                                      // will pass to istanbul or isparta
    preserveComments: true,                      // required for istanbul 0.4.0+
    coverageVariable: '__MY_TEST_COVERAGE__',
    exclude: /node_modules|test[0-9]/            // do not instrument these files
  },

  threshold: [                                     // fail the task when coverage lower than one of this array
    {
      type: 'lines',                           // one of 'lines', 'statements', 'functions', 'banches'
      min: 90
    }
  ],

  transpile: {                                     // this is default whitelist/blacklist for transpilers
    babel: {
      include: /\.jsx?$/,
      exclude: /node_modules/,
      omitExt: false,                           // if you wanna omit file ext when require(), put an array
    },                                           // of file exts here. Ex: ['.jsx', '.es6'] (NOT RECOMMENDED)
    coffee: {
      include: /\.coffee$/,
      omitExt: false                           // if you wanna omit file ext when require(), put an array
    },                                           // of file exts here. Ex: ['.coffee'] (NOT RECOMMENDED)
    cjsx: {
      include: /\.cjsx$/,
      omitExt: false                           // if you wanna omit file ext when require(), put an array
    }                                            // of file exts here. Ex: ['.cjsx'] (NOT RECOMMENDED)
  },
  coverage: {
    reporters: ['text-summary', 'json', 'lcov'], // list of istanbul reporters
    directory: 'coverage'                        // will pass to istanbul reporters
  },
  mocha: {                                         // will pass to mocha
    require: ['./assets/app/test/.setup.js'],
    reporter: 'spec',
  },

  // Recommend moving this to .babelrc
  babel: {                                         // will pass to babel-core
    presets: ['es2015', 'react'],                // Use proper presets or plugins for your scripts
    sourceMap: 'both'                            // get hints in covarage reports or error stack
  },

  coffee: {                                        // will pass to coffee.compile
    sourceMap: true                              // true to get hints in HTML coverage reports
  },

  //optional
  cleanup: function () {
    // do extra tasks after test done
    // EX: clean global.window when test with jsdom
  }
}));

require('gulp').task('front_end_test_subset', require('gulp-jsx-coverage').createTask({
  src: ['assets/app/test/**/_404.test.js'],  // will pass to gulp.src as mocha tests
  isparta: false,                                  // use istanbul as default
  istanbul: {                                      // will pass to istanbul or isparta
    preserveComments: true,                      // required for istanbul 0.4.0+
    coverageVariable: '__MY_TEST_COVERAGE__',
    exclude: /node_modules|test[0-9]/            // do not instrument these files
  },

  threshold: [                                     // fail the task when coverage lower than one of this array
    {
      type: 'lines',                           // one of 'lines', 'statements', 'functions', 'banches'
      min: 1
    }
  ],

  transpile: {                                     // this is default whitelist/blacklist for transpilers
    babel: {
      include: /\.jsx?$/,
      exclude: /node_modules/,
      omitExt: false,                           // if you wanna omit file ext when require(), put an array
    },                                           // of file exts here. Ex: ['.jsx', '.es6'] (NOT RECOMMENDED)
    coffee: {
      include: /\.coffee$/,
      omitExt: false                           // if you wanna omit file ext when require(), put an array
    },                                           // of file exts here. Ex: ['.coffee'] (NOT RECOMMENDED)
    cjsx: {
      include: /\.cjsx$/,
      omitExt: false                           // if you wanna omit file ext when require(), put an array
    }                                            // of file exts here. Ex: ['.cjsx'] (NOT RECOMMENDED)
  },
  coverage: {
    reporters: ['text-summary', 'json', 'lcov'], // list of istanbul reporters
    directory: 'coverage'                        // will pass to istanbul reporters
  },
  mocha: {                                         // will pass to mocha
    reporter: 'spec',
    require: ['./assets/app/test/.setup.js'],
  },

  // Recommend moving this to .babelrc
  babel: {                                         // will pass to babel-core
    presets: ['es2015', 'react'],                // Use proper presets or plugins for your scripts
    sourceMap: 'both'                            // get hints in covarage reports or error stack
  },

  coffee: {                                        // will pass to coffee.compile
    sourceMap: true                              // true to get hints in HTML coverage reports
  },

  //optional
  cleanup: function () {
    // do extra tasks after test done
    // EX: clean global.window when test with jsdom
  }
}));
