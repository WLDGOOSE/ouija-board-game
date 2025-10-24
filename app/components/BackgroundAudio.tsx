'use client';

import { useState, useEffect, useRef } from 'react';

export default function BackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // Default volume at 30%
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ignoreVolumeEffectRef = useRef(false);

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio('/sounds/scary.mp3');
    const audio = audioRef.current;
    audio.loop = true;
    audio.preload = 'auto';

    // Start with silent volume for a gentle fade-in
    ignoreVolumeEffectRef.current = true;
    audio.volume = 0;

    const targetVolume = 0.3;
    const fadeIn = () => {
      let current = 0;
      const steps = 20;
      const step = targetVolume / steps;
      const interval = setInterval(() => {
        current += step;
        if (!audio) {
          clearInterval(interval);
          return;
        }
        if (current >= targetVolume) {
          clearInterval(interval);
          audio.volume = targetVolume;
          setVolume(targetVolume);
          ignoreVolumeEffectRef.current = false;
        } else {
          audio.volume = current;
          setVolume(current);
        }
      }, 100);
    };

    // Attempt autoplay; if blocked, resume on first interaction
    audio.play().then(() => {
      setIsPlaying(true);
      fadeIn();
    }).catch(() => {
      const resume = () => {
        audio.play().then(() => {
          setIsPlaying(true);
          fadeIn();
        }).catch(err => {
          console.error('Audio play failed:', err);
        });
        document.removeEventListener('click', resume);
        document.removeEventListener('keydown', resume);
        document.removeEventListener('touchstart', resume);
      };
      document.addEventListener('click', resume, { once: true });
      document.addEventListener('keydown', resume, { once: true });
      document.addEventListener('touchstart', resume, { once: true });
    });

    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current && !ignoreVolumeEffectRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Audio play failed:', error);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 bg-opacity-80 p-2 rounded-lg shadow-lg flex items-center space-x-2">
      <button 
        onClick={togglePlay}
        className="w-8 h-8 flex items-center justify-center bg-amber-700 hover:bg-amber-600 rounded-full text-white"
        aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
          </svg>
        )}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="w-20 accent-amber-500"
        aria-label="Volume control"
      />
    </div>
  );
}