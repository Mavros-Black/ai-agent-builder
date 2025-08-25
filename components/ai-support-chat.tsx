'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  X,
  Minimize2,
  Maximize2,
  Sparkles
} from 'lucide-react'
import { AIService } from '@/lib/ai-service'

interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: Date
}

interface AISupportChatProps {
  className?: string
}

export function AISupportChat({ className }: AISupportChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI assistant. I can help you with workflow creation, tool integration, platform usage, and technical questions. What can I help you with today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      console.log('🔍 Calling AI support API with question:', inputValue);
      
      const response = await fetch('/api/ai/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: inputValue,
          context: {
            currentPage: window.location.pathname,
            userAgent: navigator.userAgent
          }
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('🔍 AI support API response:', data);
      
      if (data.success && data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'ai',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('Invalid response format')
      }
    } catch (error) {
      console.error('Failed to get AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm experiencing technical difficulties. Please try again or contact our support team for assistance.",
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    "How do I create my first workflow?",
    "What tools can I integrate?",
    "How do I upgrade my plan?",
    "How do I optimize my workflows?"
  ]

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full w-14 h-14 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 w-96 ${className}`}>
      <Card className="shadow-2xl border-0">
        <CardHeader className="pb-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <CardTitle className="text-lg">AI Assistant</CardTitle>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardDescription className="text-white/80">
            Ask me anything about workflows, tools, or platform features
          </CardDescription>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.sender === 'ai' && (
                          <Bot className="w-4 h-4 mt-0.5 text-purple-600" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                        {message.sender === 'user' && (
                          <User className="w-4 h-4 mt-0.5" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-purple-600" />
                        <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length === 1 && (
                <div className="p-4 border-t bg-gray-50">
                  <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
                  <div className="space-y-2">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto p-2 text-xs"
                        onClick={() => setInputValue(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
