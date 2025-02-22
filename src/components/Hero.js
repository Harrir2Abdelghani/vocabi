import React, { useEffect, useState } from 'react';
import cloud1 from '../Assets/cloud1.png';
import hero from '../Assets/hero.jpg';
import button from '../Assets/button.png';
import arrow from '../Assets/Arrow.png';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial fade-in when the component mounts
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100); 
  }, []);

  return (
    <section
  className={` bg-teal-100   flex flex-col md:flex-row transition-opacity duration-1000 ease-in-out ${
    isLoaded ? 'opacity-100' : 'opacity-0'
  }`}
>
  <div className="flex flex-col mt-20 items-center justify-center p-6 space-y-6 w-full md:w-1/3">
    <img
      src={cloud1}
      className="h-16 object-cover rounded-lg animate-bounce"
      alt="Cloud Logo"
    />

    <h1 className="text-3xl font-bold text-pink-600 font-mono text-center mt-10 md:text-4xl">
      Your Vocabulary Grows Here!
    </h1>

    <div className="flex items-center justify-center space-x-0">
      <a href="#days-games">
      <div className="relative w-40 ml-4">
        <img
          src={button}
          className="h-12 w-full object-cover rounded-lg mt-8"
          alt="Button Logo"
        />
        <span className="absolute inset-0 flex items-center justify-center mt-0  text-black text-lg font-bold md:mt-0 md:text-xl">
          Explore Now
        </span>
      </div>
      </a>

      <img
        src={arrow}
        className="h-16 object-cover rounded-lg mt-1  animate-pulse"
        alt="Arrow Logo"
      />
    </div>
  </div>

  <div className="flex items-center justify-center bg-teal-100 md:w-2/3">
  
    <img
      src={hero}
      className="object-cover w-full max-w-[520px]  -mr-40  animate-pulse"
      alt="Hero Image"
    />
  </div>
</section>

  );
};

export default Hero;
