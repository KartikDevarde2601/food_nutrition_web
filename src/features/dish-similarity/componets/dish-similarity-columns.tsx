import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { TransformedDish } from '../data/schema'
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
          {dishData.dish_name}
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
        <div className='flex flex-wrap gap-2 p-2'>
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
]
