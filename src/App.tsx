import { useState, useEffect, useRef, useCallback } from 'react';
import { planets } from './data/planets';
import type { Planet } from './data/planets';

const stars = Array.from({ length: 200 }).map((_, i) => {
  const rand = Math.random();
  const size = rand < 0.7 ? Math.random() * 1.5 + 0.5 : rand < 0.9 ? Math.random() * 2 + 1.5 : Math.random() * 3 + 2;
  const colors = ['#ffffff', '#ffffff', '#ffffff', '#ffe4b5', '#add8e6', '#fffacd'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return {
    id: i,
    width: size,
    height: size,
    top: Math.random() * 100,
    left: Math.random() * 100,
    opacity: Math.random() * 0.7 + 0.3,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
    color: color,
  };
});

const createSpaceAmbience = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator1 = audioContext.createOscillator();
  const gainNode1 = audioContext.createGain();
  oscillator1.type = 'sine';
  oscillator1.frequency.setValueAtTime(60, audioContext.currentTime);
  gainNode1.gain.setValueAtTime(0.05, audioContext.currentTime);
  oscillator1.connect(gainNode1);
  gainNode1.connect(audioContext.destination);
  oscillator1.start();
  
  const oscillator2 = audioContext.createOscillator();
  const gainNode2 = audioContext.createGain();
  oscillator2.type = 'sine';
  oscillator2.frequency.setValueAtTime(220, audioContext.currentTime);
  gainNode2.gain.setValueAtTime(0.02, audioContext.currentTime);
  oscillator2.connect(gainNode2);
  gainNode2.connect(audioContext.destination);
  oscillator2.start();
  
  return { audioContext, oscillators: [oscillator1, oscillator2], gains: [gainNode1, gainNode2] };
};

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef<any>(null);
  const anglesRef = useRef<number[]>(planets.map(() => Math.random() * Math.PI * 2));
  const [positions, setPositions] = useState<{ x: number; y: number }[]>(() => {
    return anglesRef.current.map((angle, i) => ({
      x: 480 + planets[i].orbitRadius * Math.cos(angle),
      y: 480 + planets[i].orbitRadius * Math.sin(angle),
    }));
  });
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 960, height: 960 });

  const getOrbitRadii = useCallback(() => {
    const minDim = Math.min(containerSize.width, containerSize.height);
    const scale = minDim / 960;
    return planets.map(p => p.orbitRadius * scale);
  }, [containerSize]);

  useEffect(() => {
    const handleResize
