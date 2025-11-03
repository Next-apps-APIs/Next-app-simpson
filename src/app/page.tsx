"use client";
import React, { useState, useEffect } from "react";
import Buttons from "../components/Buttons";
import SimpsonsModalTrailer from "../components/SimpsonsModalTrailer";
import dynamic from 'next/dynamic';

// Dynamically import CharactersList with no SSR to avoid hydration issues
const CharactersList = dynamic(() => import('../components/CharactersList'), {
  ssr: false,
});

const LocationsList = dynamic(() => import('../components/LocationsList'), {
  ssr: false,
});

const EpisodesList = dynamic(() => import('../components/EpisodesList'), {
  ssr: false,
});


export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Handle smooth scrolling for section links
  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      // This is a simplified version - you might want to implement a more robust solution
      const scrollPosition = window.scrollY;
      // Add your section offsets here
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <section id="home" className="flex flex-col items-center justify-center min-h-screen p-6 bg-[url('/Clouds.jpg')] bg-cover bg-center">
        <h3 className="text-7xl font-bold mb-8 text-yellow-300 [text-shadow:3px_3px_0_#000,-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,1px_1px_0_#000]">
          Simpson Quotes
        </h3>
        <h3 className="bold text-2xl text-center text-black">
          The Simpsons universe in one project, Quotes, Characters, Episodes,{' '}
          <br /> Locations and Iconic phrases from Springfield
        </h3>
        <Buttons onTrailerClick={() => setIsModalOpen(true)} />
      </section>

      <CharactersList />

      <EpisodesList />

      <LocationsList />

      <SimpsonsModalTrailer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
