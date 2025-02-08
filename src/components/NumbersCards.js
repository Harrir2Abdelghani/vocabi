import React from 'react';
import cardImg from '../Assets/card.png';
import innerImage from '../Assets/numbers.jpg';
import { Link } from 'react-router-dom';
import backgroundImg from '../Assets/cld.jpg'; 
import arr from '../Assets/arr.png';

const AttentionGames = () => {
  return (
    <div className="flex flex-col items-center p-6 bg-purple-400 min-h-screen">
      <h2 className="text-3xl font-bold text-black mb-8 mt-4">Numbers Games</h2>
      <div className="relative">
        {/* Arrow Image */}
        <img
          src={arr}
          alt="Arrow"
          className="absolute top-64 -left-28 w-28 h-28 animate-pulse"
        />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 max-w-5xl mb-14">

        {/* Game Card Template */}
        {["/numberswarmup", "/numbers2", "/numbers3"].map((route, index) => (
          <Link key={index} to={route}>
            <div className="relative rounded-lg overflow-hidden h-[500px] w-80  transition-all duration-500 transform hover:scale-105 hover:rotate-1 ">
              
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
                style={{ backgroundImage: `url(${cardImg})` }}
              ></div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity duration-300"></div>

              {/* Inner Image */}
              <div className="relative flex items-center justify-center h-full z-10">
                <img
                  src={innerImage}
                  alt="Inner Content"
                  className="w-48 mt-14 h-96 object-contain z-20 transition-transform duration-300 transform hover:scale-110"
                />
              </div>
            </div>
          </Link>
        ))}

      </div>
    </div>
    </div>
  );
};

export default AttentionGames;
