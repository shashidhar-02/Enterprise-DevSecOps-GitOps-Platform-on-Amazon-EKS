const { Server } = require('socket.io');

let io;

module.exports = {
  init: (server) => {
    io = new Server(server, {
      cors: {
        origin: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log('Client connected to WebSockets:', socket.id);
      
      // Join a specific order room to listen for updates
      socket.on('join_order', (orderId) => {
        socket.join(`order_${orderId}`);
        console.log(`Socket ${socket.id} joined order_${orderId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
