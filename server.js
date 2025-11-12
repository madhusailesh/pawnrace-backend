const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();

// Aapka frontend kaha hai? Yahan!
const FRONTEND_URL = "http://localhost:8080"; // Aapka Vite URL

app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST"]
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

const PORT = 4000; 

// === Asli Khel Yahan Shuru ===
io.on('connection', (socket) => {
  console.log(`🚀 Arre, ek naya challenger aaya hai! ID: ${socket.id}`);

  // 1. Jab koi room join kare
  socket.on("joinRoom", ({ roomId, role }) => {
    socket.join(roomId); 
    console.log(`👑 Khiladi ${socket.id} (Role: ${role}) room '${roomId}' mein daakhil!`);
  });

  // 2. Jab koi chaal chale
  socket.on("makeMove", ({ roomId, move, fen, pgn }) => {
    console.log(`🤯 Oho! Room '${roomId}' mein chaal chali gayi: ${move.from} se ${move.to}. Kya dimaag hai!`);
    
    // Doosre player ko batao ki "Bhai, teri baari!"
    socket.to(roomId).emit("opponentMove", { fen: fen }); 
  });

  // 3. Jab koi board reset kare
  socket.on("syncState", ({ roomId, fen, pgn }) => {
    console.log(`🔄 Ruko! Room '${roomId}' mein sab ulta pulta. Board reset ho raha hai...`);

    // Sabko batao ki "Naya game, shuru se!"
    io.in(roomId).emit("syncState", { fen: fen });
  });

  // 4. Jab koi room chhod de
  socket.on("leaveRoom", ({ roomId }) => {
    socket.leave(roomId);
    console.log(`😉 User ${socket.id} room '${roomId}' se nikal liya. Lagta hai dar gaya!`);
  });

  // 5. Jab koi disconnect ho jaaye
  socket.on("disconnect", () => {
    console.log(`👋 User ${socket.id} ka connection gaya... Tata, Bye Bye!`);
  });
});
// ======================

// Server ko chalu karo!
server.listen(PORT, () => {
  console.log(`Shhh... Secret chess server port ${PORT} par jaag raha hai! 🤫`);
});