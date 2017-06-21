var jsdom = require('jsdom').jsdom;
import injectTapEventPlugin from 'react-tap-event-plugin';
import sinon from 'sinon';
import * as general from '../js/utils/general.js';

injectTapEventPlugin();
sinon.stub(general, 'getLocalUserId', () => 'id1');

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};
function storageMock() {
    var storage = {};
    return {
      setItem: function(key, value) {
        storage[key] = value || '';
      },
      getItem: function(key) {
        return key in storage ? storage[key] : null;
      },
      removeItem: function(key) {
        delete storage[key];
      },
      get length() {
        return Object.keys(storage).length;
      },
      key: function(i) {
        var keys = Object.keys(storage);
        return keys[i] || null;
      }
    };
  }

// mock localStorage
if (!global.window.localStorage) {
  global.window.localStorage = storageMock();
}
