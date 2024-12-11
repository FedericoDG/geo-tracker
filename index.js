const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  socket.on('location', (location) => {
    // Emitir la ubicación a todos los clientes conectados (si es necesario)
    console.log(`${new Date()} -> ${location.latitude}, ${location.longitude}`);
    io.emit(location);
  });
  socket.on('toggleLocation', (isSending) => {
    console.log(
      'Se ha recibido una solicitud para',
      isSending ? 'iniciar' : 'detener',
      'la transmisión de ubicación'
    );

    // Ejemplo: Emitir un evento a todos los clientes para notificar el cambio
    io.emit('locationTransmissionStatus', isSending);
  });
});

app.get('/', (req, res) => {
  res.send('GeoTracker Server');
});

server.listen(3000, () => {
  console.log('Socket.IO server running on http://localhost:3000');
});
