'use client';

import React from "react";
import Link from "next/link";
import { FiGithub } from "react-icons/fi";

const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
  e.preventDefault();
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-md">
      <div className="container mx-auto flex flex-row justify-between items-center px-4 py-3">
        <h3
          className="text-2xl font-bold text-yellow-400 
          [text-shadow:2px_2px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,1px_1px_0_#000]"
        >
          The Simpsons
        </h3>

        <nav className="flex flex-row gap-6 items-center">
          <a 
            href="#home" 
            onClick={(e) => scrollToSection(e, 'home')}
            className="text-lg font-medium cursor-pointer hover:text-yellow-500 transition-colors"
          >
            Home
          </a>
          <a 
            href="#characters" 
            onClick={(e) => scrollToSection(e, 'characters')}
            className="text-lg font-medium cursor-pointer hover:text-yellow-500 transition-colors"
          >
            Characters
          </a>
          <a 
            href="#episodes" 
            onClick={(e) => scrollToSection(e, 'episodes')}
            className="text-lg font-medium cursor-pointer hover:text-yellow-500 transition-colors"
          >
            Episodes
          </a>
          <a 
            href="#locations" 
            onClick={(e) => scrollToSection(e, 'locations')}
            className="text-lg font-medium cursor-pointer hover:text-yellow-500 transition-colors"
          >
            Locations
          </a>
        </nav>

        <a
          href="https://github.com/OscarEsc10/Next-app-simpson"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white transition-colors 
          duration-200 border-2 border-black shadow-[3px_3px_0_#000] hover:shadow-[5px_5px_0_#000] 
          active:shadow-[2px_2px_0_#000] transform hover:-translate-y-0.5 active:translate-y-0"
          aria-label="View on GitHub"
        >
          <FiGithub className="text-black text-xl" />
        </a>
      </div>
    </header>
  );
}
