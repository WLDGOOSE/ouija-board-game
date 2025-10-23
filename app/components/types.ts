// app/components/types.ts
export type GameMode = 'anonymous' | 'friend' | null;

export interface Message {
  sender: string;
  text: string;
  type: 'user' | 'spirit' | 'system';
}

export interface Position {
  x: number;
  y: number;
}

export interface Spirit {
  name: string;
  personality: 'mysterious' | 'wise' | 'melancholy' | 'playful';
  greetings: string[];
  responses: {
    [key: string]: string[];
  };
}

// Props interfaces
export interface ModeSelectionProps {
  onModeSelect: (mode: GameMode) => void;
}

export interface OuijaBoardProps {
  gameMode: GameMode;
  onMessage: (sender: string, text: string, type: Message['type']) => void;
  messages: Message[];
}

export interface ChatInterfaceProps {
  gameMode: GameMode;
  messages: Message[];
  onSendMessage: (sender: string, text: string, type: Message['type']) => void;
}

export interface PlanchetteProps {
  position: Position;
}

// Add to existing types
export interface BoardInteraction {
  type: 'letter' | 'yesno' | 'goodbye';
  value: string;
}

export interface OuijaBoardProps {
  gameMode: GameMode;
  onInteraction: (interaction: BoardInteraction) => void;
  planchettePosition: Position;
  messages: Message[];
}

export interface ChatInterfaceProps {
  gameMode: GameMode;
  messages: Message[];
  onSendMessage: (sender: string, text: string, type: Message['type']) => void;
  isTyping: boolean;
}

// Add to existing types in app/components/types.ts
export interface OuijaBoardProps {
  gameMode: GameMode;
  onInteraction: (interaction: BoardInteraction) => void;
  planchettePosition: Position;
  messages: Message[];
  isSpelling?: boolean;
  currentSpelling?: string;
}

export interface PlanchetteProps {
  position: Position;
  isMoving?: boolean;
}

export interface ChatInterfaceProps {
  gameMode: GameMode;
  messages: Message[];
  onSendMessage: (sender: string, text: string, type: Message['type']) => void;
  isTyping: boolean;
  isSpelling?: boolean;
}

// Add to existing types
export interface ChatInterfaceProps {
  gameMode: GameMode;
  messages: Message[];
  onSendMessage: (sender: string, text: string, type: Message['type']) => void;
  isTyping: boolean;
  isSpelling?: boolean;
  username?: string;
}

// Add to existing types
export interface MysticRingProps {
  position: Position;
  isActive?: boolean;
}