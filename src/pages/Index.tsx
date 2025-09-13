import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

// Mock data for music tracks
const tracks = [
  {
    id: 1,
    title: "Moonlight Serenade",
    artist: "Classic Jazz Ensemble",
    duration: "3:45",
    cover: "/img/1349529c-70f5-4bc2-b06b-f9fc3156970d.jpg",
    audioSrc: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    id: 2,
    title: "Vinyl Memories",
    artist: "The Retro Band",
    duration: "4:12",
    cover: "/img/0d6b8838-88a1-469f-a219-7e130108e7f6.jpg",
    audioSrc: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    id: 3,
    title: "Golden Hour Blues",
    artist: "Vintage Soul",
    duration: "3:28",
    cover: "/img/b3b6e2f5-b8fb-49ab-84fc-af37bcb7a807.jpg",
    audioSrc: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  }
];

export default function Index() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTime(audio.currentTime);
      }
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
    };
  }, [currentTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playTrack = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play();
    }, 100);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * audio.duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress((newTime / audio.duration) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-vintage-cream via-vintage-beige to-vintage-brown vintage-texture">
      <audio 
        ref={audioRef} 
        src={tracks[currentTrack].audioSrc}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-vintage-brown/30 to-vintage-gold/20"></div>
        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center text-vintage-dark">
            <h1 className="vintage-title text-7xl md:text-8xl font-bold mb-8 tracking-wide drop-shadow-lg">
              VINTAGE SOUNDS
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
              <Icon name="Music" size={32} className="text-vintage-gold" />
              <div className="w-16 h-0.5 bg-vintage-gold"></div>
            </div>
            <p className="text-lg md:text-xl text-vintage-dark/80 max-w-2xl mx-auto leading-relaxed italic">
              Классическая музыка в теплых тонах прошлого
            </p>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <div className="container mx-auto px-6 py-8">
        <Card className="bg-vintage-cream/90 backdrop-blur-sm border-vintage-brown/30 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-xl vinyl-texture border-4 border-vintage-brown">
                <img 
                  src={tracks[currentTrack].cover} 
                  alt={tracks[currentTrack].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="vintage-title text-2xl text-vintage-dark font-semibold">
                  {tracks[currentTrack].title}
                </h3>
                <p className="text-vintage-brown italic">
                  {tracks[currentTrack].artist}
                </p>
              </div>
              <Button
                onClick={togglePlay}
                size="lg"
                className="bg-vintage-gold hover:bg-vintage-brown text-vintage-dark hover:text-vintage-cream rounded-full w-16 h-16 shadow-lg border-2 border-vintage-brown"
              >
                <Icon name={isPlaying ? "Pause" : "Play"} size={24} />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div 
                className="w-full h-3 bg-vintage-brown/20 rounded-full cursor-pointer relative border border-vintage-brown/30"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-gradient-to-r from-vintage-gold to-vintage-red rounded-full transition-all duration-300 shadow-inner"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-vintage-brown font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Track List */}
      <div className="container mx-auto px-6 pb-20">
        <h2 className="vintage-title text-5xl text-vintage-dark mb-12 text-center font-bold">
          ~ Коллекция ~
        </h2>
        <div className="grid gap-4 max-w-4xl mx-auto">
          {tracks.map((track, index) => (
            <Card 
              key={track.id}
              className={`bg-vintage-cream/80 backdrop-blur-sm border-vintage-brown/20 hover:border-vintage-gold hover:bg-vintage-beige/50 transition-all cursor-pointer group shadow-md ${
                currentTrack === index ? 'border-vintage-gold bg-vintage-gold/20 shadow-lg' : ''
              }`}
              onClick={() => playTrack(index)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg vinyl-texture border-3 border-vintage-brown">
                    <img 
                      src={track.cover} 
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="vintage-title text-xl text-vintage-dark font-semibold">
                      {track.title}
                    </h3>
                    <p className="text-vintage-brown italic text-sm">
                      {track.artist}
                    </p>
                  </div>
                  <div className="text-vintage-brown font-mono text-sm">
                    {track.duration}
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center">
                    {currentTrack === index && isPlaying ? (
                      <div className="flex gap-1">
                        <div className="w-1 h-6 bg-vintage-gold animate-pulse"></div>
                        <div className="w-1 h-4 bg-vintage-red animate-pulse" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-5 bg-vintage-gold animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    ) : (
                      <Icon name="Play" size={20} className="text-vintage-brown/60 group-hover:text-vintage-gold transition-colors" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}