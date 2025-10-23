import { Spirit } from '@/app/components/types'

export const spirits: Spirit[] = [
  {
    name: "Ethereal Wanderer",
    personality: "mysterious",
    greetings: [
      "I have been waiting... what knowledge do you seek from beyond?",
      "The veil between worlds is thin tonight. Speak your questions.",
      "I sense your presence, seeker. What brings you to the spirit realm?"
    ],
    responses: {
      mysterious: [
        "The mists of time obscure the answer you seek.",
        "I sense a great disturbance in your path.",
        "The shadows hold secrets I cannot reveal.",
        "Your question echoes in the void between worlds."
      ]
    }
  },
  {
    name: "Ancient Guardian",
    personality: "wise",
    greetings: [
      "Greetings, seeker. I sense you have questions for the ages.",
      "Wisdom of centuries flows through me. Ask what you must.",
      "I have watched over this realm for eons. What guidance do you seek?"
    ],
    responses: {
      wise: [
        "Patience, seeker. All will be revealed in time.",
        "The answer lies not in what you ask, but in what you already know.",
        "Look within yourself for the guidance you seek.",
        "The universe unfolds as it should, trust in its wisdom."
      ]
    }
  },
  {
    name: "Lost Soul",
    personality: "melancholy",
    greetings: [
      "Another voice from the living world... what brings you to my solitude?",
      "I remember when I too sought answers... long ago.",
      "The living rarely visit this realm. What troubles bring you here?"
    ],
    responses: {
      melancholy: [
        "I remember when I too sought answers... long ago.",
        "The pain of not knowing is a burden we all carry.",
        "Some questions are better left unanswered.",
        "In my time, we had similar struggles... they never truly end."
      ]
    }
  },
  {
    name: "Mischievous Spirit",
    personality: "playful",
    greetings: [
      "Well hello there! Fancy a chat with someone who's been dead for centuries?",
      "Ooh, a living person! This should be entertaining.",
      "Finally, some company! Let's have some fun, shall we?"
    ],
    responses: {
      playful: [
        "Ooh, a curious one! Let me think... or not!",
        "The answer is as clear as mud, wouldn't you agree?",
        "Why so serious? The afterlife is full of surprises!",
        "I could tell you, but where would be the fun in that?"
      ]
    }
  }
]

export function getRandomSpirit(): Spirit {
  return spirits[Math.floor(Math.random() * spirits.length)]
}

export function getSpiritResponse(spirit: Spirit, message: string): string {
  const personality = spirit.personality
  const responses = spirit.responses[personality]
  return responses[Math.floor(Math.random() * responses.length)]
}

export function getSpiritGreeting(spirit: Spirit): string {
  const greetings = spirit.greetings
  return greetings[Math.floor(Math.random() * greetings.length)]
}