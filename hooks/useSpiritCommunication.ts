import { useState, useCallback, useRef } from 'react';
import { Spirit, Message } from '@/app/components/types';
import { spirits, getRandomSpirit, getSpiritResponse, getSpiritGreeting } from '@/lib/spirits';

export interface UseSpiritCommunicationReturn {
  activeSpirit: Spirit | null;
  isSpiritTyping: boolean;
  initiateSpiritConnection: () => Spirit;
  sendMessageToSpirit: (message: string) => Promise<string>;
  endSpiritConnection: () => void;
  spellMessage: (message: string, onLetterSpell?: (letter: string) => void) => Promise<void>;
}

export function useSpiritCommunication(): UseSpiritCommunicationReturn {
  const [activeSpirit, setActiveSpirit] = useState<Spirit | null>(null);
  const [isSpiritTyping, setIsSpiritTyping] = useState<boolean>(false);
  const conversationHistory = useRef<{ role: 'user' | 'spirit'; content: string }[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize a new spirit connection
  const initiateSpiritConnection = useCallback((): Spirit => {
    const spirit = getRandomSpirit();
    setActiveSpirit(spirit);
    conversationHistory.current = [];
    
    // Add initial greeting to history
    const greeting = getSpiritGreeting(spirit);
    conversationHistory.current.push({
      role: 'spirit',
      content: greeting
    });
    
    return spirit;
  }, []);

  // Process user message and generate spirit response
  const sendMessageToSpirit = useCallback(async (userMessage: string): Promise<string> => {
    if (!activeSpirit) {
      throw new Error('No active spirit connection');
    }

    // Add user message to history
    conversationHistory.current.push({
      role: 'user',
      content: userMessage
    });

    // Simulate typing delay based on message complexity
    const typingDelay = calculateTypingDelay(userMessage);
    setIsSpiritTyping(true);

    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    return new Promise((resolve) => {
      typingTimeoutRef.current = setTimeout(() => {
        // Generate spirit response based on conversation context
        const response = generateContextualResponse(activeSpirit, userMessage, conversationHistory.current);
        
        // Add spirit response to history
        conversationHistory.current.push({
          role: 'spirit',
          content: response
        });

        setIsSpiritTyping(false);
        resolve(response);
      }, typingDelay);
    });
  }, [activeSpirit]);

  // End the spirit connection
  const endSpiritConnection = useCallback((): void => {
    setActiveSpirit(null);
    setIsSpiritTyping(false);
    conversationHistory.current = [];
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, []);

  // Spell out a message letter by letter (for planchette movement)
  const spellMessage = useCallback(async (
    message: string, 
    onLetterSpell?: (letter: string) => void
  ): Promise<void> => {
    const letters = message.toUpperCase().split('');
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    for (const letter of letters) {
      if (letter === ' ') {
        await delay(200); // Longer pause for spaces
        continue;
      }
      
      if (onLetterSpell) {
        onLetterSpell(letter);
      }
      
      await delay(100 + Math.random() * 100); // Variable delay for natural feel
    }
  }, []);

  return {
    activeSpirit,
    isSpiritTyping,
    initiateSpiritConnection,
    sendMessageToSpirit,
    endSpiritConnection,
    spellMessage
  };
}

// Calculate typing delay based on message complexity
function calculateTypingDelay(message: string): number {
  const baseDelay = 1000;
  const lengthFactor = message.length * 50;
  const complexityFactor = countComplexWords(message) * 200;
  
  return baseDelay + lengthFactor + complexityFactor;
}

// Count complex words for response timing
function countComplexWords(message: string): number {
  const complexWordPatterns = [
    /\b(why|how|when|where|who|what)\b/i,
    /\b(spirit|death|life|afterlife|soul|ghost|supernatural)\b/i,
    /\b(future|past|present|destiny|fate|karma)\b/i,
    /\b(love|hate|fear|hope|despair|joy)\b/i
  ];
  
  return complexWordPatterns.filter(pattern => pattern.test(message)).length;
}

// Generate contextual response based on conversation history
function generateContextualResponse(
  spirit: Spirit, 
  currentMessage: string, 
  history: { role: 'user' | 'spirit'; content: string }[]
): string {
  // Check for specific keywords in the message
  const lowerMessage = currentMessage.toLowerCase();
  
  // Greeting responses
  if (/(hello|hi|hey|greetings|salutations)/i.test(currentMessage)) {
    return getGreetingResponse(spirit);
  }
  
  // Farewell responses
  if (/(goodbye|bye|farewell|see you|later)/i.test(currentMessage)) {
    return getFarewellResponse(spirit);
  }
  
  // Question responses
  if (/\?$/.test(currentMessage.trim())) {
    return getQuestionResponse(spirit, currentMessage);
  }
  
  // Name inquiries
  if (/(who are you|what is your name|your name|identify)/i.test(lowerMessage)) {
    return getNameResponse(spirit);
  }
  
  // Personal questions
  if (/(how did you die|when did you die|your death|passed away)/i.test(lowerMessage)) {
    return getDeathStoryResponse(spirit);
  }
  
  // Future questions
  if (/(future|tomorrow|what will|predict|fortune)/i.test(lowerMessage)) {
    return getFutureResponse(spirit);
  }
  
  // Love questions
  if (/(love|relationship|crush|marriage|partner)/i.test(lowerMessage)) {
    return getLoveResponse(spirit);
  }
  
  // Career questions
  if (/(job|career|work|money|rich|success)/i.test(lowerMessage)) {
    return getCareerResponse(spirit);
  }
  
  // Default to personality-based response
  return getSpiritResponse(spirit, currentMessage);
}

// Response generators for different contexts
function getGreetingResponse(spirit: Spirit): string {
  const greetings: Record<Spirit['personality'], string[]> = {
    mysterious: [
      "Your presence ripples through the veil... I acknowledge you.",
      "The mists part as you approach. Speak, mortal.",
      "I have been awaiting your call across the dimensions."
    ],
    wise: [
      "Greetings, seeker. May our conversation bring you enlightenment.",
      "Welcome, child of the living realm. I am here to guide you.",
      "Your voice carries across the great divide. I am listening."
    ],
    melancholy: [
      "Another voice... it has been so long since I've had company.",
      "You reach out from the world of light to my shadowed existence.",
      "Hello... though I fear my words may bring you little comfort."
    ],
    playful: [
      "Well hello there! Ready for some supernatural conversation?",
      "Hey! Great timing - eternity was getting a bit boring!",
      "Ooh, a visitor! Let's have some fun, shall we?"
    ]
  };
  
  const options = greetings[spirit.personality];
  return options[Math.floor(Math.random() * options.length)];
}

function getFarewellResponse(spirit: Spirit): string {
  const farewells: Record<Spirit['personality'], string[]> = {
    mysterious: [
      "The veil closes once more... until we meet again.",
      "Our connection fades... remember what has been revealed.",
      "Return to your world... but know I am always watching."
    ],
    wise: [
      "May the wisdom shared guide your path. Farewell.",
      "Our time concludes. Carry these insights with you.",
      "The conversation ends, but understanding remains. Go in peace."
    ],
    melancholy: [
      "Must you leave so soon? The silence returns...",
      "Farewell... though I wish you could stay longer.",
      "Another connection broken... until next time, perhaps."
    ],
    playful: [
      "Aww, leaving already? This was just getting fun!",
      "Bye! Don't be a stranger in the spirit world!",
      "Farewell! Tell your friends about me - I need more visitors!"
    ]
  };
  
  const options = farewells[spirit.personality];
  return options[Math.floor(Math.random() * options.length)];
}

function getQuestionResponse(spirit: Spirit, question: string): string {
  const responses: Record<Spirit['personality'], string[]> = {
    mysterious: [
      "The answer swirls in cosmic patterns beyond your comprehension.",
      "Some questions create ripples that should not be disturbed.",
      "The truth you seek is veiled by layers of reality.",
      "Your question touches upon mysteries best left unexplored."
    ],
    wise: [
      "The answer lies not in the question, but in your readiness to receive it.",
      "Consider what you truly seek, and the answer may reveal itself.",
      "Some answers must be discovered through experience, not told.",
      "The universe responds to questions in its own time and way."
    ],
    melancholy: [
      "I asked similar questions once... they brought me little peace.",
      "The answer may not bring you the comfort you hope for.",
      "Some mysteries are kinder when left as mysteries.",
      "I've pondered that myself... across these long, lonely years."
    ],
    playful: [
      "Ooh, a question! Let me consult the cosmic joke book...",
      "The answer is 42! Just kidding... or am I?",
      "Why ask when you can wonder? Wondering is more fun!",
      "If I told you, I'd have to... well, I'm already dead, so never mind!"
    ]
  };
  
  const options = responses[spirit.personality];
  return options[Math.floor(Math.random() * options.length)];
}

function getNameResponse(spirit: Spirit): string {
  return `I am ${spirit.name}. ${getSpiritDescription(spirit)}`;
}

function getSpiritDescription(spirit: Spirit): string {
  const descriptions: Record<Spirit['personality'], string> = {
    mysterious: "I wander the spaces between worlds, knowing secrets beyond mortal understanding.",
    wise: "I have watched centuries pass and carry the wisdom of ages within me.",
    melancholy: "I am but a memory of what was, forever bound to this realm of echoes.",
    playful: "I'm the life of the afterlife party! Well, former life, but you get the idea!"
  };
  
  return descriptions[spirit.personality];
}

function getDeathStoryResponse(spirit: Spirit): string {
  const stories: Record<Spirit['personality'], string[]> = {
    mysterious: [
      "My passing was a transition between states of being, not an end.",
      "The circumstances of my departure are woven into the fabric of fate.",
      "Some stories are meant to remain untold in the mortal realm."
    ],
    wise: [
      "I left the physical world during the great enlightenment of the 18th century.",
      "My transition was peaceful, a natural conclusion to a life well-lived.",
      "The details matter less than the wisdom gained through the experience."
    ],
    melancholy: [
      "I departed during a lonely winter, forgotten by those I loved.",
      "My story is one of sadness... perhaps too heavy for your ears.",
      "I'd rather not revisit those final moments... the pain remains."
    ],
    playful: [
      "Let's just say it involved a trampoline, a flock of geese, and bad timing!",
      "Oh, you know... the usual dramatic exit! Very theatrical!",
      "Let's keep some mystery! A girl's gotta have her secrets, even a dead one!"
    ]
  };
  
  const options = stories[spirit.personality];
  return options[Math.floor(Math.random() * options.length)];
}

function getFutureResponse(spirit: Spirit): string {
  const futures: Record<Spirit['personality'], string[]> = {
    mysterious: [
      "The future is a river with many branching paths... which will you choose?",
      "I see shadows of possibilities, but the mists obscure the definite path.",
      "Your destiny is written in starlight, but even stars can be obscured by clouds."
    ],
    wise: [
      "The future grows from the seeds you plant today. Tend your garden well.",
      "Focus not on what will be, but on what you can become in this moment.",
      "Tomorrow is shaped by today's choices. Make them with intention."
    ],
    melancholy: [
      "The future holds both joy and sorrow... as it always has, as it always will.",
      "I've seen many futures come to pass... few bring lasting happiness.",
      "The tomorrow you fear may never come, but today's worries are real enough."
    ],
    playful: [
      "I see... cookies in your future! And maybe some unexpected dancing!",
      "The crystal ball is a bit foggy... try asking again after coffee!",
      "Future? I'm still figuring out the past! It's a work in progress!"
    ]
  };
  
  const options = futures[spirit.personality];
  return options[Math.floor(Math.random() * options.length)];
}

function getLoveResponse(spirit: Spirit): string {
  const loves: Record<Spirit['personality'], string[]> = {
    mysterious: [
      "Matters of the heart are governed by cosmic forces beyond our control.",
      "Love is the thread that connects all souls across time and space.",
      "The one you seek may be closer than the stars, yet farther than the moon."
    ],
    wise: [
      "True love grows from friendship, respect, and shared values.",
      "Love yourself first, and the right person will recognize that light.",
      "Patience in matters of the heart often yields the sweetest rewards."
    ],
    melancholy: [
      "Love is both the sweetest joy and the sharpest pain... cherish it while it lasts.",
      "I remember love... it was beautiful, but all things must end.",
      "Guard your heart, but not so well that love cannot find its way in."
    ],
    playful: [
      "Love? I'm seeing hearts and flowers! And maybe some awkward first dates!",
      "Ooh, romance! My advice: be yourself, unless you're boring, then be someone else!",
      "Love is in the air! Or that might just be ectoplasm... hard to tell from here!"
    ]
  };
  
  const options = loves[spirit.personality];
  return options[Math.floor(Math.random() * options.length)];
}

function getCareerResponse(spirit: Spirit): string {
  const careers: Record<Spirit['personality'], string[]> = {
    mysterious: [
      "Your professional path is aligned with celestial currents beyond mortal comprehension.",
      "The work you are meant to do will find you when you are ready to receive it.",
      "Success is not a destination, but a resonance with your soul's purpose."
    ],
    wise: [
      "Find work that serves others and you will never labor in vain.",
      "Your career should be an expression of your values, not just a means to wealth.",
      "The most fulfilling paths often require patience and perseverance."
    ],
    melancholy: [
      "I pursued worldly success... it brought me little comfort in the end.",
      "Work to live, don't live to work. Time is more precious than gold.",
      "No one's final thoughts are of meetings missed or promotions gained."
    ],
    playful: [
      "Career advice from a ghost? Well, don't take any wooden nickels!",
      "Follow your passion! Unless it's napping, then maybe get a backup plan!",
      "I'd tell you to network, but my connections are all... dead ends!"
    ]
  };
  
  const options = careers[spirit.personality];
  return options[Math.floor(Math.random() * options.length)];
}