// Suggested Questions Component
import { Sparkles, Search, GitCompare, Eye } from 'lucide-react'
import type { SuggestedQuestion } from '@/lib/botcici-types'

interface SuggestedQuestionsProps {
  questions?: SuggestedQuestion[]
  onSelect: (question: string) => void
  disabled?: boolean
}

const DEFAULT_QUESTIONS: SuggestedQuestion[] = [
  { text: "Find silk villages in Northern Vietnam", category: "explore" },
  { text: "Show me eco-friendly craft villages", category: "explore" },
  { text: "What villages work with bamboo?", category: "explore" },
  { text: "Tell me about Van Phuc Silk Village", category: "details" },
  { text: "Compare lacquerware villages", category: "compare" },
]

const getCategoryIcon = (category: SuggestedQuestion['category']) => {
  switch (category) {
    case 'explore':
      return <Search className="h-3.5 w-3.5" />
    case 'compare':
      return <GitCompare className="h-3.5 w-3.5" />
    case 'details':
      return <Eye className="h-3.5 w-3.5" />
    default:
      return <Sparkles className="h-3.5 w-3.5" />
  }
}

const getCategoryColor = (category: SuggestedQuestion['category']) => {
  switch (category) {
    case 'explore':
      return 'hover:border-blue-500 hover:bg-blue-50 hover:text-blue-900'
    case 'compare':
      return 'hover:border-purple-500 hover:bg-purple-50 hover:text-purple-900'
    case 'details':
      return 'hover:border-green-500 hover:bg-green-50 hover:text-green-900'
    default:
      return 'hover:border-[#B91C1C] hover:bg-red-50 hover:text-gray-900'
  }
}

export default function SuggestedQuestions({ 
  questions = DEFAULT_QUESTIONS, 
  onSelect, 
  disabled = false 
}: SuggestedQuestionsProps) {
  // Show up to 5 questions
  const displayQuestions = questions.slice(0, 5)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-3">
        <Sparkles className="h-4 w-4 text-[#B91C1C]" />
        <span className="font-medium">Try asking:</span>
      </div>
      
      <div className="flex flex-col gap-2">
        {displayQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelect(question.text)}
            disabled={disabled}
            className={`text-left px-4 py-2.5 rounded-lg border border-gray-200 transition-colors text-sm text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${getCategoryColor(question.category)}`}
          >
            {getCategoryIcon(question.category)}
            <span className="flex-1">{question.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
