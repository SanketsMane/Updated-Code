process.env.PORT = process.env.PORT || 3000;
process.env.HOSTNAME = '0.0.0.0';

const path = require('path');
const next = require('next');

// Import the standalone server entry point
// Note: Depending on Next.js version, this might differ.
// Usually the standalone server.js starts the server immediately.
// We just require it.
require('./server.js');
