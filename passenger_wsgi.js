// Passenger WSGI file for Hostinger Node.js deployment
// This file is used when deploying with Passenger (Phusion Passenger)

const app = require('./server.js');

// Export the app for Passenger
if (typeof app === 'function') {
    module.exports = app;
} else {
    // If server.js exports the app, use it
    module.exports = app;
}

