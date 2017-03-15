"use strict";

let assert = require('chai').assert;
let DEFAULTS = require('../defaults');
let emptyFunction = () => {};
let MAX_TIMER_DELAY = 2147483647;

let getTime = () => {return (new Date).getTime();};
let log = (msg) => {
  console.log(getTime(), ': ', msg);
};

describe('PollBot', () => {
  let Pollbot = require('../pollbot');

  describe('loadConfig', () => {
    it('should load the config with defaults', (done) => {
      let pollbot = new Pollbot();

      pollbot.loadConfig({});

      Object.keys(DEFAULTS).forEach((key) => {
        assert.equal(pollbot._getConfig()[key], DEFAULTS[key]);
      });

      done();
    });
    it('should allow you to override defaults', (done) => {
      let pollbot = new Pollbot();

      let config = {
        poll_period_ms: 11,
        run_immediately: false,
        logging_level: 'Debug'
      };

      pollbot.loadConfig(config);

      Object.keys(config).forEach((key) => {
        assert.equal(pollbot._getConfig()[key], config[key]);
      });

      done();
    });
  });

  describe('test various configurations', () => {
    describe('poll_period_ms', () => {
      it('should poll ~4-5 times in 1 second at a 200ms rate.', (done) => {
        let pollbot = new Pollbot();
        let counter = 0;

        pollbot.loadConfig({
          run_immediately: false,
          poll_period_ms: 200
        });

        pollbot.setPollingCallback(() => {
          counter += 1;
        });

        pollbot.startPolling(emptyFunction);

        setTimeout(() => {
          pollbot.stopPolling(emptyFunction);

          assert.oneOf(counter, [4, 5]);

          done();
        }, 1000);
      });
    });

    describe('run_immediately', () => {
      it('should cause the polling function to be called immediately even if the interval is long', (done) => {
        let pollbot = new Pollbot();

        pollbot.loadConfig({
          run_immediately: true,
          poll_period_ms: 2147483647
        });

        pollbot.setPollingCallback(() => {
          pollbot.setPollingCallback(() => {
            assert.equal(0, 1, "This assertion exists to simply validate that the second poll never occurs");
          });
        });

        pollbot.startPolling(emptyFunction);

        setTimeout(() => {
          pollbot.stopPolling(emptyFunction);
          done();
        }, 1750);
      });

      it('should not poll immediately if set to false', (done) => {
        let pollbot = new Pollbot();

        pollbot.loadConfig({
          run_immediately: false,
          poll_period_ms: 2147483647
        });

        pollbot.setPollingCallback(() => {
          assert.equal(0, 1, "This assertion exists to simply validate that the poll never occurs\n" +
              JSON.stringify(pollbot._getConfig(), null, 2));
        });

        pollbot.startPolling(emptyFunction);

        setTimeout(() => {
          pollbot.stopPolling(emptyFunction);
          done();
        }, 1750);
      });
    });
  });
});

