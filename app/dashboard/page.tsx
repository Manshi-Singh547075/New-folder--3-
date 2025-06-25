"use client"

// Extend the Window interface to include 'omnidimension'
declare global {
  interface Window {
    omnidimension?: {
      chat?: (command: string, options?: any) => Promise<any>
    }
  }
}

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useOmniDimension } from "@/hooks/use-omnidimension"
import { AgentStatusCard } from "@/components/agent-status-card"
import { ActionQueue } from "@/components/action-queue"
import { ExecutionLog } from "@/components/execution-log"
import { SystemMetrics } from "@/components/system-metrics"
import { Phone, Calendar, Mail, MessageSquare, Zap, Send, Mic, Settings, Wifi, WifiOff, Bot, User } from "lucide-react"

export default function OmniDimensionOrchestration() {
  const [command, setCommand] = useState("")
  const [isListening, setIsListening] = useState(false)
  type ConversationMessage = {
    id: number
    type: 'user' | 'agent'
    content: string
    timestamp: string
    actions?: any[]
    metadata?: any
    isError?: boolean
  }
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [isProcessingCommand, setIsProcessingCommand] = useState(false)

  const {
    agents,
    tasks,
    actionQueue,
    executionLog,
    systemMetrics,
    isConnected,
    isProcessingVoice,
    liveTranscription,
    executeCommand,
    startVoiceRecording,
    stopVoiceRecording,
    handleAgentAction,
    handleQueuePriorityChange,
    handleQueueStatusChange,
  } = useOmniDimension()

  const handleExecuteCommand = async () => {
    if (command.trim()) {
      setIsProcessingCommand(true)
      
      // Add user message to conversation
      const userMessage: ConversationMessage = {
        id: Date.now() + Math.random(),
        type: 'user',
        content: command.trim(),
        timestamp: new Date().toISOString()
      }
      
      setConversation(prev => [...prev, userMessage])
      const currentCommand = command.trim()
      setCommand("")
      
      try {
        // Execute the command and get AI response
        const result = await executeCommand(currentCommand)
        
        // Get real-time AI response
        const aiResponse = await getAIResponse(currentCommand, result, conversation)
        
        const agentResponse: ConversationMessage = {
          id: Date.now() + Math.random(),
          type: 'agent',
          content: aiResponse.message,
          timestamp: new Date().toISOString(),
          actions: result?.actions || [],
          metadata: aiResponse.metadata
        }
        
        setConversation(prev => [...prev, agentResponse])
        setIsProcessingCommand(false)
        
      } catch (error) {
        console.error('Command execution error:', error)
        const errorMessage =
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message: string }).message
            : String(error)
        const errorResponse: ConversationMessage = {
          id: Date.now() + Math.random(),
          type: 'agent',
          content: `I encountered an error while processing your command: ${errorMessage}. Please try again or rephrase your request.`,
          timestamp: new Date().toISOString(),
          isError: true
        }
        
        setConversation(prev => [...prev, errorResponse])
        setIsProcessingCommand(false)
      }
    }
  }

  const getAIResponse = async (
    command: string,
    executionResult: any,
    conversationHistory: ConversationMessage[]
  ) => {
    try {
      // Prepare context for AI
      const context = {
        command,
        executionResult,
        conversationHistory: conversationHistory.slice(-10), // Last 10 messages for context
        agentCapabilities: agents.map(agent => ({
          id: agent.id,
          name: agent.name,
          status: agent.status,
          capabilities: agent.capabilities
        })),
        systemMetrics,
        currentTasks: tasks,
        timestamp: new Date().toISOString()
      }

      // Call your AI service endpoint
     const response = await fetch('/api/omnidimension/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    command,
    conversationHistory
  })
})


      if (!response.ok) {
        throw new Error(`AI service error: ${response.status}`)
      }

      const aiResponse = await response.json()
      return {
        message: aiResponse.message,
        metadata: aiResponse.metadata || {}
      }

    } catch (error) {
      console.error('AI Response Error:', error)
      
      // Fallback to OmniDimension API if available
      if (window.omnidimension && window.omnidimension.chat) {
        try {
          const fallbackResponse = await window.omnidimension.chat(command, {
            context: conversationHistory,
            agents: agents,
            metrics: systemMetrics
          })
          
          return {
            message: fallbackResponse.message,
            metadata: { source: 'omnidimension_widget' }
          }
        } catch (widgetError) {
          console.error('Widget fallback error:', widgetError)
        }
      }
      
      // Final fallback
      return {
        message: "I'm processing your request. Due to a temporary communication issue, I'll provide updates as the execution progresses. You can monitor the action queue and execution log for real-time status.",
        metadata: { source: 'fallback' }
      }
    }
  }

  const handleVoiceToggle = async () => {
    if (isListening) {
      stopVoiceRecording()
      setIsListening(false)
    } else {
      const success = await startVoiceRecording()
      setIsListening(success)
    }
  }

  const handleQuickAction = (actionCommand: string) => {
    setCommand(actionCommand)
    handleExecuteCommand()
  }

  useEffect(() => {
    const script = document.createElement("script")
    script.id = "omnidimension-web-widget"
    script.src = "https://backend.omnidim.io/web_widget.js?secret_key=0f586f0dc7a776aadb51fa8adff2dfce"
    script.async = true
    document.body.appendChild(script)

    return () => {
      const existingScript = document.getElementById("omnidimension-web-widget")
      if (existingScript) existingScript.remove()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">OmniDimension</h1>
                <p className="text-sm text-slate-400">AI Agent Orchestration</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className={`${isConnected ? "text-green-400 border-green-400" : "text-yellow-400 border-yellow-400"}`}
              >
                {isConnected ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                {isConnected ? "Live Mode" : "Demo Mode"}
              </Badge>
              <Button variant="ghost" size="icon" className="text-slate-400">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        <SystemMetrics metrics={systemMetrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  OmniDimension Assistant
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Interact with your AI agent using natural language
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Conversation Display */}
                <div className="bg-slate-900/50 rounded-lg p-4 max-h-80 overflow-y-auto space-y-3">
                  {conversation.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">
                      <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Start a conversation with your OmniDimension Agent</p>
                      <p className="text-sm mt-1">Try: "Call all leads from yesterday and schedule follow-ups"</p>
                    </div>
                  ) : (
                    conversation.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === 'user' 
                              ? 'bg-blue-600' 
                              : message.isError 
                              ? 'bg-red-600' 
                              : 'bg-green-600'
                          }`}>
                            {message.type === 'user' ? (
                              <User className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div className={`rounded-lg p-3 ${
                            message.type === 'user' 
                              ? 'bg-blue-600 text-white' 
                              : message.isError 
                              ? 'bg-red-900/50 text-red-200 border border-red-700' 
                              : 'bg-slate-700 text-slate-200'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            {message.actions && message.actions.length > 0 && (
                              <div className="mt-2 text-xs opacity-80">
                                Actions queued: {message.actions.length}
                              </div>
                            )}
                            <div className="text-xs opacity-60 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {/* Processing Indicator */}
                  {isProcessingCommand && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-slate-700 text-slate-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                          </div>
                          <span className="text-sm">Processing your request...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Textarea
                  placeholder="e.g., 'Call all leads from yesterday, book a demo for interested prospects, and send follow-up emails to those who didn't answer'"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 min-h-[100px]"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleExecuteCommand()
                    }
                  }}
                />

                {isListening && liveTranscription && (
                  <div className="p-2 bg-slate-700 text-yellow-400 rounded-md text-sm italic">
                    {liveTranscription}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleExecuteCommand}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                    disabled={!command.trim() || isProcessingCommand}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isProcessingCommand ? 'Processing...' : 'Execute Command'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`border-slate-600 ${
                      isListening
                        ? "bg-red-600 text-white"
                        : isProcessingVoice
                        ? "bg-yellow-600 text-white"
                        : "text-slate-400"
                    }`}
                    onClick={handleVoiceToggle}
                    disabled={isProcessingVoice}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <ActionQueue
              actions={actionQueue}
              onPriorityChange={handleQueuePriorityChange}
              onStatusChange={handleQueueStatusChange}
            />

            <ExecutionLog logs={executionLog} />
          </div>

          <div className="space-y-6">
            <h3 className="text-white font-semibold">Agent Status</h3>
            {agents.map((agent) => (
              <AgentStatusCard key={agent.id} agent={agent} onAction={handleAgentAction} />
            ))}

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-slate-400">Common orchestration patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start text-slate-300 border-slate-600 hover:bg-slate-700"
                  onClick={() => handleQuickAction("Call all leads from this week and schedule follow-up meetings")}
                  disabled={isProcessingCommand}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Lead Outreach Campaign
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-slate-300 border-slate-600 hover:bg-slate-700"
                  onClick={() => handleQuickAction("Book restaurant reservations for team dinner next Friday")}
                  disabled={isProcessingCommand}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Event Coordination
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-slate-300 border-slate-600 hover:bg-slate-700"
                  onClick={() => handleQuickAction("Send personalized follow-up emails to all demo attendees")}
                  disabled={isProcessingCommand}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Automation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}