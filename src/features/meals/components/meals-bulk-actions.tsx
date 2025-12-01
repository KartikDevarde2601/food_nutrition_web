import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type Meal } from '../data/schema'
import { MealsRunModelsDialog } from './meals-run-models-dialog'

type MealsBulkActionsProps<TData> = {
  table: Table<TData>
}

export function MealsBulkActions<TData extends Meal>({
  table,
}: MealsBulkActionsProps<TData>) {
  const [showRunModelsDialog, setShowRunModelsDialog] = useState(false)

  return (
    <>
      <BulkActionsToolbar table={table} entityName='meal'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setShowRunModelsDialog(true)}
              className='size-8'
              aria-label='Run models on selected meals'
              title='Run models on selected meals'
            >
              <Play />
              <span className='sr-only'>Run models on selected meals</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Run models on selected meals</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <MealsRunModelsDialog
        open={showRunModelsDialog}
        onOpenChange={setShowRunModelsDialog}
        table={table}
      />
    </>
  )
}
