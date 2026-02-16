import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import { type ModelDto } from '@/lib/api/models.api'
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
import { Separator } from '@/components/ui/separator'

type ModelSelectorProps = {
  title?: string
  models: ModelDto[]
  selectedModels: string[] // Controlled by parent
  onSelectionChange: (selectedIds: string[]) => void
  isLoading?: boolean
}

export function ModelSelectorMealDialog({
  title = 'Select Models',
  models,
  selectedModels = [],
  onSelectionChange,
  isLoading = false,
}: ModelSelectorProps) {
  const handleSelect = (modelId: string) => {
    const isAlreadySelected = selectedModels.includes(modelId)

    // 1. If user clicks a model already selected, do nothing
    if (isAlreadySelected) return

    // 2. Logic for updating/replacing
    if (selectedModels.length < 2) {
      // If 0 or 1 selected, just add the new one
      onSelectionChange([...selectedModels, modelId])
    } else {
      // If 2 are already selected, replace the second one with the new selection
      // This allows the user to "click again update again"
      const [first] = selectedModels
      onSelectionChange([first, modelId])
    }
  }

  const handleClear = () => {
    onSelectionChange([])
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='lg'
          className={cn(
            'h-8 border-dashed p-4',
            selectedModels.length > 0 && 'bg-accent border-solid'
          )}
        >
          <PlusCircledIcon className='mr-2 size-4' />
          {title}

          {selectedModels.length > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <div className='flex space-x-1'>
                {/* We map over selectedModels array directly to maintain
                   the order in which they were selected
                */}
                {selectedModels.map((id) => {
                  const model = models.find((m) => m.model_id.toString() === id)
                  if (!model) return null
                  return (
                    <Badge
                      key={id}
                      variant='secondary'
                      className='rounded-sm px-1 font-normal'
                    >
                      {model.name}
                    </Badge>
                  )
                })}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-[250px] p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search models...' />
          <CommandList>
            {isLoading ? (
              <div className='p-4 text-center text-sm'>Loading models...</div>
            ) : (
              <>
                <CommandEmpty>No models found.</CommandEmpty>
                <CommandGroup>
                  {models.map((model) => {
                    const id = model.model_id.toString()
                    const isSelected = selectedModels.includes(id)

                    return (
                      <CommandItem
                        key={id}
                        onSelect={() => handleSelect(id)}
                        className='cursor-pointer'
                      >
                        <div
                          className={cn(
                            'border-primary mr-2 flex size-4 items-center justify-center rounded-sm border',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50'
                          )}
                        >
                          {isSelected && <CheckIcon className='size-4' />}
                        </div>
                        <span>{model.name}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </>
            )}
          </CommandList>

          {selectedModels.length > 0 && (
            <>
              <Separator />
              <div className='p-1'>
                <Button
                  variant='ghost'
                  className='w-full justify-center font-normal'
                  onClick={handleClear}
                >
                  Clear selection
                </Button>
              </div>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
