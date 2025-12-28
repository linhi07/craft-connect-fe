// Village Recommendation Card Component
import { MapPin, Star, TrendingUp, Eye, GitCompare, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { VillageRecommendation } from '@/lib/botcici-types'

interface RecommendationCardProps {
  recommendation: VillageRecommendation
  onViewDetails: (villageId: number) => void
  onCompare?: (villageId: number) => void
  onChat?: (villageId: number) => void
  disabled?: boolean
}

export default function RecommendationCard({
  recommendation,
  onViewDetails,
  onCompare,
  onChat,
  disabled = false
}: RecommendationCardProps) {
  const {
    village_id,
    village_name,
    location,
    match_score,
    reasons,
    suggested_actions,
    thumbnail_url
  } = recommendation

  // Determine if actions are available
  const canViewDetails = suggested_actions?.includes('view_details')
  const canCompare = suggested_actions?.includes('compare')
  const canChat = suggested_actions?.includes('continue_chat')

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
      {/* Header with image/name */}
      <div className="relative h-32 bg-gradient-to-br from-red-50 to-orange-50">
        {thumbnail_url ? (
          <img 
            src={thumbnail_url} 
            alt={village_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🏘️</span>
          </div>
        )}
        
        {/* Match Score Badge */}
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-gray-900">
              {(match_score * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Village Name & Location */}
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
            {village_name}
          </h3>
          {location && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
        </div>

        {/* Reasons (Top 3) */}
        {reasons && reasons.length > 0 && (
          <div className="space-y-2 mb-4">
            {reasons.slice(0, 3).map((reason, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-2 text-xs"
              >
                <TrendingUp className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-medium text-gray-700 capitalize">
                      {reason.factor.replace('_', ' ')}
                    </span>
                    {reason.score !== undefined && (
                      <span className="text-gray-500 text-xs">
                        +{(reason.score * 100).toFixed(0)}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 line-clamp-2">
                    {reason.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          {canViewDetails && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(village_id)}
              disabled={disabled}
              className="flex-1 gap-1.5 text-xs h-8"
            >
              <Eye className="h-3.5 w-3.5" />
              View Details
            </Button>
          )}
          
          {canCompare && onCompare && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCompare(village_id)}
              disabled={disabled}
              className="gap-1.5 text-xs h-8"
            >
              <GitCompare className="h-3.5 w-3.5" />
              Compare
            </Button>
          )}
          
          {canChat && onChat && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onChat(village_id)}
              disabled={disabled}
              className="gap-1.5 text-xs h-8"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Chat
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
