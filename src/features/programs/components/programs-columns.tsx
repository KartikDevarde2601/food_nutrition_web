import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { format as formatDate } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table'
import { type ProgramDetail } from '../data/schema'

export const programsColumns: ColumnDef<ProgramDetail>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Program Name' />
    ),
    cell: ({ row }) => {
      const program = row.original
      return (
        <div className='flex space-x-2'>
          <Link
            to='/programs/$id'
            params={{ id: String(program.program_id) }}
            className='max-w-[500px] truncate font-medium hover:underline p-2'
          >
            {row.getValue('name')}
          </Link>
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
          <span className='max-w-[500px] truncate font-medium p-2'>
            {row.getValue('description')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'default_model',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Default Model' />
    ),
    cell: ({ row }) => {
      const model = row.original.default_model
      return (
        <div className='flex w-[150px] items-center p-2'>
          <span>{model?.name || 'N/A'}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'dishes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Dishes' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex w-[80px] items-center p-2'>
          <span>{row.getValue('dishes') || 0}</span>
        </div>
      )
    },
  },
  {
    id: 'meals',
    accessorFn: (row) => row._count?.meals ?? 0,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Meals' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex w-[80px] items-center p-2'>
          <span>{row.original._count?.meals || 0}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'last_created_meal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Earliest Date' />
    ),
    cell: ({ row }) => {
      const date = row.original.last_created_meal

      if (!date) {
        return <div className='flex w-[150px] items-center p-2'>N/A</div>
      }

      return (
        <div className='flex w-[150px] items-center p-2'>
          <span>{formatDate(date, 'PPP')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'last_updated_meal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Latest Date' />
    ),
    cell: ({ row }) => {
      const date = row.original.last_updated_meal

      if (!date) {
        return <div className='flex w-[150px] items-center p-2'>N/A</div>
      }

      return (
        <div className='flex w-[150px] items-center p-2'>
          <span>{formatDate(date, 'PPP')}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    header: () => <div className='text-center'>Actions</div>,
    cell: ({ row }) => {
      const program = row.original

      return (
        <div className='flex items-center justify-center gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => {
                    // This will be handled by the ProgramsProvider context
                    const event = new CustomEvent('edit-program', {
                      detail: program,
                    })
                    window.dispatchEvent(event)
                  }}
                >
                  <Pencil className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit program</p>
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
