import React from 'react';
import cardImg from '../Assets/card.png'
import innerImage from '../Assets/familly.jpg'
import { Link } from 'react-router-dom';
import arr from '../Assets/arr.png';

const AttentionGames = () => {
  return (
    <div className="flex flex-col items-center p-6 bg-yellow-200">
      <h2 className="text-3xl font-bold text-black mb-8 mt-4">Familly Members Games</h2>
      <div className="relative">
        {/* Arrow Image */}
        <img
          src={arr}
          alt="Arrow"
          className="absolute top-64 -left-28 w-28 h-28 animate-pulse"
        />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 max-w-5xl mb-14">
        
        {/* Spot the Differences Card */}
        <Link to="/famillywarmup">
      <div className="relative rounded-lg overflow-hidden  transform hover:scale-105 transition-transform duration-300 h-[500px] w-80">
        
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${cardImg})` }}
        ></div>

        {/* Inner Image */}
        <div className="relative flex items-center justify-center h-full">
          <img
            src={innerImage}
            alt="Inner Content"
            className="w-60 mt-14 h-96 object-contain z-20" // Adjust size and positioning as needed
          />
        </div>
      </div>
    </Link>

        {/* Alphabet Soup Card */}

        <Link to="/familly2">
      <div className="relative rounded-lg overflow-hidden  transform hover:scale-105 transition-transform duration-300 h-[500px] w-80">
        
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${cardImg})` }}
        ></div>

        {/* Inner Image */}
        <div className="relative flex items-center justify-center h-full">
          <img
            src={innerImage}
            alt="Inner Content"
            className="w-60 mt-14 h-96 object-contain z-20" // Adjust size and positioning as needed
          />
        </div>
      </div>
    </Link>

        {/* Find the Objects Card */}
        <Link to="/familly3">
      <div className="relative rounded-lg overflow-hidden  transform hover:scale-105 transition-transform duration-300 h-[500px] w-80">
        
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${cardImg})` }}
        ></div>

        {/* Inner Image */}
        <div className="relative flex items-center justify-center h-full">
          <img
            src={innerImage}
            alt="Inner Content"
            className="w-60 mt-14 h-96 object-contain z-20" // Adjust size and positioning as needed
          />
        </div>
      </div>
    </Link>

      </div>
    </div>
    </div>
  );
};

export default AttentionGames;
