const express = require('express');
const { ExpressPeerServer } = require('peer');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);
const peerServer = ExpressPeerServer(server, {
  debug: true
});

// CORS設定を追加
app.use(cors());

app.use('/peerjs', peerServer);

server.listen(9000, () => {
  console.log('PeerJS server running on port 9000');
});

peerServer.on('connection', (client) => {
  console.log('Client connected:', client.id);
});

peerServer.on('disconnect', (client) => {
  console.log('Client disconnected:', client.id);
});

// より詳細なログを追加する
peerServer.on('message', (client, message) => {
  console.log(`Message from client ${client.id}:`, message);
});

peerServer.on('error', (error) => {
  console.error('Error:', error);
});

// カスタムイベントの例
peerServer.on('close', (client) => {
  console.log('Client closed connection:', client.id);
});

// Expressの一般的なリクエストログを追加する
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// エラーハンドリングの追加
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Server error');
});

