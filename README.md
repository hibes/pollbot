# Pollbot

Pollbot provides tools for periodically performing a task.  It's intended for use with APIs and web pages.

## Usage
    Initialize the pollbot
    let Pollbot = require('../pollbot');
    let pollbot = new Pollbot();

    // Configure the polling
    pollbot.loadConfig({
      poll_period_ms: 100,
      run_immediately: false,
      logging_level: 'Debug'
    });

    // Set up the work to do at each poll
    pollbot.setPollingCallback(() => {
      console.log("Polling!");
    });

    // Start polling
    pollbot.startPolling(() => {
      console.log("Polling has begun!");
    });

    // Stop polling after a few seconds
    setTimeout(() => {
      pollbot.stopPolling(() => {
        console.log("No more polling will occur!");
      });
    }, 3000);
