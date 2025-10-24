'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AboutPage() {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <header className="w-full max-w-4xl mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-amber-500">About Ouija Board</h1>
          <Link href="/" className="px-4 py-2 bg-amber-700 hover:bg-amber-600 rounded-md transition-colors">
            Return Home
          </Link>
        </div>
      </header>
      
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
  {/* What is this site */}
  <section className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg">
    <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-amber-400">What is this site?</h2>
    <p className="text-gray-300 mb-6">
      This interactive Ouija board experience lets you communicate with virtual spirits in two immersive modes:
    </p>
    <ul className="list-disc pl-6 space-y-3 text-gray-300 mb-6">
      <li>
        <span className="text-amber-400 font-semibold">Anonymous Mode:</span> Connect with a mystic-powered spirit that responds to your questions through the Ouija board.
      </li>
      <li>
        <span className="text-amber-400 font-semibold">Friend Mode:</span> Invite friends to join your session with a unique room code and experience the Ouija board together.
      </li>
    </ul>
    <p className="text-gray-300">
      Move the planchette across the board to spell out messages or ask questions, and watch as the spirits respond through mysterious movements.
    </p>
  </section>

  {/* How to Use */}
  <section className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg">
    <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-amber-400">How to Use</h2>
    <ol className="list-decimal pl-6 space-y-4 text-gray-300">
      <li>Select either <span className="italic">Anonymous</span> or <span className="italic">Friend</span> mode on the home page.</li>
      <li>For Friend mode, share the generated room code with friends so they can join your session.</li>
      <li>Type messages or click letters on the Ouija board to communicate.</li>
      <li>Watch as the planchette moves to spell out responses from the other side.</li>
      <li>Use the <span className="font-semibold">"GOODBYE"</span> option when you're ready to end your session.</li>
    </ol>
  </section>

  {/* About Ouija Boards */}
  <section className="bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg">
    <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-amber-400">About Ouija Boards</h2>
    <p className="text-gray-300 mb-4">
      Ouija boards—also known as spirit boards or talking boards—have been used for over a century as a mystical method of communicating with the unknown.
    </p>
    <p className="text-gray-300 mb-4">
      While traditional boards are steeped in supernatural lore, our digital version offers a fun, interactive experience powered by mystic forces and modern design.
    </p>
    <div>
      <button 
        onClick={() => setShowEasterEgg(!showEasterEgg)}
        className="text-amber-400 underline hover:text-amber-300 transition"
      >
        {showEasterEgg ? "Hide secret" : "Reveal a secret..."}
      </button>
      {showEasterEgg && (
        <p className="mt-4 p-4 bg-gray-800 rounded-lg border border-amber-700 italic text-gray-200">
          The spirits in our digital Ouija board are powered by mystic algorithms that adapt to your energy and questions, creating an eerily immersive experience. But don't tell anyone—some mysteries are best left unexplained!
        </p>
      )}
    </div>
  </section>
</main>

      
      <footer className="mt-12 text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Ouija Board Experience - For entertainment purposes only</p>
        <div className="flex justify-center space-x-4 mt-2">
          <Link href="/about" className="hover:text-amber-400">About</Link>
          <Link href="/privacy" className="hover:text-amber-400">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-amber-400">Terms of Use</Link>
        </div>
      </footer>
    </div>
  );
}