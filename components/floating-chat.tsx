"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageCircle, Mic, MicOff, X } from "lucide-react"

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState<Array<{ id: string; text: string; type: "user" | "ai" }>>([])

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      // Start recording
      setTimeout(() => {
        setIsRecording(false)
        const newMessage = {
          id: Date.now().toString(),
          text: "Voice message recorded",
          type: "user" as const,
        }
        setMessages((prev) => [...prev, newMessage])

        // Simulate AI response
        setTimeout(() => {
          const aiResponse = {
            id: (Date.now() + 1).toString(),
            text: "I heard your voice message! How can I assist you today?",
            type: "ai" as const,
          }
          setMessages((prev) => [...prev, aiResponse])
        }, 1000)
      }, 2000)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>AI Voice Chat</span>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {/* Messages */}
          <div className="flex-1 overflow-auto space-y-4 p-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Start a conversation with your AI assistant</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.type === "user" ? "bg-primary text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Voice Recording */}
          <div className="border-t p-4">
            <div className="flex items-center justify-center space-x-4">
              <Button
                onClick={toggleRecording}
                className={`h-12 w-12 rounded-full ${
                  isRecording ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
                }`}
                size="icon"
              >
                {isRecording ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
              </Button>
              {isRecording && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-500 text-sm font-medium">Recording...</span>
                </div>
              )}
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">
              {isRecording ? "Tap to stop recording" : "Tap to start voice recording"}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
