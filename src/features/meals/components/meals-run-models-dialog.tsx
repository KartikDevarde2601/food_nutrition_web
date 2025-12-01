'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { ChevronsUpDown, Info } from 'lucide-react'
import { toast } from 'sonner'
import { useModelsQuery } from '@/hooks/programs/use-models-query'
import { Checkbox } from '@/components/ui/checkbox'
import { mealsApi } from '@/lib/api/meal.api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Meal } from '../data/schema'

type MealsRunModelsDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function MealsRunModelsDialog<TData extends Meal>({
  open,
  onOpenChange,
  table,
}: MealsRunModelsDialogProps<TData>) {
  const [selectedModels, setSelectedModels] = useState<number[]>([])
  const [openCombobox, setOpenCombobox] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  const { data: models = [] } = useModelsQuery()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleRunModels = async () => {
    if (selectedModels.length === 0) {
      toast.error('Please select at least one model.')
      return
    }

    setIsRunning(true)
    try {
      const mealIds = selectedRows.map((row) => row.original.mealId)
      await mealsApi.runModels(mealIds, selectedModels)

      toast.success('Models started successfully. This may take a while.')
      onOpenChange(false)
      table.resetRowSelection()
      setSelectedModels([])
    } catch (error) {
      console.error('Failed to run models:', error)
      toast.error('Failed to start models.')
    } finally {
      setIsRunning(false)
    }
  }

  const toggleModel = (modelId: number) => {
    setSelectedModels((current) =>
      current.includes(modelId)
        ? current.filter((id) => id !== modelId)
        : [...current, modelId]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Run Models</DialogTitle>
          <DialogDescription>
            Run machine learning models on {selectedRows.length} selected{' '}
            {selectedRows.length === 1 ? 'meal' : 'meals'}.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-2'>
            <span className='text-sm font-medium'>Select Models</span>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={openCombobox}
                  className='justify-between'
                >
                  {selectedModels.length > 0
                    ? `${selectedModels.length} model${selectedModels.length > 1 ? 's' : ''
                    } selected`
                    : 'Select models...'}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[460px] p-0'>
                <Command>
                  <CommandInput placeholder='Search models...' />
                  <CommandList>
                    <CommandEmpty>No model found.</CommandEmpty>
                    <CommandGroup>
                      {models.map((model) => (
                        <CommandItem
                          key={model.model_id}
                          value={model.name}
                          onSelect={() => toggleModel(Number(model.model_id))}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            checked={selectedModels.includes(Number(model.model_id))}
                            className="translate-y-[2px]"
                          />

                          <span>{model.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {selectedModels.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {selectedModels.map((id) => {
                const model = models.find((m) => Number(m.model_id) === id)
                return model ? (
                  <Badge key={id} variant='secondary'>
                    {model.name}
                  </Badge>
                ) : null
              })}
            </div>
          )}

          <Alert>
            <Info className='h-4 w-4' />
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>
              It takes around 10 min to get all the meal nutrition. You can
              close the window after clicking.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isRunning}
          >
            Cancel
          </Button>
          <Button onClick={handleRunModels} disabled={isRunning || selectedModels.length === 0}>
            {isRunning ? 'Starting...' : 'Run Models'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
