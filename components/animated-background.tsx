"use client"

import { useEffect, useState } from "react"

const images = [
  "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=2070", // Red temple
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070", // Cherry blossoms
  "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2070", // Tea ceremony
  "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=2070", // Tokyo street
  "https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?q=80&w=2070", // Japanese garden
]

export function AnimatedBackground() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [nextImageIndex, setNextImageIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
        setNextImageIndex((prev) => (prev + 1) % images.length)
        setIsTransitioning(false)
      }, 1000)
    }, 10000) // Change image every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 -z-10">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: `url('${images[currentImageIndex]}')`,
          opacity: isTransitioning ? 0 : 1,
        }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: `url('${images[nextImageIndex]}')`,
          opacity: isTransitioning ? 1 : 0,
        }}
      />
      <div className="absolute inset-0 bg-black/40" /> {/* Overlay to ensure text readability */}
    </div>
  )
}
