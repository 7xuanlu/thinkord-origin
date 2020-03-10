const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron');
const path = require('path');

describe('Application launch', () => {
  this.timeout(100000);

  beforeEach(() => {
    this.app = new Application({
      path: electronPath,
      args: [path.join(__dirname, '..')]
    })
    return this.app.start();
  });

  afterEach(() => {
    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }
  });

  it('shows an initial window', () => {
    return this.app.client.getWindowCount().then((count) => {
      assert.equal(count, 1);
      // Please note that getWindowCount() will return 2 if `dev tools` are opened.
    });
  });
});
