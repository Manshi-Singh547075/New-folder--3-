"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { OmniDimensionSDK } from "@/lib/omnidimension-sdk"
import { WebSocketClient } from "@/lib/websocket-client"
import { useToast } from "@/hooks/use-toast"

let SpeechRecognition: any;

if (typeof window !== "undefined") {
  SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
}

// const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

interface Agent {
  id: string
  name: string
  type: string
  status: "idle" | "active" | "completed" | "error"
  progress: number
  lastAction: string
  avatar: string
  capabilities?: string[]
  tasksCompleted?: number
  successRate?: number
  avgResponseTime?: number
}

interface Task {
  id: string
  instruction: string
  status: string
  agents: string[]
  timestamp: Date
  results?: string[]
}

interface QueuedAction {
  id: string
  instruction: string
  priority: "high" | "medium" | "low"
  status: "queued" | "processing" | "paused"
  estimatedTime: number
  assignedAgents: string[]
  createdAt: Date
}

interface LogEntry {
  id: string
  timestamp: Date
  level: "info" | "success" | "warning" | "error"
  message: string
  agentId?: string
  taskId?: string
  duration?: number
}

interface SystemMetrics {
  activeTasks: number
  completedTasks: number
  failedTasks: number
  totalAgents: number
  activeAgents: number
  avgResponseTime: number
  successRate: number
  systemLoad: number
  uptime: number
  throughput: number
}

export function useOmniDimension() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [actionQueue, setActionQueue] = useState<QueuedAction[]>([])
  const [executionLog, setExecutionLog] = useState<LogEntry[]>([])
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    activeTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    totalAgents: 4,
    activeAgents: 0,
    avgResponseTime: 1200,
    successRate: 94.2,
    systemLoad: 45,
    uptime: 86400,
    throughput: 12.5,
  })
  const [isConnected, setIsConnected] = useState(false)
  const [isProcessingVoice, setIsProcessingVoice] = useState(false)
  const [liveTranscription, setLiveTranscription] = useState("")

  const { toast } = useToast()
  const sdkRef = useRef<OmniDimensionSDK | null>(null)
  const wsRef = useRef<WebSocketClient | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recognitionRef = useRef<any>(null)

  // Add log entry
  const addLogEntry = useCallback(
    (level: LogEntry["level"], message: string, agentId?: string, taskId?: string, duration?: number) => {
      const logEntry: LogEntry = {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        level,
        message,
        agentId,
        taskId,
        duration,
      }

      setExecutionLog((prev) => [logEntry, ...prev.slice(0, 99)])
    },
    [],
  )

  // Initialize OmniDimension SDK
  useEffect(() => {
    sdkRef.current = new OmniDimensionSDK({
      apiKey: process.env.NEXT_PUBLIC_OMNIDIMENSION_API_KEY || "demo-key",
      voiceModel: "omnidimension-voice-v2",
      region: "us-east-1",
    })

    // Initialize WebSocket connection with fallback
    wsRef.current = new WebSocketClient()

    // Only attempt WebSocket connection if URL is provided and valid
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL
    if (wsUrl && !wsUrl.includes("localhost:8080")) {
      wsRef.current.connect(wsUrl, handleWebSocketMessage, setIsConnected)
      addLogEntry("info", "Attempting WebSocket connection...")
    } else {
      // Set to disconnected state for demo mode
      setIsConnected(false)
      addLogEntry("info", "Running in demo mode without WebSocket server")
    }

    // Load initial agents
    loadAgents()

    return () => {
      wsRef.current?.disconnect()
    }
  }, [addLogEntry])

  // Update system metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const activeAgents = agents.filter((a) => a.status === "active").length
      const activeTasks = tasks.filter((t) => t.status === "processing").length
      const completedTasks = tasks.filter((t) => t.status === "completed").length
      const failedTasks = tasks.filter((t) => t.status === "failed").length

      setSystemMetrics((prev) => ({
        ...prev,
        activeAgents,
        activeTasks,
        completedTasks,
        failedTasks,
        uptime: prev.uptime + 5,
        systemLoad: Math.max(20, Math.min(90, prev.systemLoad + (Math.random() - 0.5) * 10)),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [agents, tasks])

  const handleWebSocketMessage = useCallback(
    (data: any) => {
      switch (data.type) {
        case "agent_update":
          setAgents((prev) => prev.map((agent) => (agent.id === data.agentId ? { ...agent, ...data.updates } : agent)))
          addLogEntry("info", `Agent ${data.agentId} updated: ${data.updates.lastAction}`, data.agentId)
          break

        case "task_update":
          setTasks((prev) => prev.map((task) => (task.id === data.taskId ? { ...task, ...data.updates } : task)))
          addLogEntry("success", `Task ${data.taskId} updated`, undefined, data.taskId)
          break

        case "new_result":
          setTasks((prev) =>
            prev.map((task) =>
              task.id === data.taskId
                ? {
                    ...task,
                    results: [...(task.results || []), data.result],
                  }
                : task,
            ),
          )
          addLogEntry("success", `Task result: ${data.result}`, undefined, data.taskId)
          break
      }
    },
    [addLogEntry],
  )

  const loadAgents = async () => {
    try {
      const response = await fetch("/api/agents")
      const data = await response.json()
      setAgents(
        data.agents.map((agent: any) => ({
          ...agent,
          tasksCompleted: Math.floor(Math.random() * 50) + 10,
          successRate: Math.floor(Math.random() * 10) + 90,
          avgResponseTime: Math.floor(Math.random() * 1000) + 500,
        })),
      )
      addLogEntry("success", "Agents loaded successfully")
    } catch (error) {
      console.error("Failed to load agents:", error)
      addLogEntry("error", "Failed to load agents from API")
      // Fallback to default agents if API fails
      setAgents([
        {
          id: "agent-1",
          name: "CallBot Pro",
          type: "phone",
          status: "idle",
          progress: 0,
          lastAction: "Ready for calls",
          avatar: "📞",
          capabilities: ["voice_calls", "sms", "voicemail"],
          tasksCompleted: 23,
          successRate: 96,
          avgResponseTime: 850,
        },
        {
          id: "agent-2",
          name: "BookingMaster",
          type: "booking",
          status: "idle",
          progress: 0,
          lastAction: "Ready for bookings",
          avatar: "📅",
          capabilities: ["calendar", "reservations", "scheduling"],
          tasksCompleted: 18,
          successRate: 94,
          avgResponseTime: 1200,
        },
        {
          id: "agent-3",
          name: "EmailAssistant",
          type: "email",
          status: "idle",
          progress: 0,
          lastAction: "Ready for emails",
          avatar: "✉️",
          capabilities: ["email", "templates", "tracking"],
          tasksCompleted: 31,
          successRate: 98,
          avgResponseTime: 650,
        },
        {
          id: "agent-4",
          name: "FollowUpBot",
          type: "followup",
          status: "idle",
          progress: 0,
          lastAction: "Monitoring for follow-ups",
          avatar: "🔄",
          capabilities: ["reminders", "tracking", "automation"],
          tasksCompleted: 15,
          successRate: 92,
          avgResponseTime: 950,
        },
      ])
    }
  }

  const simulateTaskExecution = (taskId: string, command: string) => {
    // Simulate agent activation and progress when WebSocket is not available
    const selectedAgents = ["agent-1", "agent-2"]

    addLogEntry("info", `Starting task execution: ${command.slice(0, 50)}...`, undefined, taskId)

    // Update agents to active status
    setAgents((prev) =>
      prev.map((agent) =>
        selectedAgents.includes(agent.id)
          ? { ...agent, status: "active", progress: 10, lastAction: `Processing: ${command.slice(0, 30)}...` }
          : agent,
      ),
    )

    // Simulate progress updates
    let progress = 10
    const interval = setInterval(() => {
      progress += Math.random() * 20

      if (progress >= 100) {
        clearInterval(interval)

        // Mark agents as completed
        setAgents((prev) =>
          prev.map((agent) =>
            selectedAgents.includes(agent.id)
              ? {
                  ...agent,
                  status: "completed",
                  progress: 100,
                  lastAction: "Task completed successfully",
                  tasksCompleted: (agent.tasksCompleted || 0) + 1,
                }
              : agent,
          ),
        )

        // Update task status
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: "completed",
                  results: ["Task completed successfully", "All agents finished execution"],
                }
              : task,
          ),
        )

        addLogEntry("success", `Task ${taskId} completed successfully`, undefined, taskId, 5000)

        toast({
          title: "Task Completed",
          description: "All agents have finished execution successfully",
          className: "bg-slate-800 border-slate-700 text-white",
        })
      } else {
        setAgents((prev) =>
          prev.map((agent) =>
            selectedAgents.includes(agent.id) ? { ...agent, progress: Math.min(progress, 100) } : agent,
          ),
        )
      }
    }, 1500)
  }

  const executeCommand = async (command: string) => {
    try {
      addLogEntry("info", `Executing command: ${command}`)

      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      })

      const result = await response.json()

      // Check if it's a "email" command


      if (command.toLowerCase().startsWith("send email")) {
  // Example: send email to john@example.com with subject "Hi" and message "Hello John"
  const match = command.match(
    /send email to ([^ ]+) with subject ['"](.+?)['"] and message ['"](.+?)['"]/i
  )

  if (match) {
    const [, to, subject, content] = match

    const emailRes = await fetch("/api/sendgrid/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, content }),
    })

    const emailResult = await emailRes.json()

    if (emailResult.success) {
      addLogEntry("success", `Email sent to ${to} with subject "${subject}"`)
      toast({
        title: "Email Sent",
        description: `Email sent to ${to}`,
        className: "bg-slate-800 border-slate-700 text-white",
      })
    } else {
      addLogEntry("error", `Email failed: ${emailResult.error}`)
      toast({
        title: "Email Failed",
        description: emailResult.error,
        className: "bg-red-900 border-red-700 text-white",
      })
    }

    return emailResult
  } else {
    addLogEntry("error", `Invalid email command format`)
    throw new Error("Invalid email command format")
  }
}

      // Check if it's a "Call" command
const callRegex = /call\s+(\+?\d{10,15})(?:\s+and\s+say\s+(.+))?/i
const match = command.match(callRegex)

if (match) {
  const phoneNumber = match[1]
  const message =
    match[2] ||
    "Hello! This is an automated call from OmniDimension AI Agent. Thank you for using our services."

  try {
    const res = await fetch("/api/twilio/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({  to: phoneNumber, message  }),
    })

    const data = await res.json()

    if (data.success) {
      addLogEntry("success", `Call to ${phoneNumber} initiated `)
      toast({
        title: "Call Initiated",
        description: `Calling ${phoneNumber}`,
        className: "bg-slate-800 border-slate-700 text-white",
      })
    } else {
      addLogEntry("error", `Call failed: ${data.error}`)
      toast({
        title: "Call Failed",
        description: data.error || "Unable to initiate call.",
        className: "bg-red-900 border-red-700 text-white",
      })
    }

    return data
  } catch (err) {
    console.error("Error calling Twilio API:", err)
    addLogEntry("error", `Twilio API error: ${err}`)
    toast({
      title: "Twilio API Error",
      description: "Failed to make the call. Please check server logs.",
      className: "bg-red-900 border-red-700 text-white",
    })
    throw err
  }
}


      // Add new task
      const newTask: Task = {
        id: result.taskId,
        instruction: command,
        status: "processing",
        agents: result.suggestedAgents || ["agent-1", "agent-2"],
        timestamp: new Date(),
      }

      setTasks((prev) => [newTask, ...prev])

      // Add to action queue
      const queuedAction: QueuedAction = {
        id: result.taskId,
        instruction: command,
        priority: "medium",
        status: "processing",
        estimatedTime: Math.floor(Math.random() * 60) + 30,
        assignedAgents: result.suggestedAgents || ["agent-1", "agent-2"],
        createdAt: new Date(),
      }

      setActionQueue((prev) => [queuedAction, ...prev])

      // Try to send via WebSocket, fallback to simulation
      const sent = wsRef.current?.send({
        type: "execute_command",
        command,
        taskId: result.taskId,
      })

      if (!sent) {
        // Fallback to local simulation when WebSocket is not available
        simulateTaskExecution(result.taskId, command)
      }

      toast({
        title: "Command Executed",
        description: `Task ${result.taskId} has been queued for processing`,
        className: "bg-slate-800 border-slate-700 text-white",
      })

      return result
    } catch (error) {
      console.error("Failed to execute command:", error)
      addLogEntry("error", `Failed to execute command: ${error}`)

      toast({
        title: "Execution Failed",
        description: "Failed to execute the command. Please try again.",
        className: "bg-red-900 border-red-700 text-white",
      })

      throw error
    }
  }

  const startVoiceRecording = async () => {
    if (SpeechRecognition) {
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = true
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript + " "
            } else {
              interimTranscript += transcript
            }
          }

          setLiveTranscription(interimTranscript || finalTranscript)

          if (finalTranscript.trim()) {
            executeCommand(finalTranscript.trim())
            setLiveTranscription("")
          }
        }

        recognitionRef.current.onerror = (event: any) => {
          addLogEntry("error", `Speech recognition error: ${event.error}`)
          setIsProcessingVoice(false)
        }

        recognitionRef.current.onend = () => {
          setIsProcessingVoice(false)
          setLiveTranscription("")
        }
      }

      try {
        recognitionRef.current.start()
        setIsProcessingVoice(true)
        addLogEntry("info", "Speech recognition started")
        return true
      } catch (error) {
        addLogEntry("error", `Speech recognition start failed: ${error}`)
        return false
      }
    } else {
      // Fallback to existing MediaRecorder implementation
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorderRef.current = new MediaRecorder(stream)
        audioChunksRef.current = []

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data)
        }

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
          await processVoiceCommand(audioBlob)
          stream.getTracks().forEach((track) => track.stop())
        }

        mediaRecorderRef.current.start()
        addLogEntry("info", "Voice recording started")

        toast({
          title: "Recording Started",
          description: "Listening for voice commands...",
          className: "bg-slate-800 border-slate-700 text-white",
        })

        return true
      } catch (error) {
        console.error("Failed to start voice recording:", error)
        addLogEntry("error", `Voice recording failed: ${error}`)
        return false
      }
    }
  }

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsProcessingVoice(false)
      setLiveTranscription("")
      addLogEntry("info", "Speech recognition stopped")
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
      addLogEntry("info", "Voice recording stopped")
    }
  }

  const processVoiceCommand = async (audioBlob: Blob) => {
    setIsProcessingVoice(true)
    addLogEntry("info", "Processing voice command...")

    try {
      const formData = new FormData()
      formData.append("audio", audioBlob)

      const response = await fetch("/api/voice/process", {
        method: "POST",
        body: formData,
      })

      const voiceResult = await response.json()

      if (voiceResult.text) {
        addLogEntry("success", `Voice command recognized: ${voiceResult.text}`)
        await executeCommand(voiceResult.text)
      }

      return voiceResult
    } catch (error) {
      console.error("Failed to process voice command:", error)
      addLogEntry("error", `Voice processing failed: ${error}`)
      // Fallback to demo voice command
      const demoCommand = "Call Sarah Johnson about the project update and schedule a follow-up meeting"
      await executeCommand(demoCommand)
    } finally {
      setIsProcessingVoice(false)
    }
  }

  const handleAgentAction = (agentId: string, action: "start" | "pause" | "reset") => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === agentId) {
          switch (action) {
            case "start":
              addLogEntry("info", `Agent ${agentId} started manually`)
              return { ...agent, status: "active", progress: 0, lastAction: "Manual start initiated" }
            case "pause":
              addLogEntry("info", `Agent ${agentId} paused manually`)
              return { ...agent, status: "idle", lastAction: "Paused by user" }
            case "reset":
              addLogEntry("info", `Agent ${agentId} reset manually`)
              return { ...agent, status: "idle", progress: 0, lastAction: "Reset by user" }
            default:
              return agent
          }
        }
        return agent
      }),
    )
  }

  const handleQueuePriorityChange = (actionId: string, direction: "up" | "down") => {
    setActionQueue((prev) => {
      const index = prev.findIndex((action) => action.id === actionId)
      if (index === -1) return prev

      const newQueue = [...prev]
      const targetIndex = direction === "up" ? index - 1 : index + 1

      if (targetIndex >= 0 && targetIndex < newQueue.length) {
        ;[newQueue[index], newQueue[targetIndex]] = [newQueue[targetIndex], newQueue[index]]
        addLogEntry("info", `Action ${actionId} moved ${direction} in queue`)
      }

      return newQueue
    })
  }

  const handleQueueStatusChange = (actionId: string, status: "play" | "pause" | "cancel") => {
    setActionQueue(
      (prev) =>
        prev
          .map((action) => {
            if (action.id === actionId) {
              switch (status) {
                case "play":
                  addLogEntry("info", `Action ${actionId} resumed`)
                  return { ...action, status: "processing" as const }
                case "pause":
                  addLogEntry("info", `Action ${actionId} paused`)
                  return { ...action, status: "paused" as const }
                case "cancel":
                  addLogEntry("warning", `Action ${actionId} cancelled`)
                  return null
              }
            }
            return action
          })
          .filter(Boolean) as QueuedAction[],
    )
  }

  return {
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
    loadAgents,
    handleAgentAction,
    handleQueuePriorityChange,
    handleQueueStatusChange,
  }
}
