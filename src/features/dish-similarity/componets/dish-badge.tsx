
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Dish } from '../data/schema'
import { useDeleteDishSimilarityMutation } from '@/hooks/dish-similarity/use-dishsimilarity-mutations'

type DishBadgeProps = {
  dish: Dish
  parentdishId:number
}

export function DishBadge({ dish, parentdishId }: DishBadgeProps) {
   const deleteMutation = useDeleteDishSimilarityMutation()

  const handleRemove = (dishToRemove: Dish,parentDishId:number) => {
  const dishIdPair = {
    dishID_1: parentDishId,
    dishID_2: dishToRemove.dish_id,
  }
  const pair = {
    pairs: [dishIdPair]
  }

  deleteMutation.mutate(pair)
  }

  return (
    <Badge
      variant='secondary'
      className='hover:bg-secondary/80 flex items-center gap-1 pr-1'
    >
      <span>{dish.dish_name}</span>
      <X
        className='text-muted-foreground !pointer-events-auto h-3 w-3 cursor-pointer transition hover:text-red-500'
        onClick={(e) => {
          e.stopPropagation()
          handleRemove(dish, parentdishId)
        }}
      />
    </Badge>
  )
}