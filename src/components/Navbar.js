import React, { useEffect, useState } from 'react';
import logo from '../Assets/logo.jpg';
import button from '../Assets/button.png';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);

  
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100); 
  }, []);

  return (
    <nav className="bg-teal-100 dark:bg-gray-900 fixed w-full z-20 top-0 start-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-2 mx-2">
        {/* Logo Section with Animation from Left */}
        <a
          href="/"
          className={`flex items-center space-x-1 rtl:space-x-reverse transform transition-transform duration-1000 ${
            isVisible ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <img src={logo} className="h-12 w-12" alt="Logo" />
          <span className="self-center text-3xl font-mono font-semibold whitespace-nowrap">
            <span className="text-red-400">V</span>
            <span className="text-orange-400">O</span>
            <span className="text-yellow-400">C</span>
            <span className="text-green-400">A</span>
            <span className="text-blue-400">B</span>
            <span className="text-purple-400">I</span>
          </span>
        </a>

        {/* Navbar Links with Animation from Top */}
        <div
          className={`items-center justify-between hidden w-full  md:flex md:w-auto md:order-1 transform transition-transform duration-1000 ${
            isVisible ? 'translate-y-0' : '-translate-y-20'
          }`}
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4  font-bold text-lg font-mono border border-gray-100 rounded-lg bg-teal-100 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                href="/"
                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#days-games"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Days
              </a>
            </li>
            <li>
              <a
                href="#numbers-games"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Numbers
              </a>
            </li>
            <li>
              <a
                href="#jobs-games"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Jobs
              </a>
            </li>
            <li>
              <a
                href="#familly-games"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Familly
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
