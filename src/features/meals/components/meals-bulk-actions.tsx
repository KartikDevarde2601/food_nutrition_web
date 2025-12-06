import { useState, useMemo } from 'react'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Play, ArrowDown01 } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type Meal } from '../data/schema'
import { MealsRunModelsDialog } from './meals-run-models-dialog'
import { useNavigate } from '@tanstack/react-router'
import { useProgramQuery } from '@/hooks/programs'



type MealsBulkActionsProps<TData> = {
  table: Table<TData>
  program_id: number
}

export function MealsBulkActions<TData extends Meal>({
  table,
  program_id
}: MealsBulkActionsProps<TData>) {
  const navigate = useNavigate()
  const [showRunModelsDialog, setShowRunModelsDialog] = useState(false)

  // Memoize selected meal IDs - only recalculates when table selection changes
  const selectedMealIds = useMemo(
    () => table.getFilteredSelectedRowModel().rows.map(({ original }) => original.mealId),
    [table.getState().rowSelection]
  )

  const { data: program, isLoading } = useProgramQuery(program_id)

  if (isLoading) return (
    <div className='flex items-center justify-center h-full'>
      <div>Loading</div>
    </div>
  )

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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => navigate({
                to: '/performance',
                search: {
                  model_one: program?.default_model_id,
                  model_two: program?.default_model_id === 2 ? 1 : 2,
                  program_id: program_id,
                  meal_ids: selectedMealIds
                }
              })}
              className='size-8'
              aria-label='Run performance metrics on selected meals'
              title='Run performance metrics on selected meals'
            >
              <ArrowDown01 />
              <span className='sr-only'>Run performance metrics on selected meals</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Run performance metrics on selected meals</p>
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
