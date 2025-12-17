import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { toast } from 'sonner'
import { DishPopover } from '@/components/dishes-pop-over'
import { useDishesQuery } from '@/hooks/dishes/use-dish-query'
import { dishSimilarityFormSchema } from '../data/schema'
import { useCreateDishSimilarityMutation } from '@/hooks/dish-similarity/use-dishsimilarity-mutations'
import { useDebounce } from '@/hooks/use-debounce'





type SimilarityMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DishSimilarityMutateDrawer({
  open,
  onOpenChange,
}: SimilarityMutateDrawerProps) {
  const [openSimilar, setOpenSimilar] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Query for the main dish selection (all dishes, no limit initially or default limit)
  const { data: allDishesData } = useDishesQuery({ limit: 100 })
  const allDishes = allDishesData?.data || []

  // Query for similar dishes search with limit 10
  const { data: searchDishesData, isLoading: isSearching } = useDishesQuery({
    search: debouncedSearch,
    limit: 100,
  })
  const searchDishes = searchDishesData?.data || []

  const createMutation = useCreateDishSimilarityMutation({
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
      setSearchQuery('')
    },
  })

  const form = useForm<z.infer<typeof dishSimilarityFormSchema>>({
    resolver: zodResolver(dishSimilarityFormSchema),
    defaultValues: {
      dish_id: undefined,
      similar_dish_ids: [],
    },
  })

  function onSubmit(data: z.infer<typeof dishSimilarityFormSchema>) {
    createMutation.mutate(data)
  }

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen)
    if (!isOpen) {
      form.reset()
      setSearchQuery('')
    }
  }

  const handleSelectSimilarDish = (dishId: number) => {
    if (form.getValues('dish_id') === dishId) {
      toast.error('Cannot select the same dish!', { position: 'top-right' })
      return
    }
    const current = form.getValues('similar_dish_ids') || []
    if (current.includes(dishId)) {
      form.setValue(
        'similar_dish_ids',
        current.filter((id) => id !== dishId)
      )
    } else {
      form.setValue('similar_dish_ids', [...current, dishId])
    }
  }

  const removeSimilarDish = (dishId: number) => {
    const current = form.getValues('similar_dish_ids') || []
    form.setValue(
      'similar_dish_ids',
      current.filter((id) => id !== dishId)
    )
  }

  // Helper to find dish name by ID from either list
  const getDishName = (id: number) => {
    const dish =
      allDishes.find((d) => d.dish_id === id) ||
      searchDishes.find((d) => d.dish_id === id)
    return dish?.dish_name || `Dish ${id}`
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className='flex flex-col w-[500px] sm:w-[600px] p-0 gap-4'>
        <SheetHeader className='px-4'>
          <SheetTitle>Create Dish Similarity</SheetTitle>
          <SheetDescription>
            Select a primary dish and search for multiple similar dishes.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 min-h-0 bg-background/50">
          <Form {...form}>
            <form
              id='dish-similarity-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6 px-4'
            >
              <FormField
                control={form.control}
                name='dish_id'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Primary Dish</FormLabel>
                    <FormControl>
                      <DishPopover
                        dishes={allDishes}
                        selectedValue={field.value}
                        onSelect={(dishId) => form.setValue('dish_id', dishId)}
                        placeholder='Search dish...'
                        buttonText='Select dish'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='similar_dish_ids'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Similar Dishes</FormLabel>
                    <FormControl>
                      <DishPopover
                        dishes={searchDishes}
                        selectedValue={field.value}
                        onSelect={handleSelectSimilarDish}
                        placeholder='Search similar dishes...'
                        buttonText='Select similar dishes...'
                        isMultiSelect
                        isLoading={isSearching}
                        enableSearch
                        searchValue={searchQuery}
                        onSearchChange={setSearchQuery}
                        open={openSimilar}
                        onOpenChange={setOpenSimilar}
                      />
                    </FormControl>
                    {field.value && field.value.length > 0 && (
                      <div className='flex flex-wrap gap-2 mt-2'>
                        {field.value.map((id) => (
                          <Badge key={id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                            {getDishName(id)}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 rounded-full hover:bg-transparent"
                              onClick={(e) => {
                                e.preventDefault()
                                removeSimilarDish(id)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='flex gap-2'>
                <SheetClose asChild>
                  <Button variant='outline' className='flex-1'>
                    Close
                  </Button>
                </SheetClose>
                <Button type='submit' className='flex-1'>
                  Create Similarity
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}