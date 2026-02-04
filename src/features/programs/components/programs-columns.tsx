import { format as formatDate } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil } from 'lucide-react'
import { type ProgramResponse } from '@/lib/api/programs.api'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table'

export const programsColumns: ColumnDef<ProgramResponse>[] = [
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
            params={{ id: String(program.id) }}
            className='max-w-[500px] truncate p-2 font-medium hover:underline'
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
          <span className='max-w-[500px] truncate p-2 font-medium'>
            {row.getValue('description')}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'defaultModel.name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Default Model' />
    ),
    cell: ({ row }) => {
      const model = row.original.defaultModel?.name
      return (
        <div className='flex w-[150px] items-center p-2'>
          <span>{model || 'N/A'}</span>
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
    accessorFn: (row) => row.meals ?? 0,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Meals' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex w-[80px] items-center p-2'>
          <span>{row.original.meals || 0}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'earliestDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Earliest Date' />
    ),
    cell: ({ row }) => {
      const date = row.original.earliestDate

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
    accessorKey: 'latestDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Latest Date' />
    ),
    cell: ({ row }) => {
      const date = row.original.latestDate

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
