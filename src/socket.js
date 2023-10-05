import { io } from 'socket.io-client';
const socket = io('http://localhost:3000');

export function usersOnline() {
  socket.emit('USERS');
}

export function usersOnlineListener(callback) {
  console.log('listening for new users and games');
  socket.on('USERS', callback);
}

export function createRoom(payload) {
  socket.emit('CREATE', payload);
  console.log(`Joined ${payload[1]}'s room.`);
  socket.on('CREATE', () => {
    console.log('room created');
  });
}

export function listenForRoom(callback) {
  console.log('listening for rooms');
  socket.on('NEW_ROOM', (data) => {
    console.log('Found room');
    callback(data);
  });
}

export function joinExistingRoom(username, roomId) {
  socket.emit('JOIN_GAME', { username, roomId });
  console.log('Test');
  socket.on('JOIN_GAME', () => {
    console.log(`Joined ${roomId}'s room.`);
  });
}

export function gamePlay(callback, roomId) {
  socket.emit('PLAY_GAME', roomId);
  console.log(roomId);
  socket.on('PLAY_GAME', (gamedata) => {
    callback(gamedata);
  });
  socket.on('JOIN_GAME', (gamedata) => {
    callback(gamedata);
  });
}

export function checkUsername(username, callback) {
  socket.emit('CHECK', username);
  socket.once('CHECK', callback);
}

export function refreshUser(username) {
  console.log('refresh user', username);
  socket.emit('HEARTBEAT', username);
}

//* GAME PLAY
export function updateGame(callback) {
  socket.on('UPDATE_GAME', callback);
}

export function setReadyStatus(username) {
  socket.emit('READY', username);
}
export function hit(username) {
  socket.emit('HIT', username);
}

export function stand(username) {
  socket.emit('STAND', username);
}

export function bet(username, amount) {
  socket.emit('BET', { username, amount });
}

export function leave(username) {
  socket.emit('LEAVE', username);
}
