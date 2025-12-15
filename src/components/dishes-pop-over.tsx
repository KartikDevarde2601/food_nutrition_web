import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandItem,
} from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'

type Dish = {
    dish_id: number
    dish_name: string
}


type DishPopoverProps = {
    dishes: Dish[]
    selectedValue?: number | number[]
    onSelect: (dishId: number) => void
    placeholder: string
    buttonText: string
    emptyText?: string
    isMultiSelect?: boolean
    isLoading?: boolean
    enableSearch?: boolean
    searchValue?: string
    onSearchChange?: (value: string) => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}



export function DishPopover({
    dishes,
    selectedValue,
    onSelect,
    placeholder,
    buttonText,
    emptyText = 'No dish found.',
    isMultiSelect = false,
    isLoading = false,
    enableSearch = false,
    searchValue,
    onSearchChange,
    open,
    onOpenChange,
}: DishPopoverProps) {
    const isSelected = (dishId: number) => {
        if (isMultiSelect && Array.isArray(selectedValue)) {
            return selectedValue.includes(dishId)
        }
        return selectedValue === dishId
    }

    const getDisplayValue = () => {
        if (isMultiSelect) return buttonText
        if (selectedValue && !Array.isArray(selectedValue)) {
            const dish = dishes.find((d) => d.dish_id === selectedValue)
            return dish?.dish_name || buttonText
        }
        return buttonText
    }

    const popoverProps = onOpenChange ? { open, onOpenChange } : {}

    return (
        <Popover {...popoverProps}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    role='combobox'
                    aria-expanded={open}
                    className={cn(
                        'w-full justify-between',
                        !selectedValue && 'text-muted-foreground'
                    )}
                >
                    {getDisplayValue()}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className='w-[--radix-popover-trigger-width] p-0'
                align='start'
                onWheel={(e) => {
                    e.stopPropagation()
                }}
                onTouchMove={(e) => {
                    e.stopPropagation()
                }}
            >
                <Command shouldFilter={!enableSearch}>
                    <CommandInput
                        placeholder={placeholder}
                        value={enableSearch ? searchValue : undefined}
                        onValueChange={enableSearch ? onSearchChange : undefined}
                    />
                    <CommandList>
                        {isLoading ? (
                            <CommandEmpty>Searching...</CommandEmpty>
                        ) : dishes.length === 0 ? (
                            <CommandEmpty>{emptyText}</CommandEmpty>
                        ) : (
                            <CommandGroup heading={enableSearch ? 'Suggestions' : undefined}>
                                {dishes.map((dish) => (
                                    <CommandItem
                                        key={dish.dish_id}
                                        value={enableSearch ? String(dish.dish_id) : dish.dish_name}
                                        onSelect={() => onSelect(dish.dish_id)}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                isSelected(dish.dish_id) ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        {dish.dish_name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}