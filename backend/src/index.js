require('dotenv').config();
const http = require('node:http');
const { pool, initDB } = require('./db');
const { createApp } = require('./app');
const { initSockets } = require('./socket');

async function start() {
  let io;
  const { app, security } = createApp({ pool, jwtSecret: process.env.JWT_SECRET,
    production: process.env.NODE_ENV === 'production', emit: (order) => {
      io?.to(`order_${order.id}`).emit('order_status_updated', {
        orderId: order.id, status: order.status, updated_at: order.updated_at,
      });
    } });
  await initDB();
  const server = http.createServer({ requestTimeout: 15000, headersTimeout: 10000 }, app);
  io = initSockets(server, pool, security);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(Number(process.env.PORT || 5000), '0.0.0.0', resolve);
  }).catch((error) => { io.close(); throw error; });
  let shuttingDown = false;
  const shutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    const deadline = setTimeout(() => process.exit(1), 10000).unref();
    io.close(async () => {
      try { await pool.end(); }
      catch { process.exitCode = 1; }
      finally { clearTimeout(deadline); }
    });
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
start().catch(async () => {
  console.error('Startup failed; verify environment and database readiness');
  await pool.end();
  process.exitCode = 1;
});
