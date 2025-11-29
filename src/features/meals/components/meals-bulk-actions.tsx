import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2, Download } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type Meal } from '../data/schema'
import { MealsMultiDeleteDialog } from './meals-multi-delete-dialog'

type MealsBulkActionsProps<TData> = {
  table: Table<TData>
}

export function MealsBulkActions<TData extends Meal>({
  table,
}: MealsBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkExport = () => {
    const selectedMeals = selectedRows.map((row) => row.original as Meal)
    toast.promise(sleep(2000), {
      loading: 'Exporting meals...',
      success: () => {
        table.resetRowSelection()
        return `Exported ${selectedMeals.length} meal${selectedMeals.length > 1 ? 's' : ''} to CSV.`
      },
      error: 'Error',
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='meal'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkExport()}
              className='size-8'
              aria-label='Export meals'
              title='Export meals'
            >
              <Download />
              <span className='sr-only'>Export meals</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export meals</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected meals'
              title='Delete selected meals'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected meals</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected meals</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <MealsMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
