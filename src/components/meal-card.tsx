import { Row } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Meal } from '@/features/meals/data/schema'

interface MealCardProps {
  row: Row<Meal>
  onClick?: () => void
  isLastSelected?: boolean
  enableCheckbox?: boolean
}

export function MealCard({
  row,
  onClick,
  isLastSelected,
  enableCheckbox,
}: MealCardProps) {
  const meal = row.original

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Card
          onClick={onClick}
          className={cn(
            'group relative h-28 cursor-pointer overflow-hidden rounded-xl border-0 p-0 transition-all',
            isLastSelected && 'ring-primary scale-95 ring ring-offset-2'
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
                className='bg-background/90 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5 backdrop-blur-sm'
              />
            </div>
          )}

          {/* Image fills whole card */}
          <div className='h-full w-full'>
            <img
              src={meal.imageUrl}
              alt={`Meal ${meal.mealId}`}
              className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
              loading='lazy'
            />
          </div>

          {/* Gradient overlay for better visibility if we add text later, but user didn't ask for text yet */}
          <div className='pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10' />
        </Card>
      </TooltipTrigger>
      <TooltipContent className='z-50 border-0 bg-black/90 p-3 text-xs text-white'>
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
      </TooltipContent>
    </Tooltip>
  )
}
