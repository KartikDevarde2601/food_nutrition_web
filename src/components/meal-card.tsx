import { memo, useState } from 'react'
import { type Row } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { type Meal } from '@/features/meals/data/schema'
import { LazyTooltip } from './lazy-tooltip'

interface MealCardProps {
  row: Row<Meal>
  onClick?: () => void
  isLastSelected?: boolean
  enableCheckbox?: boolean
  isMatched?: boolean
}

export const MealCard = memo(function MealCard({
  row,
  onClick,
  isLastSelected,
  enableCheckbox,
  isMatched = false,
}: MealCardProps) {
  const meal = row.original
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <LazyTooltip
      content={
        <div className='grid gap-1'>
          <div className='font-semibold'>Meal {meal.mealId}</div>
          <div className='grid grid-cols-[60px_1fr] gap-x-2'>
            <span className='text-gray-400'>User ID:</span>
            <span>{meal.userId}</span>

            <span className='text-gray-400'>Created:</span>
            <span>{new Date(meal.createdAt).toLocaleDateString()}</span>

            <span className='text-gray-400'>Models:</span>
            <span>
              {meal.mealInferences?.map((i) => i.model.name).join(', ') ||
                'N/A'}
            </span>
          </div>
        </div>
      }
    >
      <Card
        onClick={onClick}
        className={cn(
          'group relative h-28 cursor-pointer overflow-hidden rounded-xl border-0 p-0 transition-all',
          isLastSelected && 'ring-primary scale-95 ring ring-offset-2',
          !isMatched && 'ring-red-500 scale-95 ring ring-offset-2'
        )}
      >
        {/* Checkbox → top-right */}
        {enableCheckbox && (
          <div
            className='absolute top-2 right-2 z-20'
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label='Select meal'
            />
          </div>
        )}

        {/* Image fills whole card */}
        <div className='relative h-full w-full'>
          {/* Placeholder - shows while loading */}
          {!imageLoaded && !imageError && (
            <div className='absolute inset-0 animate-pulse bg-gray-200' />
          )}

          {/* Error state */}
          {imageError && (
            <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
              <span className='text-sm text-gray-400'>Failed to load</span>
            </div>
          )}

          {/* Actual image */}
          {!imageError && (
            <img
              src={meal.imageUrl}
              alt={`Meal ${meal.mealId}`}
              className={cn(
                'h-full w-full object-cover transition-all duration-300 group-hover:scale-105',
                !imageLoaded && 'opacity-0'
              )}
              loading='lazy'
              onLoad={() => {
                setImageLoaded(true)
                setImageError(false)
              }}
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Gradient overlay for better visibility if we add text later, but user didn't ask for text yet */}
        <div className='pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10' />
      </Card>
    </LazyTooltip>
  )
})
