import Cookies from 'js-cookie';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  lastActivity: number;
  persona?: string;
}

const SESSION_COOKIE_NAME = 'ouija_chat_session';
const SESSION_EXPIRY_HOURS = 24;
const MAX_MESSAGES_PER_SESSION = 50;

export class SessionStorage {
  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static getCurrentSessionId(): string | null {
    return Cookies.get(SESSION_COOKIE_NAME) || null;
  }

  static createNewSession(): string {
    const sessionId = this.generateSessionId();
    Cookies.set(SESSION_COOKIE_NAME, sessionId, { 
      expires: SESSION_EXPIRY_HOURS / 24,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
    return sessionId;
  }

  static getOrCreateSession(): string {
    const existingSession = this.getCurrentSessionId();
    if (existingSession && this.getSession(existingSession)) {
      return existingSession;
    }
    return this.createNewSession();
  }

  static saveSession(session: ChatSession): void {
    try {
      // Limit messages to prevent localStorage overflow
      if (session.messages.length > MAX_MESSAGES_PER_SESSION) {
        session.messages = session.messages.slice(-MAX_MESSAGES_PER_SESSION);
      }
      
      session.lastActivity = Date.now();
      localStorage.setItem(`chat_session_${session.id}`, JSON.stringify(session));
    } catch (error) {
      console.warn('Failed to save chat session:', error);
    }
  }

  static getSession(sessionId: string): ChatSession | null {
    try {
      const stored = localStorage.getItem(`chat_session_${sessionId}`);
      if (!stored) return null;

      const session: ChatSession = JSON.parse(stored);
      
      // Check if session has expired
      const now = Date.now();
      const sessionAge = now - session.lastActivity;
      const maxAge = SESSION_EXPIRY_HOURS * 60 * 60 * 1000;
      
      if (sessionAge > maxAge) {
        this.clearSession(sessionId);
        return null;
      }

      return session;
    } catch (error) {
      console.warn('Failed to retrieve chat session:', error);
      return null;
    }
  }

  static addMessage(sessionId: string, message: ChatMessage): void {
    let session = this.getSession(sessionId);
    
    if (!session) {
      session = {
        id: sessionId,
        messages: [],
        lastActivity: Date.now()
      };
    }

    session.messages.push(message);
    this.saveSession(session);
  }

  static updateSessionPersona(sessionId: string, persona: string): void {
    const session = this.getSession(sessionId);
    if (session) {
      session.persona = persona;
      this.saveSession(session);
    }
  }

  static clearSession(sessionId: string): void {
    try {
      localStorage.removeItem(`chat_session_${sessionId}`);
      const currentSession = this.getCurrentSessionId();
      if (currentSession === sessionId) {
        Cookies.remove(SESSION_COOKIE_NAME);
      }
    } catch (error) {
      console.warn('Failed to clear chat session:', error);
    }
  }

  static clearAllSessions(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('chat_session_')) {
          localStorage.removeItem(key);
        }
      });
      Cookies.remove(SESSION_COOKIE_NAME);
    } catch (error) {
      console.warn('Failed to clear all sessions:', error);
    }
  }

  static cleanupExpiredSessions(): void {
    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      const maxAge = SESSION_EXPIRY_HOURS * 60 * 60 * 1000;

      keys.forEach(key => {
        if (key.startsWith('chat_session_')) {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const session: ChatSession = JSON.parse(stored);
              const sessionAge = now - session.lastActivity;
              
              if (sessionAge > maxAge) {
                localStorage.removeItem(key);
              }
            }
          } catch (error) {
            // Remove corrupted sessions
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('Failed to cleanup expired sessions:', error);
    }
  }
}