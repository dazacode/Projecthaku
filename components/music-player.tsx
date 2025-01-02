"use client"

import { Play, Pause, SkipForward, Volume2, VolumeX } from "lucide-react"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"
import { useMusicPlayer, lofiChannels } from "@/contexts/music-context"

export function MusicPlayer() {
  const {
    isPlaying,
    isMuted,
    volume,
    currentTrackIndex,
    duration,
    togglePlay,
    toggleMute,
    handleVolumeChange,
    nextTrack,
  } = useMusicPlayer()

  return (
    <div className="flex flex-col bg-card rounded-lg overflow-hidden">
      {/* Thumbnail and Info */}
      <div className="flex h-16 bg-card">
        <div className="relative w-16 h-16 flex-shrink-0">
          <img
            src={lofiChannels[currentTrackIndex].thumbnail}
            alt={lofiChannels[currentTrackIndex].title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center px-3 min-w-0">
          <h3 className="font-medium truncate">
            {lofiChannels[currentTrackIndex].title}
          </h3>
          <p className="text-sm text-muted-foreground">Live Radio • {duration}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="p-2 flex items-center gap-2 bg-card border-t">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={nextTrack}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Slider
            defaultValue={[0.5]}
            max={1}
            step={0.1}
            value={[volume]}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  )
}
