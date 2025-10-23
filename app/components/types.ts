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

export interface BoardInteraction {
  type: 'letter' | 'yesno' | 'goodbye';
  value: string;
}

export interface OuijaBoardProps {
  gameMode: GameMode;
  onInteraction: (interaction: BoardInteraction) => void;
  planchettePosition: Position;
  messages: Message[];
  isSpelling?: boolean;
  currentSpelling?: string;
  currentLetter?: string;
}

export interface ChatInterfaceProps {
  gameMode: GameMode;
  messages: Message[];
  onSendMessage: (sender: string, text: string, type: Message['type']) => void;
  isTyping: boolean;
  isSpelling?: boolean;
  username?: string;
}

export interface PlanchetteProps {
  position: Position;
  isMoving?: boolean;
}

export interface MysticRingProps {
  position: Position;
  isActive?: boolean;
  currentLetter?: string;
}