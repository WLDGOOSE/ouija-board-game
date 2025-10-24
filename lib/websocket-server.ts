import { Server as SocketIOServer } from 'socket.io';

class WebSocketServer {
  private io: SocketIOServer | null = null;
  private rooms: Map<string, Set<string>> = new Map(); // roomId -> Set of socketIds
  private users: Map<string, { username: string; roomId: string; isAnonymous?: boolean }> = new Map(); // socketId -> user info
  private totalOnlineUsers: number = 0; // Track total online users

  initialize(server: any) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? 'https://yourapp.com' 
          : 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);
      this.totalOnlineUsers++;
      
      // Broadcast updated user count to all clients
      this.io!.emit('user-count-update', { count: this.totalOnlineUsers });

      // Join a room (friend mode)
      socket.on('join-room', (data: { roomId: string; username: string; isAnonymous?: boolean }) => {
        const { roomId, username, isAnonymous = false } = data;
        
        // Leave previous room if any
        const previousRoom = this.users.get(socket.id)?.roomId;
        if (previousRoom) {
          socket.leave(previousRoom);
          this.rooms.get(previousRoom)?.delete(socket.id);
        }

        // Join new room
        socket.join(roomId);
        this.users.set(socket.id, { username, roomId, isAnonymous });
        
        if (!this.rooms.has(roomId)) {
          this.rooms.set(roomId, new Set());
        }
        this.rooms.get(roomId)!.add(socket.id);

        // Notify others in the room (unless anonymous)
        if (!isAnonymous) {
          socket.to(roomId).emit('user-joined', {
            username,
            message: `${username} has joined the session`
          });
        }

        console.log(`User ${username} joined room ${roomId} ${isAnonymous ? '(anonymous)' : ''}`);
      });

      // Handle board interactions
      socket.on('board-interaction', (data: {
        roomId: string;
        interaction: { type: string; value: string };
        username: string;
      }) => {
        socket.to(data.roomId).emit('board-interaction', {
          interaction: data.interaction,
          username: data.username
        });
      });

      // Handle chat messages
      socket.on('chat-message', (data: {
        roomId: string;
        message: string;
        username: string;
        type: 'user' | 'spirit' | 'system';
      }) => {
        this.io!.to(data.roomId).emit('chat-message', {
          sender: data.username,
          text: data.message,
          type: data.type,
          timestamp: new Date().toISOString()
        });
      });

      // Handle spirit responses (anonymous mode)
      socket.on('spirit-response', (data: {
        roomId: string;
        response: string;
        spiritName: string;
      }) => {
        this.io!.to(data.roomId).emit('spirit-response', {
          sender: data.spiritName,
          text: data.response,
          type: 'spirit',
          timestamp: new Date().toISOString()
        });
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        const user = this.users.get(socket.id);
        if (user) {
          // Only notify if not anonymous
          if (!user.isAnonymous) {
            socket.to(user.roomId).emit('user-left', {
              username: user.username,
              message: `${user.username} has left the session`
            });
          }
          
          this.rooms.get(user.roomId)?.delete(socket.id);
          this.users.delete(socket.id);
        }
        
        // Update user count
        this.totalOnlineUsers = Math.max(0, this.totalOnlineUsers - 1);
        this.io!.emit('user-count-update', { count: this.totalOnlineUsers });
        
        console.log('User disconnected:', socket.id);
      });
    });
  }

  getIO() {
    if (!this.io) {
      throw new Error('Socket.io not initialized');
    }
    return this.io;
  }
  
  // Add method to get current online user count
  getUserCount() {
    return this.totalOnlineUsers;
  }
}

export const webSocketServer = new WebSocketServer();