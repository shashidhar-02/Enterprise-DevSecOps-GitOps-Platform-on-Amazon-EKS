const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
const { positiveId } = require('./security');

function initSockets(server, pool, security) {
  const origins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:8080').split(',').map((origin) => origin.trim());
  const io = new Server(server, { cors: { origin: origins, credentials: true },
    allowRequest: (req, callback) => callback(null, !req.headers.origin || origins.includes(req.headers.origin)),
  });
  io.use((socket, next) => {
    cookieParser()(socket.request, {}, async () => {
      try { socket.user = await security.userForToken(security.tokenFrom(socket.request)); next(); }
      catch { next(new Error('Authentication required')); }
    });
  });
  io.on('connection', (socket) => {
    socket.on('join_order', async (value, acknowledge) => {
      const reply = (ok) => { if (typeof acknowledge === 'function') acknowledge({ ok }); };
      try {
        const id = positiveId(value);
        const result = await pool.query('SELECT id FROM orders WHERE id = $1 AND user_id = $2', [id, String(socket.user.id)]);
        if (result.rows[0]) { await socket.join(`order_${id}`); reply(true); }
        else { socket.emit('order_error', 'Order not found'); reply(false); }
      } catch { socket.emit('order_error', 'Unable to join order'); reply(false); }
    });
  });
  return io;
}
module.exports = { initSockets };
