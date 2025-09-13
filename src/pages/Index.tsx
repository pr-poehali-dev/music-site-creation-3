import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

// Mock data for music tracks
const tracks = [
  {
    id: 1,
    title: "Cosmic Journey",
    artist: "Space Explorer",
    duration: "3:45",
    cover: "/img/8428ae13-6dcb-441f-8da4-1d87d37da424.jpg",
    audioSrc: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    id: 2,
    title: "Digital Dreams",
    artist: "Neon Nights",
    duration: "4:12",
    cover: "/img/8399ffd3-0233-4ad9-849a-d1d592ae9149.jpg",
    audioSrc: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
  },
  {
    id: 3,
    title: "Urban Beat",
    artist: "City Pulse",
    duration: "3:28",
    cover: "/img/3b4874d8-a67c-415a-9b5d-ec7bbeed9f24.jpg",
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
    <div className="min-h-screen bg-gradient-to-br from-music-purple via-music-dark to-music-orange">
      <audio 
        ref={audioRef} 
        src={tracks[currentTrack].audioSrc}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-music-purple/20 to-music-orange/20"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center text-white">
            <h1 className="bebas-font text-8xl md:text-9xl font-bold mb-6 tracking-wider">
              MUSIC ARTIST
            </h1>
            <p className="text-xl md:text-2xl text-music-white/80 max-w-2xl mx-auto leading-relaxed">
              Погружайся в космические звуки будущего
            </p>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <div className="container mx-auto px-6 py-8">
        <Card className="bg-black/40 backdrop-blur-lg border-music-orange/20">
          <CardContent className="p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={tracks[currentTrack].cover} 
                  alt={tracks[currentTrack].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="bebas-font text-2xl text-music-white tracking-wide">
                  {tracks[currentTrack].title}
                </h3>
                <p className="text-music-white/60">
                  {tracks[currentTrack].artist}
                </p>
              </div>
              <Button
                onClick={togglePlay}
                size="lg"
                className="bg-music-orange hover:bg-music-gold text-white rounded-full w-16 h-16"
              >
                <Icon name={isPlaying ? "Pause" : "Play"} size={24} />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div 
                className="w-full h-2 bg-music-white/20 rounded-full cursor-pointer relative"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-gradient-to-r from-music-orange to-music-gold rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-music-white/60">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Track List */}
      <div className="container mx-auto px-6 pb-20">
        <h2 className="bebas-font text-4xl text-music-white mb-8 text-center tracking-wide">
          ТРЕКИ
        </h2>
        <div className="grid gap-4 max-w-4xl mx-auto">
          {tracks.map((track, index) => (
            <Card 
              key={track.id}
              className={`bg-black/30 backdrop-blur border-music-white/10 hover:border-music-orange/50 transition-all cursor-pointer group ${
                currentTrack === index ? 'border-music-orange bg-music-orange/10' : ''
              }`}
              onClick={() => playTrack(index)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={track.cover} 
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="bebas-font text-xl text-music-white tracking-wide">
                      {track.title}
                    </h3>
                    <p className="text-music-white/60">
                      {track.artist}
                    </p>
                  </div>
                  <div className="text-music-white/60">
                    {track.duration}
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center">
                    {currentTrack === index && isPlaying ? (
                      <div className="flex gap-1">
                        <div className="w-1 h-6 bg-music-orange animate-pulse"></div>
                        <div className="w-1 h-4 bg-music-gold animate-pulse" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-5 bg-music-orange animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    ) : (
                      <Icon name="Play" size={20} className="text-music-white/40 group-hover:text-music-orange transition-colors" />
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