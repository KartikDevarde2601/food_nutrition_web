import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Trash2} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table'
import {  TransformedDish } from '../data/schema'
import { DishBadge } from './dish-badge'


export const dishColumns: ColumnDef<TransformedDish>[] = [
  // Column 1: Dish Name
  {
    accessorKey: 'dish_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Dish Name' />
    ),
    cell: ({ row }) => {
      const dishData = row.original
      return (
        <div className='flex space-x-2'>
          <Link
            to='/dishes/$id'
            params={{ id: String(dishData.dish_id) }}
            className='max-w-[200px] truncate font-medium hover:underline'
          >
            {dishData.dish_name}
          </Link>
        </div>
      )
    },
  },

  // Column 2: Similar Dishes (Badges)
  {
    accessorKey: 'similarDishes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Similar Dishes' />
    ),
    cell: ({ row }) => {
      const parentDishId = row.original.dish_id
      const similarDishes = row.original.similarDishes || []

      return (
        <div className='flex flex-wrap gap-2'>
          {similarDishes.length > 0 ? (
            similarDishes.map((sDish) => (
              <DishBadge
                key={sDish.dish_id}
                dish={sDish}
                parentdishId={parentDishId}
              />
            ))
          ) : (
            <span className='text-muted-foreground text-sm'>None</span>
          )}
        </div>
      )
    },
  },

  // Column 3: Actions (Delete the Main Dish Row)
  {
    id: 'actions',
    header: () => <div className='text-center'>Actions</div>,
    cell: ({ row }) => {
      const data = row.original

      return (
        <div className='flex items-center justify-center gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8'
                  onClick={() => {
                    // Dispatch event to delete the entire row (main dish)
                    const event = new CustomEvent('delete-similarity', {
                      detail: data,
                    })
                    window.dispatchEvent(event)
                  }}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete entire dish</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]
