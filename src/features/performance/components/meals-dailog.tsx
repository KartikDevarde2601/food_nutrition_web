import { useState, useCallback, useEffect } from 'react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Loader2, LayoutGrid, LayoutList } from 'lucide-react'
import { useDishesQuery } from '@/hooks/dishes'
import { useMealsQuery } from '@/hooks/meals/use-meals-query'
import { useModelsQuery } from '@/hooks/programs/use-models-query'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { MealCard } from '@/components/meal-card'
import { mealsColumns } from '@/features/meals/components/table-columns/meals-columns'
import { useMealDetails } from '../context/meal-details-provider'
import { MealCarouselItem } from './meal-carousel-item'
import { ModelSelectorMealDialog } from './model-selection-meal-dailog'
import { getRouteApi } from '@tanstack/react-router'

const route = getRouteApi('/_authenticated/programs/$id/performance')
import { getRouteApi } from '@tanstack/react-router'

export function MealsDialog() {
  const { id } = route.useParams()
  const { groupSimilarDishes } = route.useSearch()

  const route = getRouteApi('/_authenticated/programs/$id/performance')

    const search = route.useSearch()
  
  const { selectdishAndModels, setSelectdishAndModels } = useMealDetails()
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([])

  const [view, setView] = useState<'grid' | 'carousel'>('grid')
  const [api, setApi] = useState<CarouselApi>()
  const [currentMealIndex, setCurrentMealIndex] = useState<number>(0)

  // Retrieve models for selector
  const { data: models = [] } = useModelsQuery({ includeGT: false })
  const { data: allDishesData } = useDishesQuery({ limit: 100 }) // High limit to key names
  const allDishes = allDishesData?.data || []

  const isOpen = !!selectdishAndModels

  const {
    data: meals = [],
    isLoading,
    error,
  } = useMealsQuery(
    {
      program_id: Number(id),
      dishName: selectdishAndModels?.dishName,
      selectedModel:
        selectdishAndModels?.clickedModel === 1
          ? selectdishAndModels?.modelOne
          : selectdishAndModels?.modelTwo,
      modelIdOne: selectdishAndModels?.modelOne,
      modelIdTwo: selectdishAndModels?.modelTwo,
      includeMatchStatus: true, 
      groupSimilar: search.groupSimilarDishes === 1,
    },
    {
      enabled: isOpen,
    }
  )

  const table = useReactTable({
    data: meals,
    columns: mealsColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    // We only run this if the dialog is open and we have the data
    if (isOpen && selectdishAndModels) {
      const id1 = String(selectdishAndModels.modelOne)
      const id2 = String(selectdishAndModels.modelTwo)

      const selection: string[] = []
      if (id1 !== '1' && id2 !== '1') {
        selection.push(id1)
        selection.push(id2)
        setSelectedModelIds(selection)
        return
      }
      const actualModelId = id1 !== '1' ? id1 : id2

      // 2. Start selection with the model that was Not GT
      selection.push(actualModelId)

      // 3. Find a partner model:
      // Get the first model in our list that isn't the one we just added
      const partner = models.find((m) => String(m.model_id) !== actualModelId)

      if (partner) {
        selection.push(String(partner.model_id))
      }
      setSelectedModelIds(selection)
    }
  }, [isOpen, models, selectdishAndModels])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setSelectdishAndModels(null)
        setView('grid') // Reset to grid view on close
        setCurrentMealIndex(0) // Reset index on close
      }
    },
    [setSelectdishAndModels]
  )

  const handleMealClick = (index: number) => {
    setCurrentMealIndex(index) // Set the index of the clicked meal
    setView('carousel') // Switch to carousel view
    // The actual scrolling will be handled by the useEffect
  }

  // Scroll to the clicked meal when the carousel API is ready
  useEffect(() => {
    if (view !== 'carousel' || !api || currentMealIndex === undefined) return

    const scrollToTarget = () => api.scrollTo(currentMealIndex, true) // instant jump (no animation)

    // If carousel is already initialized, scroll immediately
    if (api.canScrollNext() || api.canScrollPrev() || meals.length <= 1) {
      scrollToTarget()
    }

    // Also listen for the 'init' event in case the carousel isn't ready yet
    api.on('init', scrollToTarget)

    return () => {
      api.off('init', scrollToTarget)
    }
  }, [view, api, currentMealIndex, meals.length])

  const getModelName = (id: string | number | undefined) => {
    if (!id) return 'Unknown'
    if (String(id) == String(1)) {
      return 'GT Model'
    }
    return (
      models.find((m) => String(m.model_id) === String(id))?.name ||
      `Model ${id}`
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='flex h-[95vh] max-h-[95vh] w-[95vw] max-w-[95vw] flex-col p-6 sm:max-w-[95vw]'>
        <DialogHeader className='mx-6 flex flex-row items-center justify-between'>
          <div className='flex flex-col gap-1'>
            <DialogTitle>
              Identified Dish Name: {selectdishAndModels?.dishName}
            </DialogTitle>
            <DialogDescription>
              All meals where{' '}
              {getModelName(
                selectdishAndModels?.clickedModel === 1
                  ? selectdishAndModels?.modelOne
                  : selectdishAndModels?.modelTwo
              )}{' '}
              identified {selectdishAndModels?.dishName}
            </DialogDescription>
          </div>

          <div className='mr-8 flex flex-row items-center gap-4'>
            <ToggleGroup
              variant='outline'
              type='single'
              value={view}
              onValueChange={(val) =>
                val && setView(val as 'grid' | 'carousel')
              }
            >
              <ToggleGroupItem value='grid' aria-label='Grid view'>
                <LayoutGrid className='h-4 w-4' />
              </ToggleGroupItem>
              <ToggleGroupItem value='carousel' aria-label='Carousel view'>
                <LayoutList className='h-4 w-4 rotate-90' />
              </ToggleGroupItem>
            </ToggleGroup>
            {view === 'carousel' && (
              <ModelSelectorMealDialog
                title='Choose 2 Models'
                models={models}
                selectedModels={selectedModelIds}
                onSelectionChange={setSelectedModelIds}
                isLoading={isLoading}
              />
            )}
          </div>
        </DialogHeader>

        <div className='relative min-h-0 flex-1 overflow-hidden'>
          {isLoading ? (
            <div className='flex h-full items-center justify-center'>
              <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
            </div>
          ) : error ? (
            <div className='text-destructive flex h-full items-center justify-center'>
              Failed to load meals
            </div>
          ) : meals.length > 0 ? (
            view === 'grid' ? (
              <div className='h-full overflow-y-auto p-4'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-8'>
                  {table.getRowModel().rows.map((row, index) => (
                    <MealCard
                      key={row.id}
                      row={row}
                      onClick={() => handleMealClick(index)}
                      isLastSelected={false}
                      isMatched={row.original.matchStatus === 'matched'}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className='relative h-full px-12'>
                <Carousel className='h-full w-full' setApi={setApi}>
                  <CarouselContent className='ml-0 h-full'>
                    {table.getRowModel().rows.map((row) => (
                      <CarouselItem
                        key={row.original.mealId}
                        className='h-full basis-full pl-4'
                      >
                        <MealCarouselItem
                          mealId={row.original.mealId}
                          model1Id={selectedModelIds[0]}
                          model2Id={selectedModelIds[1]}
                          model1Name={getModelName(selectedModelIds[0])}
                          model2Name={getModelName(selectedModelIds[1])}
                          allDishes={allDishes}
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className='-left-8' />
                  <CarouselNext className='-right-8' />
                </Carousel>
              </div>
            )
          ) : (
            <div className='text-muted-foreground flex h-full items-center justify-center rounded-md border'>
              No meals found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
