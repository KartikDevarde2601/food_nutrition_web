import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Program } from '../data/schema'

export const programsColumns: ColumnDef<Program>[] = [
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
            className='max-w-[500px] truncate font-medium hover:underline'
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
          <span className='max-w-[500px] truncate font-medium'>
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
        <div className='flex w-[150px] items-center'>
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
        <div className='flex w-[80px] items-center'>
          <span>{row.getValue('dishes') || 0}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'meals',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Meals' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex w-[80px] items-center'>
          <span>{row.getValue('meals') || 0}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'earliestDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Start Date' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('earliestDate')
      return (
        <div className='flex w-[120px] items-center'>
          <span>
            {date ? format(new Date(date as string), 'MMM dd, yyyy') : 'N/A'}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'latestDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='End Date' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('latestDate')
      return (
        <div className='flex w-[120px] items-center'>
          <span>
            {date ? format(new Date(date as string), 'MMM dd, yyyy') : 'N/A'}
          </span>
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
                <Button variant='ghost' size='icon' className='h-8 w-8' asChild>
                  <Link
                    to='/programs/$id'
                    params={{ id: String(program.program_id) }}
                  >
                    <Eye className='h-4 w-4' />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive hover:text-destructive h-8 w-8'
                  onClick={() => {
                    // This will be handled by the ProgramsProvider context
                    const event = new CustomEvent('delete-program', {
                      detail: program,
                    })
                    window.dispatchEvent(event)
                  }}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete program</p>
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
