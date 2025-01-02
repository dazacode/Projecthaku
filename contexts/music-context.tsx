"use client"

import { createContext, useContext, useState, useRef, ReactNode, useEffect } from "react"
import YouTube from "react-youtube"

interface MusicContextType {
  isPlaying: boolean
  isMuted: boolean
  volume: number
  currentTrackIndex: number
  duration: string
  togglePlay: () => void
  toggleMute: () => void
  handleVolumeChange: (value: number[]) => void
  nextTrack: () => void
  setDuration: (duration: string) => void
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export const lofiChannels = [
  {
    title: "Lofi Girl",
    videoId: "jfKfPfyJRdk",
    thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg"
  },
  {
    title: "Steezy As Fuck",
    videoId: "g2Q9e1d_8Rc",
    thumbnail: "https://i.ytimg.com/vi/g2Q9e1d_8Rc/hqdefault.jpg"
  },
  {
    title: "Chillhop Music",
    videoId: "5yx6BWlEVcY",
    thumbnail: "https://i.ytimg.com/vi/5yx6BWlEVcY/hqdefault.jpg"
  }
]

export function MusicProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [duration, setDuration] = useState("00:00")
  const playerRef = useRef<YouTube>(null)

  const handleReady = (event: any) => {
    const player = event.target
    player.setVolume(volume * 100)
    if (isPlaying) {
      player.playVideo()
    }
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      let seconds = 0
      interval = setInterval(() => {
        seconds++
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        setDuration(
          `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
        )
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  useEffect(() => {
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer()
      if (player) {
        player.loadVideoById(lofiChannels[currentTrackIndex].videoId)
      }
    }
  }, [currentTrackIndex])

  const togglePlay = async () => {
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer()
      if (player) {
        if (isPlaying) {
          player.pauseVideo()
        } else {
          player.playVideo()
        }
        setIsPlaying(!isPlaying)
      }
    }
  }

  const toggleMute = () => {
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer()
      if (player) {
        if (isMuted) {
          player.unMute()
          player.setVolume(volume * 100)
        } else {
          player.mute()
        }
        setIsMuted(!isMuted)
      }
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer()
      if (player) {
        player.setVolume(newVolume * 100)
        if (newVolume > 0 && isMuted) {
          player.unMute()
          setIsMuted(false)
        }
      }
    }
  }

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % lofiChannels.length)
  }

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        currentTrackIndex,
        duration,
        togglePlay,
        toggleMute,
        handleVolumeChange,
        nextTrack,
        setDuration,
      }}
    >
      {children}
      {/* Hidden YouTube player */}
      <div className="fixed top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none">
        <YouTube
          ref={playerRef}
          videoId={lofiChannels[currentTrackIndex].videoId}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: isPlaying ? 1 : 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              iv_load_policy: 3,
              modestbranding: 1,
              rel: 0
            }
          }}
          onReady={handleReady}
        />
      </div>
    </MusicContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicProvider")
  }
  return context
}
