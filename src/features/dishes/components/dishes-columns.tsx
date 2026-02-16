import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Dish } from '../data/schema'

export const dishesColumns: ColumnDef<Dish>[] = [
  {
    accessorKey: 'image_url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Dish Image' />
    ),
    cell: ({ row }) => (
      <img
        src={row.getValue('image_url')}
        alt={row.getValue('dish_name')}
        className='h-15 w-15 rounded-md object-cover'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'dish_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Dish Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <div className='max-w-[500px] truncate p-2 font-medium hover:underline'>
            {row.getValue('dish_name')}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate p-2 font-medium'>
            {row.getValue('description')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'carbs_g',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Carbs (g)' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex w-[100px] items-center p-2'>
          <span>{row.getValue('carbs_g')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'protein_g',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Protein (g)' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex w-[100px] items-center p-2'>
          <span>{row.getValue('protein_g')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'fat_g',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fat (g)' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex w-[100px] items-center p-2'>
          <span>{row.getValue('fat_g')}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: () => <div className='text-center'>Actions</div>,
    cell: ({ row }) => {
      const dish = row.original

      return (
        <div className='flex items-center justify-center gap-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='text-destructive hover:text-destructive h-8 w-8'
                onClick={() => {
                  const event = new CustomEvent('edit-dish', {
                    detail: dish,
                  })
                  window.dispatchEvent(event)
                }}
              >
                <Pencil className='text-primary h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit dish</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='text-destructive hover:text-destructive h-8 w-8'
                onClick={(e) => {
                  const event = new CustomEvent('delete-dish', {
                    detail: dish,
                  })

                  window.dispatchEvent(event)
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete dish</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]
