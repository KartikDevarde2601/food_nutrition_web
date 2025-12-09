import { Row } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Meal } from '../data/schema'

interface MealCardProps {
    row: Row<Meal>
    onClick?: () => void
    isLastSelected?: boolean
}

export function MealCard({ row, onClick, isLastSelected }: MealCardProps) {
    const meal = row.original

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Card
                        onClick={onClick}
                        className={cn(
                            "group relative h-28 overflow-hidden rounded-xl border-0 transition-all cursor-pointer p-0",
                            isLastSelected && "ring ring-primary ring-offset-2 scale-95"
                        )}
                    >
                        {/* Checkbox → top-right */}
                        <div
                            className="absolute right-2 top-2 z-20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Checkbox
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) => row.toggleSelected(!!value)}
                                aria-label="Select meal"
                                className="h-5 w-5 bg-background/90 backdrop-blur-sm data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                            />
                        </div>

                        {/* Image fills whole card */}
                        <div className="h-full w-full">
                            <img
                                src={meal.imageUrl}
                                alt={`Meal ${meal.mealId}`}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>

                        {/* Gradient overlay for better visibility if we add text later, but user didn't ask for text yet */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                    </Card>
                </TooltipTrigger>
                <TooltipContent className="p-3 text-xs bg-black/90 text-white border-0 z-50">
                    <div className="grid gap-1">
                        <div className="font-semibold">Meal {meal.mealId}</div>
                        <div className="grid grid-cols-[60px_1fr] gap-x-2">
                            <span className="text-gray-400">User ID:</span>
                            <span>{meal.userId}</span>

                            <span className="text-gray-400">Created:</span>
                            <span>{new Date(meal.createdAt).toLocaleDateString()}</span>

                            <span className="text-gray-400">Models:</span>
                            <span>
                                {meal.mealInferences?.map(i => i.model.name).join(', ') || 'N/A'}
                            </span>
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
