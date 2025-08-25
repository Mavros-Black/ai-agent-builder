'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Sparkles, Clock, Target, BookOpen, Zap } from 'lucide-react'
import { SamplePrompt, getPromptsByType } from '@/lib/sample-prompts'

interface PromptPickerProps {
  agentType: string
  onSelectPrompt: (prompt: string) => void
  className?: string
}

export function PromptPicker({ agentType, onSelectPrompt, className }: PromptPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [selectedPrompt, setSelectedPrompt] = useState<SamplePrompt | null>(null)

  const prompts = useMemo(() => getPromptsByType(agentType), [agentType])

  // Debug logging
  console.log('PromptPicker Debug:', { agentType, promptsCount: prompts.length, prompts })

  const filteredPrompts = useMemo(() => {
    return prompts.filter(prompt => {
      const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesDifficulty = difficultyFilter === 'all' || prompt.difficulty === difficultyFilter
      
      return matchesSearch && matchesDifficulty
    })
  }, [prompts, searchQuery, difficultyFilter])

  const handlePromptSelect = (prompt: SamplePrompt) => {
    setSelectedPrompt(prompt)
    onSelectPrompt(prompt.prompt)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <Sparkles className="w-3 h-3" />
      case 'intermediate': return <Clock className="w-3 h-3" />
      case 'advanced': return <Zap className="w-3 h-3" />
      default: return <BookOpen className="w-3 h-3" />
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Sample Prompts</h3>
          <p className="text-sm text-gray-600">Choose from {prompts.length} pre-written prompts or search for specific use cases</p>
        </div>
        <Badge variant="outline" className="text-xs">
          {filteredPrompts.length} of {prompts.length}
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search prompts by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Selected Prompt Preview */}
      {selectedPrompt && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-blue-900">Selected Prompt</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPrompt(null)}
                className="text-blue-600 hover:text-blue-800"
              >
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getDifficultyColor(selectedPrompt.difficulty)}`}>
                  {getDifficultyIcon(selectedPrompt.difficulty)}
                  {selectedPrompt.difficulty}
                </Badge>
                <span className="text-sm font-medium text-blue-900">{selectedPrompt.title}</span>
              </div>
              <p className="text-sm text-blue-800">{selectedPrompt.description}</p>
              <div className="flex flex-wrap gap-1">
                {selectedPrompt.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs bg-blue-100 border-blue-300 text-blue-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredPrompts.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-500">
            <p>No prompts found for agent type: {agentType}</p>
            <p className="text-sm">Available types: personal-assistant, study-research, business-productivity, information-research</p>
          </div>
        ) : (
          filteredPrompts.map((prompt) => (
          <HoverCard key={prompt.id}>
            <HoverCardTrigger asChild>
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] ${
                  selectedPrompt?.id === prompt.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handlePromptSelect(prompt)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium text-gray-900 line-clamp-2">
                        {prompt.title}
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {prompt.description}
                      </CardDescription>
                    </div>
                    <Badge className={`ml-2 text-xs ${getDifficultyColor(prompt.difficulty)}`}>
                      {getDifficultyIcon(prompt.difficulty)}
                      {prompt.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {prompt.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {prompt.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{prompt.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Target className="w-3 h-3" />
                    <span className="line-clamp-1">{prompt.useCase}</span>
                  </div>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{prompt.title}</h4>
                  <p className="text-sm text-gray-700 mt-1">{prompt.description}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 text-sm">Use Case:</h5>
                  <p className="text-sm text-gray-600 mt-1">{prompt.useCase}</p>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 text-sm">Tags:</h5>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {prompt.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <Button 
                    size="sm" 
                    onClick={() => handlePromptSelect(prompt)}
                    className="w-full"
                  >
                    Use This Prompt
                  </Button>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))
        )}
      </div>

      {/* Empty State */}
      {filteredPrompts.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or difficulty filter
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('')
                setDifficultyFilter('all')
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-xs text-gray-500">
          💡 Tip: Hover over prompts to see full details and use cases
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setSearchQuery('')
              setDifficultyFilter('all')
              setSelectedPrompt(null)
            }}
          >
            Reset
          </Button>
          {selectedPrompt && (
            <Button 
              size="sm"
              onClick={() => onSelectPrompt(selectedPrompt.prompt)}
            >
              Apply Selected Prompt
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
