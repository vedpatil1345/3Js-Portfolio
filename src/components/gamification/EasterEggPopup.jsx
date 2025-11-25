import React from 'react';
import { X } from 'lucide-react';

// Easter egg configuration - you can add images in public/easter-eggs/
const easterEggs = {
  ironman: {
    name: 'Iron Man',
    image: '/easter-eggs/ironman.png',
    quote: 'I am Iron Man',
    description: 'Genius, billionaire, playboy, philanthropist'
  },
  spiderman: {
    name: 'Spider-Man',
    image: '/easter-eggs/spiderman.png',
    quote: 'With great power comes great responsibility',
    description: 'Your friendly neighborhood Spider-Man'
  },
  thor: {
    name: 'Thor',
    image: '/easter-eggs/thor.png',
    quote: 'I am Thor, son of Odin',
    description: 'God of Thunder'
  },
  captainamerica: {
    name: 'Captain America',
    image: '/easter-eggs/captainamerica.png',
    quote: 'I can do this all day',
    description: 'The First Avenger'
  },
  hulk: {
    name: 'Hulk',
    image: '/easter-eggs/hulk.png',
    quote: 'Hulk Smash!',
    description: 'The strongest Avenger'
  },
  blackwidow: {
    name: 'Black Widow',
    image: '/easter-eggs/blackwidow.png',
    quote: 'I have red in my ledger',
    description: 'Master spy and assassin'
  },
  doctorstrange: {
    name: 'Doctor Strange',
    image: '/easter-eggs/doctorstrange.png',
    quote: 'We are in the endgame now',
    description: 'Master of the Mystic Arts'
  },
  blackpanther: {
    name: 'Black Panther',
    image: '/easter-eggs/blackpanther.png',
    quote: 'Wakanda Forever',
    description: 'King of Wakanda'
  }
};

const EasterEggPopup = ({ eggId, onClose }) => {
  const egg = easterEggs[eggId];

  if (!egg) return null;

  return (
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-300"
      onClick={onClose}
    >
      <div 
        className="relative h-96 w-80 mx-4 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Image */}
        <img 
          src={egg.image} 
          alt={egg.name}
          className="absolute inset-0 w-full h-full object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="hidden absolute inset-0 bg-gradient-to-br from-red-600 to-blue-600 items-center justify-center text-9xl">
          🦸
        </div>

        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors z-10"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-6 text-center text-white">
          <div className="mb-3 inline-block px-4 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-full text-sm">
            Unlocked!
          </div>

          <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">
            {egg.name}
          </h2>

          <p className="text-lg italic text-yellow-400 mb-3 drop-shadow-lg">
            "{egg.quote}"
          </p>

          <p className="text-gray-200 drop-shadow-lg">
            {egg.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EasterEggPopup;
export { easterEggs };
