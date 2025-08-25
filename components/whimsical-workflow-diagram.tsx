'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  MessageSquare, 
  Bot, 
  Database, 
  Globe,
  Calendar,
  FileText,
  Mail,
  Search,
  Settings,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  ZoomIn,
  ZoomOut,
  RotateCcw as ResetZoom,
  Move,
  Home,
  Code,
  Save,
  Download,
  Copy,
  RefreshCw
} from 'lucide-react'

interface WorkflowNode {
  id: string
  name: string
  type: string
  position: [number, number]
  parameters?: any
}

interface WorkflowConnection {
  from: string
  to: string
  type?: string
}

interface WhimsicalWorkflowDiagramProps {
  workflow: {
    name: string
    type: string
    description: string
    nodes: WorkflowNode[]
    connections: any
  }
  className?: string
}

const getNodeIcon = (nodeType: string) => {
  switch (nodeType) {
    case 'n8n-nodes-base.webhook':
      return <Globe className="w-4 h-4" />
    case 'n8n-nodes-base.openAi':
      return <Bot className="w-4 h-4" />
    case 'n8n-nodes-base.function':
      return <Settings className="w-4 h-4" />
    case 'n8n-nodes-base.console':
      return <FileText className="w-4 h-4" />
    case 'n8n-nodes-base.notion':
      return <Database className="w-4 h-4" />
    case 'n8n-nodes-base.httpRequest':
      return <Globe className="w-4 h-4" />
    case 'n8n-nodes-base.respondToWebhook':
      return <MessageSquare className="w-4 h-4" />
    case 'n8n-nodes-base.emailSend':
      return <Mail className="w-4 h-4" />
    case 'n8n-nodes-base.googleCalendar':
      return <Calendar className="w-4 h-4" />
    case 'n8n-nodes-base.noOp':
      return <Settings className="w-4 h-4" />
    default:
      return <Zap className="w-4 h-4" />
  }
}

const getNodeColor = (nodeType: string) => {
  switch (nodeType) {
    case 'n8n-nodes-base.webhook':
      return 'bg-blue-500'
    case 'n8n-nodes-base.openAi':
      return 'bg-purple-500'
    case 'n8n-nodes-base.function':
      return 'bg-orange-500'
    case 'n8n-nodes-base.console':
      return 'bg-green-500'
    case 'n8n-nodes-base.notion':
      return 'bg-pink-500'
    case 'n8n-nodes-base.httpRequest':
      return 'bg-indigo-500'
    case 'n8n-nodes-base.respondToWebhook':
      return 'bg-teal-500'
    case 'n8n-nodes-base.emailSend':
      return 'bg-red-500'
    case 'n8n-nodes-base.googleCalendar':
      return 'bg-yellow-500'
    case 'n8n-nodes-base.noOp':
      return 'bg-gray-500'
    default:
      return 'bg-gray-500'
  }
}

const getNodeStatus = (nodeId: string, activeNode: string | null, completedNodes: string[]) => {
  if (activeNode === nodeId) return 'active'
  if (completedNodes.includes(nodeId)) return 'completed'
  return 'pending'
}

export function WhimsicalWorkflowDiagram({ workflow, className }: WhimsicalWorkflowDiagramProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [completedNodes, setCompletedNodes] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [showDetails, setShowDetails] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [nodeSpacing, setNodeSpacing] = useState(140)
  
  // Pan state
  const [isDragging, setIsDragging] = useState(false)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const diagramRef = useRef<HTMLDivElement>(null)

  // n8n Editor state
  const [showEditor, setShowEditor] = useState(false)
  const [n8nWorkflow, setN8nWorkflow] = useState('')
  const [isValidJson, setIsValidJson] = useState(true)
  const [lastSaved, setLastSaved] = useState<string>('')

  const nodeOrder = Object.keys(workflow.connections)
  const totalSteps = nodeOrder.length

  // Convert workflow to n8n format
  const generateN8nWorkflow = useCallback(() => {
    const n8nFormat = {
      name: workflow.name || "AI Agent Workflow",
      nodes: workflow.nodes.map((node, index) => ({
        parameters: node.parameters || {},
        name: node.name,
        type: node.type,
        typeVersion: 1,
        position: [250 + (index * 250), 300]
      })),
      connections: workflow.connections,
      active: false,
      settings: {},
      versionId: "1"
    }
    return JSON.stringify(n8nFormat, null, 2)
  }, [workflow])

  // Initialize n8n workflow when component mounts or workflow changes
  useEffect(() => {
    setN8nWorkflow(generateN8nWorkflow())
  }, [generateN8nWorkflow])

  const startAnimation = () => {
    setIsPlaying(true)
    setActiveNode(null)
    setCompletedNodes([])
    setCurrentStep(0)
    
    const animate = () => {
      if (currentStep < totalSteps) {
        const currentNode = nodeOrder[currentStep]
        setActiveNode(currentNode)
        
        setTimeout(() => {
          setCompletedNodes(prev => [...prev, currentNode])
          setActiveNode(null)
          setCurrentStep(prev => prev + 1)
          
          if (currentStep + 1 < totalSteps) {
            animate()
          } else {
            setIsPlaying(false)
          }
        }, 1500)
      }
    }
    
    animate()
  }

  const pauseAnimation = () => {
    setIsPlaying(false)
  }

  const resetAnimation = () => {
    setIsPlaying(false)
    setActiveNode(null)
    setCompletedNodes([])
    setCurrentStep(0)
  }

  const handleNodeClick = (nodeId: string) => {
    setShowDetails(showDetails === nodeId ? null : nodeId)
  }

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2))
    setNodeSpacing(prev => Math.min(prev + 20, 200))
  }

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5))
    setNodeSpacing(prev => Math.max(prev - 20, 80))
  }

  const resetZoom = () => {
    setZoomLevel(1)
    setNodeSpacing(140)
  }

  const resetPan = () => {
    setPanOffset({ x: 0, y: 0 })
  }

  const getNodeSize = () => {
    if (zoomLevel >= 1.5) return 'w-32 h-32'
    if (zoomLevel >= 1.2) return 'w-28 h-28'
    if (zoomLevel <= 0.7) return 'w-16 h-16'
    return 'w-24 h-24'
  }

  const getIconSize = () => {
    if (zoomLevel >= 1.5) return 'w-6 h-6'
    if (zoomLevel >= 1.2) return 'w-5 h-5'
    if (zoomLevel <= 0.7) return 'w-3 h-3'
    return 'w-4 h-4'
  }

  const getTextSize = () => {
    if (zoomLevel >= 1.5) return 'text-sm'
    if (zoomLevel >= 1.2) return 'text-xs'
    if (zoomLevel <= 0.7) return 'text-xs'
    return 'text-xs'
  }

  // Mouse event handlers for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button only
      setIsDragging(true)
      setDragStart({
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y
      })
      if (diagramRef.current) {
        diagramRef.current.style.cursor = 'grabbing'
      }
    }
  }, [panOffset])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    if (diagramRef.current) {
      diagramRef.current.style.cursor = 'grab'
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
    if (diagramRef.current) {
      diagramRef.current.style.cursor = 'grab'
    }
  }, [])

  // n8n Editor functions
  const handleN8nWorkflowChange = (value: string) => {
    setN8nWorkflow(value)
    try {
      JSON.parse(value)
      setIsValidJson(true)
    } catch {
      setIsValidJson(false)
    }
  }

  const saveN8nWorkflow = () => {
    if (isValidJson) {
      setLastSaved(new Date().toLocaleTimeString())
      // Here you could save to localStorage, database, or download file
      console.log('Saving n8n workflow:', n8nWorkflow)
    }
  }

  const downloadN8nWorkflow = () => {
    if (isValidJson) {
      const blob = new Blob([n8nWorkflow], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${workflow.name || 'workflow'}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const copyN8nWorkflow = async () => {
    if (isValidJson) {
      try {
        await navigator.clipboard.writeText(n8nWorkflow)
        console.log('Workflow copied to clipboard')
      } catch (err) {
        console.error('Failed to copy workflow')
      }
    }
  }

  const refreshN8nWorkflow = () => {
    setN8nWorkflow(generateN8nWorkflow())
    setIsValidJson(true)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Animation Controls */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">Interactive Workflow</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={isPlaying ? pauseAnimation : startAnimation}
                disabled={currentStep === totalSteps && !isPlaying}
                size="sm"
                variant="outline"
                className="bg-white"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                onClick={resetAnimation}
                size="sm"
                variant="outline"
                className="bg-white"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>
          <CardDescription>
            Click play to see your workflow in action, or click on nodes to see details
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Zoom and Pan Controls */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">View Controls</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={zoomOut}
                disabled={zoomLevel <= 0.5}
                size="sm"
                variant="outline"
                className="bg-white"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Badge variant="secondary" className="bg-white">
                {Math.round(zoomLevel * 100)}%
              </Badge>
              <Button
                onClick={zoomIn}
                disabled={zoomLevel >= 2}
                size="sm"
                variant="outline"
                className="bg-white"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                onClick={resetZoom}
                size="sm"
                variant="outline"
                className="bg-white"
              >
                <ResetZoom className="w-4 h-4" />
              </Button>
              <Button
                onClick={resetPan}
                size="sm"
                variant="outline"
                className="bg-white"
              >
                <Home className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setShowEditor(!showEditor)}
                size="sm"
                variant={showEditor ? "default" : "outline"}
                className={showEditor ? "bg-purple-600 hover:bg-purple-700" : "bg-white"}
              >
                <Code className="w-4 h-4" />
                {showEditor ? 'Hide' : 'Show'} n8n
              </Button>
            </div>
          </div>
          <CardDescription>
            Adjust zoom level and drag to pan around the workflow
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Content - Split Layout */}
      <div className={`grid gap-6 ${showEditor ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Workflow Diagram */}
        <Card className="bg-white border-2 border-gray-100 shadow-lg">
          <CardContent className="p-6">
            <div 
              ref={diagramRef}
              className="relative min-h-[300px] overflow-hidden cursor-grab select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              {/* Drag Instructions Overlay */}
              {!isDragging && panOffset.x === 0 && panOffset.y === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-2">
                    <Move className="w-5 h-5 text-gray-600" />
                    <span className="text-sm text-gray-600 font-medium">
                      Drag to pan • Scroll to zoom
                    </span>
                  </div>
                </div>
              )}

              {/* Workflow Nodes */}
              {workflow.nodes.map((node, index) => {
                const status = getNodeStatus(node.id, activeNode, completedNodes)
                const isActive = status === 'active'
                const isCompleted = status === 'completed'
                
                return (
                  <div
                    key={node.id}
                    className={`absolute cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                      isActive ? 'animate-pulse' : ''
                    }`}
                    style={{
                      left: `${(index * nodeSpacing) + 30}px`,
                      top: '100px',
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: 'center'
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNodeClick(node.id)
                    }}
                  >
                    {/* Node */}
                    <div className={`
                      relative ${getNodeSize()} rounded-xl border-3 shadow-lg transition-all duration-300
                      ${isActive ? 'border-yellow-400 shadow-yellow-200' : ''}
                      ${isCompleted ? 'border-green-400 shadow-green-200' : 'border-gray-200'}
                      ${!isActive && !isCompleted ? 'hover:border-blue-300' : ''}
                      bg-white
                    `}>
                      {/* Status Indicator */}
                      <div className="absolute -top-1 -right-1">
                        {isActive && (
                          <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                            <Clock className="w-2 h-2 text-white" />
                          </div>
                        )}
                        {isCompleted && (
                          <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-2 h-2 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Icon */}
                      <div className={`
                        ${getIconSize()} rounded-full flex items-center justify-center mx-auto mt-2
                        ${getNodeColor(node.type)} text-white
                      `}>
                        {getNodeIcon(node.type)}
                      </div>

                      {/* Node Name */}
                      <div className="text-center mt-1 px-1">
                        <p className={`${getTextSize()} font-medium text-gray-700 truncate`}>
                          {node.name}
                        </p>
                        <p className={`${getTextSize()} text-gray-500 truncate`}>
                          {node.type.split('.').pop()}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-xl overflow-hidden">
                          <div className="h-full bg-yellow-400 animate-pulse"></div>
                        </div>
                      )}
                    </div>

                    {/* Connection Arrow */}
                    {index < workflow.nodes.length - 1 && (
                      <div className="absolute top-12 left-24 w-12 h-0.5 bg-gray-300">
                        <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Start and End Labels */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16">
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  Start
                </div>
              </div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16">
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  End
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* n8n Workflow Editor */}
        {showEditor && (
          <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-purple-600" />
                  <CardTitle className="text-lg">n8n Workflow Editor</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={refreshN8nWorkflow}
                    size="sm"
                    variant="outline"
                    className="bg-white"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={copyN8nWorkflow}
                    disabled={!isValidJson}
                    size="sm"
                    variant="outline"
                    className="bg-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={saveN8nWorkflow}
                    disabled={!isValidJson}
                    size="sm"
                    variant="outline"
                    className="bg-white"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={downloadN8nWorkflow}
                    disabled={!isValidJson}
                    size="sm"
                    variant="outline"
                    className="bg-white"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>
                Edit the n8n workflow JSON directly. Changes are validated in real-time.
                {lastSaved && <span className="text-green-600 ml-2">Last saved: {lastSaved}</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* JSON Validation Status */}
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isValidJson ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-sm font-medium ${isValidJson ? 'text-green-700' : 'text-red-700'}`}>
                    {isValidJson ? 'Valid JSON' : 'Invalid JSON'}
                  </span>
                </div>

                {/* JSON Editor */}
                <div className="relative">
                  <Textarea
                    value={n8nWorkflow}
                    onChange={(e) => handleN8nWorkflowChange(e.target.value)}
                    className={`min-h-[400px] font-mono text-sm resize-none ${
                      isValidJson 
                        ? 'border-green-300 focus:border-green-500' 
                        : 'border-red-300 focus:border-red-500'
                    }`}
                    placeholder="n8n workflow JSON will appear here..."
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {n8nWorkflow.length} chars
                    </Badge>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>💡 Tip: Edit the JSON to customize your n8n workflow</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Node Details */}
      {showDetails && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Node Details</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const node = workflow.nodes.find(n => n.id === showDetails)
              if (!node) return null

              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${getNodeColor(node.type)} flex items-center justify-center text-white`}>
                      {getNodeIcon(node.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{node.name}</h3>
                      <p className="text-sm text-gray-600">{node.type}</p>
                    </div>
                  </div>
                  
                  {node.parameters && Object.keys(node.parameters).length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Parameters</h4>
                      <div className="bg-white rounded-lg p-3 border">
                        <pre className="text-xs text-gray-700 overflow-x-auto">
                          {JSON.stringify(node.parameters, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Workflow Stats */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Workflow Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{workflow.nodes.length}</div>
              <div className="text-sm text-gray-600">Total Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Object.keys(workflow.connections).length}</div>
              <div className="text-sm text-gray-600">Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{workflow.type}</div>
              <div className="text-sm text-gray-600">Type</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {completedNodes.length}/{totalSteps}
              </div>
              <div className="text-sm text-gray-600">Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
