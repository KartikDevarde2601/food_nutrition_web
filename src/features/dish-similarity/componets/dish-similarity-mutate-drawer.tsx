import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useDishesQuery } from '@/hooks/dishes/use-dish-query'
import { dishSimilarityFormSchema } from '../data/schema'
import { useCreateDishSimilarityMutation } from '@/hooks/dish-similarity/use-dishsimilarity-mutations'


type SimilarityMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DishSimilarityMutateDrawer({
  open,
  onOpenChange,
}: SimilarityMutateDrawerProps) {
  
  const { data: dishes = [] } = useDishesQuery()

   const createMutation = useCreateDishSimilarityMutation({
     onSuccess: () => {
       onOpenChange(false)
      form.reset()
    },
    })

  const form = useForm<z.infer<typeof dishSimilarityFormSchema>>({
    resolver: zodResolver(dishSimilarityFormSchema),
    defaultValues: {
      dish_id: undefined,
      similar_dish_id: undefined,
    },
  })

  function onSubmit(data: z.infer<typeof dishSimilarityFormSchema>) {
    console.log(data)
    createMutation.mutate(data)
  }

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen)
    if (!isOpen) {
      form.reset()
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className='flex flex-col'>
        <SheetHeader>
          <SheetTitle>Create Dish Similarity</SheetTitle>
          <SheetDescription>
            Select two dishes to mark them as similar.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex-1 space-y-6 overflow-y-auto px-4'>
            <FormField
              control={form.control}
              name='dish_id'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Dish</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? dishes.find(
                                (dish) => dish.dish_id === field.value
                              )?.dish_name
                            : 'Select dish'}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align='start' alignOffset={10} className='w-[--radix-popover-trigger-width] p-0'>
                      <Command>
                        <CommandInput placeholder='Search dish...' />
                        <CommandList>
                            <CommandEmpty>No dish found.</CommandEmpty>
                            <CommandGroup>
                            {dishes.map((dish) => (
                                <CommandItem
                                value={dish.dish_name}
                                key={dish.dish_id}
                                onSelect={() => {
                                    form.setValue('dish_id', dish.dish_id)
                                }}
                                >
                                <Check
                                    className={cn(
                                    'mr-2 h-4 w-4',
                                    dish.dish_id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                />
                                {dish.dish_name}
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='similar_dish_id'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Similar Dish</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          role='combobox'
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value
                            ? dishes.find(
                                (dish) => dish.dish_id === field.value
                              )?.dish_name
                            : 'Select similar dish'}
                          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align='start' alignOffset={10} className='w-[--radix-popover-trigger-width] p-0'>
                      <Command>
                        <CommandInput placeholder='Search dish...' />
                        <CommandList>
                            <CommandEmpty>No dish found.</CommandEmpty>
                            <CommandGroup>
                            {dishes.map((dish) => (
                                <CommandItem
                                value={dish.dish_name}
                                key={dish.dish_id}
                                onSelect={() => {
                                    form.setValue('similar_dish_id', dish.dish_id)
                                }}
                                >
                                <Check
                                    className={cn(
                                    'mr-2 h-4 w-4',
                                    dish.dish_id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                />
                                {dish.dish_name}
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Submit</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
