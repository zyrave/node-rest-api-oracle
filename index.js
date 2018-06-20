const webServer = require('./src/services/web-server');
const database = require('./src/services/database');
const config = require('./src/config');

const defaultThreadPoolSize = 4;

// Increase thread pool size by poolMax
process.env.UV_THREADPOOL_SIZE = config.db.poolMax + defaultThreadPoolSize;

async function startup() {
  console.log('Starting application');

  try {
    console.log('Initializing database module');
    await database.initialize();
  } catch (err) {
    console.error(err);
    process.exit(1); // Non-zero failure code
  }

  try {
    console.log('Initializing web server module');
    await webServer.initialize();
  } catch (err) {
    console.error(err);
    process.exit(1); // Non-zero failure code
  }
}

startup();

async function shutdown(e) {
  let error = e;

  console.log('Shutting down');

  try {
    console.log('Closing web server module');
    await webServer.close();
  } catch (err) {
    console.log('Encountered error', e);
    error = error || err;
  }

  try {
    console.log('Closing database module');
    await database.close();
  } catch (err) {
    console.log('Encountered error', e);
    error = error || err;
  }

  console.log('Exiting process');

  if (error) {
    process.exit(1); // Non-zero failure code
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => {
  console.log('Received SIGTERM');
  shutdown();
});

process.on('SIGINT', () => {
  console.log('Received SIGINT');
  shutdown();
});

process.on('uncaughtException', err => {
  console.log('Uncaugh exception');
  console.error(err);
  shutdown(err);
});
