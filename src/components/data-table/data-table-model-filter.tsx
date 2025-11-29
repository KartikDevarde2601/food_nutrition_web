import * as React from 'react'
import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { type Column } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useModelsQuery } from '@/hooks/programs/use-models-query'

type FilterOperator = 'hasAnyOf' | 'hasNoneOf' | 'isEmpty' | 'isNotEmpty'

type DataTableModelFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>
  title?: string
}

const FILTER_OPERATORS = [
  { value: 'hasAnyOf', label: 'Has any of' },
  { value: 'hasNoneOf', label: 'Has none of' },
  { value: 'isEmpty', label: 'Is empty' },
  { value: 'isNotEmpty', label: 'Is not empty' },
] as const

export function DataTableModelFilter<TData, TValue>({
  column,
  title = 'Models',
}: DataTableModelFilterProps<TData, TValue>) {
  const [operator, setOperator] = React.useState<FilterOperator>('hasAnyOf')
  const [selectedModels, setSelectedModels] = React.useState<Set<string>>(new Set())
  const { data: models = [], isLoading } = useModelsQuery()

  const showModelSelect = operator === 'hasAnyOf' || operator === 'hasNoneOf'
  const isFilterActive =
    (showModelSelect && selectedModels.size > 0) ||
    operator === 'isEmpty' ||
    operator === 'isNotEmpty'

  const handleClearFilter = () => {
    setOperator('hasAnyOf')
    setSelectedModels(new Set())
    column?.setFilterValue(undefined)
  }

  // Update column filter when operator or models change
  React.useEffect(() => {
    if (operator === 'isEmpty' || operator === 'isNotEmpty') {
      column?.setFilterValue({ operator })
    } else if (selectedModels.size > 0) {
      column?.setFilterValue({ operator, modelIds: Array.from(selectedModels) })
    } else {
      column?.setFilterValue(undefined)
    }
  }, [operator, selectedModels, column])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn(
            'h-8 border-dashed',
            isFilterActive && 'border-solid bg-accent'
          )}
        >
          <PlusCircledIcon className='size-4' />
          {title}
          {isFilterActive && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              {showModelSelect && selectedModels.size > 0 ? (
                <>
                  <Badge
                    variant='secondary'
                    className='rounded-sm px-1 font-normal lg:hidden'
                  >
                    {selectedModels.size}
                  </Badge>
                  <div className='hidden space-x-1 lg:flex'>
                    {selectedModels.size > 2 ? (
                      <Badge
                        variant='secondary'
                        className='rounded-sm px-1 font-normal'
                      >
                        {selectedModels.size} selected
                      </Badge>
                    ) : (
                      models
                        .filter((model) => selectedModels.has(model.model_id))
                        .map((model) => (
                          <div key={model.model_id} className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="rounded-sm px-1 font-normal"
                            >
                              {model.name}
                            </Badge>

                            <Separator orientation="vertical" className="h-4" />
                          </div>
                        ))
                    )}
                  </div>
                </>
              ) : (
                <Badge
                  variant='secondary'
                  className='rounded-sm px-1 font-normal'
                >
                  {FILTER_OPERATORS.find((op) => op.value === operator)?.label}
                </Badge>
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[280px] p-4' align='start'>
        <div className='space-y-4'>
          {/* Filter Operator Dropdown */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Filter type</label>
            <Select
              value={operator}
              onValueChange={(value) => setOperator(value as FilterOperator)}
            >
              <SelectTrigger className='h-9'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FILTER_OPERATORS.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Selection Dropdown */}
          {showModelSelect && (
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Select models</label>
              <Command className='border rounded-md'>
                <CommandInput placeholder='Search models...' />
                <CommandList>
                  {isLoading ? (
                    <CommandEmpty>Loading models...</CommandEmpty>
                  ) : models.length === 0 ? (
                    <CommandEmpty>No models found.</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {models.map((model) => {
                        const isSelected = selectedModels.has(model.model_id)
                        return (
                          <CommandItem
                            key={model.model_id}
                            onSelect={() => {
                              const newSelected = new Set(selectedModels)
                              if (isSelected) {
                                newSelected.delete(model.model_id)
                              } else {
                                newSelected.add(model.model_id)
                              }
                              setSelectedModels(newSelected)
                            }}
                          >
                            <div
                              className={cn(
                                'border-primary flex size-4 items-center justify-center rounded-sm border',
                                isSelected
                                  ? 'bg-primary text-primary-foreground'
                                  : 'opacity-50 [&_svg]:invisible'
                              )}
                            >
                              <CheckIcon className={cn('text-background h-4 w-4')} />
                            </div>
                            <span>{model.name}</span>
                          </CommandItem>
                        )
                      })}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </div>
          )}

          {/* Clear Filter Button */}
          {isFilterActive && (
            <Button
              variant='outline'
              size='sm'
              onClick={handleClearFilter}
              className='w-full'
            >
              Clear filter
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
