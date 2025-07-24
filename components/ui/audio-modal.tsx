"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Volume2, User, Clock, Calendar } from "lucide-react"
import type { VoiceNote } from "@/lib/voice-notes-data"

interface AudioModalProps {
  isOpen: boolean
  onClose: () => void
  voiceNote: VoiceNote | null
}

export function AudioModal({ isOpen, onClose, voiceNote }: AudioModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (voiceNote && audioRef.current) {
      // Mock audio duration
      setDuration(voiceNote.duration)
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }, [voiceNote])

  const togglePlayback = () => {
    if (isPlaying) {
      setIsPlaying(false)
      // In real app, would pause actual audio
    } else {
      setIsPlaying(true)
      // Mock playback progress
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false)
            clearInterval(interval)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (!voiceNote) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Voice Note Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="bg-skype-blue/10 p-2 rounded-full">
              <User className="h-5 w-5 text-skype-blue" />
            </div>
            <div>
              <p className="font-semibold">{voiceNote.userEmail}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-3 w-3" />
                <span>{voiceNote.timestamp.toLocaleDateString()}</span>
                <span>{voiceNote.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Status and Duration */}
          <div className="flex justify-between items-center">
            <Badge className={getStatusColor(voiceNote.status)}>{voiceNote.status}</Badge>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Duration: {formatTime(voiceNote.duration)}</span>
            </div>
          </div>

          {/* Audio Player */}
          <div className="bg-gradient-to-r from-skype-blue/5 to-skype-light-blue/5 p-6 rounded-lg border border-skype-blue/20">
            <div className="flex items-center space-x-4 mb-4">
              <Button onClick={togglePlayback} className="w-12 h-12 rounded-full skype-gradient text-white">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Volume2 className="h-4 w-4 text-skype-blue" />
                  <span className="text-sm font-medium">Voice Message</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-skype-blue h-2 rounded-full transition-all duration-300"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transcription */}
          {voiceNote.transcription && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Transcription:</h4>
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm">{voiceNote.transcription}</p>
              </div>
            </div>
          )}

          {/* Mock audio element for future real implementation */}
          <audio ref={audioRef} style={{ display: "none" }}>
            <source src="/mock-audio.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </DialogContent>
    </Dialog>
  )
}
