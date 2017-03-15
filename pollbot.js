"use strict";

let DEFAULTS = require('./defaults');

function coalesce() {
  let args = Array.prototype.slice.apply(arguments);
  let val = args.shift();

  while (val === undefined) {
    val = args.shift();
  }

  return val;
}

function PollBot() {
}

PollBot.prototype.loadConfig = (json) => {
  this.config = {};

  this.config.poll_period_ms = coalesce(json.poll_period_ms, DEFAULTS.poll_period_ms);
  this.config.run_immediately = coalesce(json.run_immediately, DEFAULTS.run_immediately);
  this.config.logging_level = coalesce(json.logging_level, DEFAULTS.logging_level);
}

PollBot.prototype._getConfig = () => {
  return this.config;
}

PollBot.prototype.setPollingCallback = (callback) => {
  this.pollCallback = callback;
}

PollBot.prototype.startPolling = (callback) => {
  if (this.pollCallback) {
    if (this.config.run_immediately !== false) {
      setTimeout(this.pollCallback, 0);
    }

    this.interval = setInterval(this.pollCallback, this.config.poll_period_ms);

    callback();
  } else {
    callback({
      "message": "You must assign a poll callback before initiating polling"
    });
  }
}

PollBot.prototype.stopPolling = (callback) => {
  if (this.interval) {
    clearInterval(this.interval);

    delete this.interval;
  } else {
    callback({
      "message": "Cannot stop polling because no active polling interval was found."
    });
  }
}

module.exports = PollBot;
