// ARCHITECTURAL OVERVIEW
// This file serves as the main entry point for the application.
// Its primary responsibility is to determine the runtime mode based on environment variables.
// It can either start a background job runner (for tasks like queue processing)
// or an HTTP server. The server can be launched in a single-instance mode or in a
// clustered mode to leverage multiple CPU cores for better performance and resilience.
// This orchestration at the entry point is a common pattern, but for more complex
// applications, consider a more sophisticated startup script or process manager.

import 'dotenv/config';
import cluster from 'cluster';
import * as os from 'os';
import { startServer } from './server';
import { job } from './job';

if (process.env.JOB) {
  job();
} else {
  if (process.env.CLUSTER) {
    if (cluster.isPrimary) {
      for (let i = 0; i < os.cpus().length; i++) {
        cluster.fork();
      }
    } else {
      startServer();
    }
  } else {
    startServer();
  }
}
