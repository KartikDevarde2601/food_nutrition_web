import { useState, useCallback, useMemo } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import { useMealDetails } from '../context/meal-details-provider'
import { MealCarouselItem } from './meal-carousel-item'
import { useMealsQuery } from '@/hooks/meals/use-meals-query'
import { Loader2, LayoutGrid, LayoutList } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useModelsQuery } from '@/hooks/programs/use-models-query'
import { useDishesQuery } from '@/hooks/dishes'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { mealsColumns } from '@/features/meals/components/table-columns/meals-columns'
import { MealCard } from '@/components/meal-card'

export function MealsDialog() {
    const { selectdishAndModels, setSelectdishAndModels } = useMealDetails()
    // Local state for model selection
    const [model1Id, setModel1Id] = useState<string>("2")
    const [model2Id, setModel2Id] = useState<string>("3")
    const [view, setView] = useState<'grid' | 'carousel'>('grid')
    const [api, setApi] = useState<CarouselApi>()

    // Retrieve models for selector
    const { data: models = [] } = useModelsQuery({ includeGT: false })
    const { data: allDishesData } = useDishesQuery({ limit: 1000 }) // High limit to key names
    const allDishes = allDishesData?.data || []

    const isOpen = !!selectdishAndModels


    const { data: meals = [], isLoading, error } = useMealsQuery(
        {
            dishName: selectdishAndModels?.dishName,
            model_id: selectdishAndModels?.clickedModel === 1 ? selectdishAndModels?.modelOne : selectdishAndModels?.modelTwo,
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

    const handleOpenChange = useCallback((open: boolean) => {
        if (!open) {
            setSelectdishAndModels(null)

            setView("carousel") // Reset to carousel on close if desired, or keep state
        }
    }, [setSelectdishAndModels])

    const handleMealClick = (index: number) => {
        setView('carousel')
        // Give time for carousel to render
        setTimeout(() => {
            api?.scrollTo(index)
        }, 50)
    }

    const getModelName = (id: string | number | undefined) => {
        console.log('getmodelname', id)
        if (!id) return 'Unknown'
        if (String(id) == String(1)) {
            return 'GT Model'
        }
        return models.find(m => String(m.model_id) === String(id))?.name || `Model ${id}`
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className='w-[95vw] max-w-[95vw] sm:max-w-[95vw] h-[95vh] max-h-[95vh] flex flex-col p-6'>
                <DialogHeader className='flex flex-row items-center justify-between'>
                    <div className="flex flex-col gap-1">
                        <DialogTitle>
                            Identified Dish Name: {selectdishAndModels?.dishName}
                        </DialogTitle>
                        <DialogDescription>
                            All meals where {getModelName(selectdishAndModels?.clickedModel === 1 ? selectdishAndModels?.modelOne : selectdishAndModels?.modelTwo)} identified {selectdishAndModels?.dishName}
                        </DialogDescription>
                    </div>

                    <div className="flex flex-row items-center gap-4 mr-8">
                        <ToggleGroup variant="outline" type="single" value={view} onValueChange={(val) => val && setView(val as 'grid' | 'carousel')}>
                            <ToggleGroupItem value="grid" aria-label="Grid view">
                                <LayoutGrid className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="carousel" aria-label="Carousel view">
                                <LayoutList className="h-4 w-4 rotate-90" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                        {view === 'carousel' && (
                            <>
                                <div className="h-6 w-px bg-border" />
                                <Select value={model1Id} onValueChange={setModel1Id}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Model 1" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {models.map(m => (
                                            <SelectItem key={m.model_id} value={String(m.model_id)}>{m.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <span className="text-muted-foreground font-medium">vs</span>
                                <Select value={model2Id} onValueChange={setModel2Id}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select Model 2" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {models.map(m => (
                                            <SelectItem key={m.model_id} value={String(m.model_id)}>{m.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </>
                        )}
                    </div>
                </DialogHeader>

                <div className='flex-1 min-h-0 relative overflow-hidden'>
                    {isLoading ? (
                        <div className='flex h-full items-center justify-center'>
                            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
                        </div>
                    ) : error ? (
                        <div className='flex h-full items-center justify-center text-destructive'>
                            Failed to load meals
                        </div>
                    ) : meals.length > 0 ? (
                        view === 'grid' ? (
                            <div className="h-full overflow-y-auto p-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-8">
                                    {table.getRowModel().rows.map((row, index) => (
                                        <MealCard
                                            key={row.id}
                                            row={row}
                                            onClick={() => handleMealClick(index)}
                                            isLastSelected={false}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full px-12 relative">
                                <Carousel className="w-full h-full" setApi={setApi}>
                                    <CarouselContent className="h-full ml-0">
                                        {table.getRowModel().rows.map((row) => (
                                            <CarouselItem key={row.original.mealId} className="h-full pl-4 basis-full">
                                                <MealCarouselItem
                                                    mealId={row.original.mealId}
                                                    model1Id={model1Id}
                                                    model2Id={model2Id}
                                                    model1Name={getModelName(model1Id)}
                                                    model2Name={getModelName(model2Id)}
                                                    allDishes={allDishes}
                                                />

                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious className="-left-8" />
                                    <CarouselNext className="-right-8" />
                                </Carousel>
                            </div>
                        )
                    ) : (
                        <div className='flex h-full items-center justify-center border rounded-md text-muted-foreground'>
                            No meals found.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog >
    )
}