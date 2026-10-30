import { useState, useEffect, useRef, useCallback } from 'react';
import { planets } from './data/planets';
import type { Planet } from './data/planets';

const stars = Array.from({ length: 200 }).map((_, i) => {
  const rand = Math.random();
  const size = rand < 0.7 ? Math.random() * 1.5 + 0.5 : rand < 0.9 ? Math.random() * 2 + 1.5 : Math.random() * 3 + 2;
  const colors = ['#ffffff', '#ffffff', '#ffffff', '#ffe4b5', '#add8e6', '#fffacd'];
  return {
    id: i,
    width: size,
    height: size,
    top: Math.random() * 100,
    left: Math.random() * 100,
    opacity: Math.random() * 0.7 + 0.3,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
  };
});

const createSpaceAmbience = () => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(60, ctx.currentTime);
  gain1.gain.setValueAtTime(0.05, ctx.currentTime);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start();
  
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(220, ctx.currentTime);
  gain2.gain.setValueAtTime(0.02, ctx.currentTime);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start();
  
  return { ctx, oscs: [osc1, osc2] };
};

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef<any>(null);
  const anglesRef = useRef<number[]>(planets.map(() => Math.random() * Math.PI * 2));
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 960, h: 960 });

  const getRadii = useCallback(() => {
    const min = Math.min(size.w, size.h);
    const scale = min / 960;
    return planets.map(p => p.orbitRadius * scale);
  }, [size]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setSize({ w: rect.width, h: rect.height });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (isPlaying) {
        anglesRef.current = anglesRef.current.map((angle, i) => {
          const normalizedPeriod = Math.pow(planets[i].orbitalPeriod / 365, 0.4);
          const baseSpeed = (2 * Math.PI) / (normalizedPeriod * 3);
          return angle + baseSpeed * speed * delta;
        });
      }

      const radii = getRadii();
      const cx = size.w / 2;
      const cy = size.h / 2;
      setPositions(anglesRef.current.map((angle, i) => ({
        x: cx + radii[i] * Math.cos(angle),
        y: cy + radii[i] * Math.sin(angle),
      })));

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, speed, getRadii, size]);

  const formatDist = (d: number) => d >= 1000 ? `${(d / 1000).toFixed(1)} млрд км` : `${d.toFixed(1)} млн км`;
  const formatPeriod = (d: number) => d >= 365 ? `${(d / 365.25).toFixed(1)} лет` : `${d} дней`;

  const toggleSound = () => {
    if (!soundEnabled) {
      audioRef.current = createSpaceAmbience();
      setSoundEnabled(true);
    } else {
      if (audioRef.current) {
        audioRef.current.oscs.forEach((o: any) => o.stop());
        audioRef.current.ctx.close();
        audioRef.current = null;
      }
      setSoundEnabled(false);
    }
  };

  const scale = Math.max(0.5, Math.min(size.w, size.h) / 960);
  const radii = getRadii();

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden relative flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full"
            style={{
              width: star.width + 'px',
              height: star.height + 'px',
              top: star.top + '%',
              left: star.left + '%',
              opacity: star.opacity,
              backgroundColor: star.color,
              boxShadow: star.width > 2 ? `0 0 ${star.width * 2}px ${star.color}` : 'none',
              animation: `twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      <header className="relative z-10 text-center pt-3 pb-1 flex-shrink-0">
        <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-500 bg-clip-text text-transparent">
          ☀️ Солнечная Система
        </h1>
        <p className="text-gray-400 text-xs md:text-sm mt-1">Нажмите на планету для информации</p>
      </header>

      <div className="relative flex-1 flex items-center justify-center min-h-0">
        <div ref={containerRef} className="relative w-full h-full" style={{ maxWidth: '1000px', maxHeight: '1000px' }}>
          <div
            className="absolute rounded-full z-10"
            style={{
              width: `${50 * scale}px`,
              height: `${50 * scale}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, #fff7a0 0%, #ffcc00 30%, #ff8800 70%, #ff4400 100%)',
              boxShadow: '0 0 40px #ff8800, 0 0 80px #ff660066',
              animation: 'pulse 3s ease-in-out infinite',
            }}
          />

          {planets.map((planet, index) => (
            <div
              key={`orbit-${planet.id}`}
              className="absolute rounded-full border border-gray-700/30"
              style={{
                width: radii[index] * 2 + 'px',
                height: radii[index] * 2 + 'px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}

          {planets.map((planet, index) => {
            if (!positions[index]) return null;
            const planetSize = planet.size * scale;
            const isSelected = selectedPlanet?.id === planet.id;
            return (
              <div
                key={planet.id}
                className="absolute cursor-pointer z-20 group"
                style={{
                  width: planetSize + 'px',
                  height: planetSize + 'px',
                  left: positions[index].x - planetSize / 2 + 'px',
                  top: positions[index].y - planetSize / 2 + 'px',
                }}
                onClick={() => setSelectedPlanet(isSelected ? null : planet)}
                title={planet.nameRu}
              >
                <div
                  className="w-full h-full rounded-full transition-transform group-hover:scale-150"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${planet.color}ff, ${planet.color}aa, ${planet.color}44)`,
                    boxShadow: isSelected ? `0 0 ${planetSize}px ${planet.color}` : `0 0 ${planetSize / 2}px ${planet.color}66`,
                  }}
                />
                {planet.id === 'saturn' && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      width: planetSize * 1.8 + 'px',
                      height: planetSize * 0.4 + 'px',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotateX(75deg)',
                      border: '2px solid rgba(232, 213, 144, 0.5)',
                      borderRadius: '50%',
                    }}
                  />
                )}
                <div
                  className="absolute left-1/2 -translate-x-1/2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ top: planetSize + 6 + 'px', textShadow: '0 0 4px rgba(0,0,0,0.8)' }}
                >
                  {planet.nameRu}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPlanet && (
        <div className="absolute top-16 right-3 md:right-6 z-30 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl p-4 md:p-5 max-w-xs shadow-2xl animate-fadeIn">
          <button className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl" onClick={() => setSelectedPlanet(null)}>×</button>
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-full flex-shrink-0" style={{ width: '36px', height: '36px', background: `radial-gradient(circle at 35% 35%, ${selectedPlanet.color}, ${selectedPlanet.color}66)` }} />
            <div>
              <h2 className="text-lg font-bold">{selectedPlanet.nameRu}</h2>
              <p className="text-xs text-gray-400">{selectedPlanet.name}</p>
            </div>
          </div>
          <p className="text-sm text-gray-300 mb-3">{selectedPlanet.description}</p>
          <div className="space-y-2 bg-gray-800/50 rounded-lg p-3">
            <div className="flex justify-between text-sm"><span className="text-gray-400">📏 Диаметр:</span><span className="font-medium">{selectedPlanet.diameter.toLocaleString()} км</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">🌞 До Солнца:</span><span className="font-medium">{formatDist(selectedPlanet.distanceFromSun)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">🔄 Период:</span><span className="font-medium">{formatPeriod(selectedPlanet.orbitalPeriod)}</span></div>
          </div>
        </div>
      )}

      <div className="absolute top-16 left-3 z-20 hidden lg:block">
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-gray-800">
          <p className="text-xs text-gray-400 mb-2 font-medium">Планеты:</p>
          <div className="space-y-1">
            {planets.map((planet) => (
              <button
                key={planet.id}
                onClick={() => setSelectedPlanet(selectedPlanet?.id === planet.id ? null : planet)}
                className={`flex items-center gap-2 text-xs py-0.5 px-1.5 rounded w-full text-left ${selectedPlanet?.id === planet.id ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
              >
                <div className="rounded-full flex-shrink-0" style={{ width: '8px', height: '8px', backgroundColor: planet.color }} />
                <span className="text-gray-300">{planet.nameRu}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-30 bg-gray-900/90 backdrop-blur-md border-t border-gray-800 px-3 py-2.5 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2 md:gap-3">
          <button onClick={() => setIsPlaying(!isPlaying)} className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border transition-colors ${isPlaying ? 'bg-blue-600/20 border-blue-500/50 text-blue-300' : 'bg-green-600/20 border-green-500/50 text-green-300'}`}>
            <span>{isPlaying ? '⏸' : '▶️'}</span>
            <span className="text-xs md:text-sm font-medium">{isPlaying ? 'Пауза' : 'Играть'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 hidden sm:inline">Скорость:</span>
            <div className="flex gap-0.5">
              {[0.25, 0.5, 1, 2, 5, 10].map((s) => (
                <button key={s} onClick={() => setSpeed(s)} className={`px-1.5 md:px-2 py-1 rounded text-xs font-medium transition-colors ${speed === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'}`}>
                  {s}×
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => { anglesRef.current = planets.map(() => Math.random() * Math.PI * 2); }} className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700">
            <span>🔄</span>
            <span className="text-xs md:text-sm">Сброс</span>
          </button>

          <button onClick={toggleSound} className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border transition-colors ${soundEnabled ? 'bg-purple-600/20 border-purple-500/50 text-purple-300' : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'}`}>
            <span>{soundEnabled ? '🔊' : '🔇'}</span>
            <span className="text-xs md:text-sm">{soundEnabled ? 'Звук ВКЛ' : 'Звук ВЫКЛ'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
