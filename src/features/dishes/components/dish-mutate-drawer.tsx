import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDishQuery } from '@/hooks/dishes'
import { useCreateDishMutation, useUpdateDishMutation } from '@/hooks/dishes'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { SingleImageUpload } from '@/components/upload-image'
import { type Dish, type DishForm, dishFormSchema } from '../data/schema'
import { useDishes } from './dishes-provider'

type DishMutateDrawerProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow?: Dish | null
}

export function DishMutateDrawer({
    open,
    onOpenChange,
    currentRow,
}: DishMutateDrawerProps) {
    const isUpdate = !!currentRow
    const { setCurrentRow } = useDishes()

    // Fetch dish data for update mode
    const { data: dishData, isLoading: isLoadingDish } = useDishQuery(
        currentRow?.dish_id!,
        {
            enabled: !!currentRow?.dish_id && isUpdate,
        }
    )

    // Mutations
    const createMutation = useCreateDishMutation({
        onSuccess: () => {
            onOpenChange(false)
            form.reset()
        },
    })

    const updateMutation = useUpdateDishMutation({
        onSuccess: () => {
            onOpenChange(false)
            form.reset()
            setCurrentRow(null)
        },
    })

    const form = useForm<DishForm>({
        resolver: zodResolver(dishFormSchema),
        defaultValues: {
            dish_name: '',
            description: '',
            image: undefined,
            carbs_g: 0,
            protein_g: 0,
            fat_g: 0,
        },
    })

    // Reset form when currentRow changes or drawer opens
    useEffect(() => {
        if (open) {
            if (dishData) {
                form.reset({
                    dish_name: dishData.dish_name,
                    description: dishData.description,
                    image: dishData.image_url,
                    carbs_g: Number(dishData.carbs_g),
                    protein_g: Number(dishData.protein_g),
                    fat_g: Number(dishData.fat_g),
                })
            } else if (currentRow) {
                form.reset({
                    dish_name: currentRow.dish_name,
                    description: currentRow.description,
                    image: currentRow.image_url,
                    carbs_g: Number(currentRow.carbs_g),
                    protein_g: Number(currentRow.protein_g),
                    fat_g: Number(currentRow.fat_g),
                })
            } else {
                form.reset({
                    dish_name: '',
                    description: '',
                    image: undefined,
                    carbs_g: 0,
                    protein_g: 0,
                    fat_g: 0,
                })
            }
        }
    }, [open, currentRow, dishData, form])

    const onSubmit = (data: DishForm) => {
        // Prepare payload
        const payload = { ...data }

        // If image is a string (existing URL), remove it so we don't send it as a file
        if (typeof payload.image === 'string') {
            delete payload.image
        }

        if (isUpdate && currentRow) {
            updateMutation.mutate({ id: currentRow.dish_id, data: payload })
        } else {
            createMutation.mutate(payload)
        }
    }

    const isSubmitting =
        createMutation.isPending ||
        updateMutation.isPending ||
        (isUpdate && isLoadingDish)

    return (
        <Sheet
            open={open}
            onOpenChange={(v) => {
                onOpenChange(v)
                if (!v) {
                    setCurrentRow(null)
                    form.reset()
                }
            }}
        >
            <SheetContent className='flex flex-col w-[500px] sm:w-[600px] p-0 gap-4'>
                <SheetHeader className='px-4'>
                    <SheetTitle>{isUpdate ? 'Update' : 'Create'} Dish</SheetTitle>
                    <SheetDescription>
                        {isUpdate
                            ? 'Update the dish by providing necessary info.'
                            : 'Add a new dish by providing necessary info.'}
                        Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 min-h-0 bg-background/50 overflow-y-auto">
                    <Form {...form}>
                        <form
                            id='dish-form'
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-6 px-4 pb-4'
                        >
                            {/* Dish Name */}
                            <FormField
                                control={form.control}
                                name='dish_name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dish Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder='Enter dish name'
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder='Enter dish description'
                                                rows={4}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Dish Image */}
                            <FormField
                                control={form.control}
                                name='image'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Dish Image</FormLabel>
                                        <FormControl>
                                            <SingleImageUpload
                                                value={field.value ?? null}
                                                onChange={field.onChange}
                                                disabled={isSubmitting}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Nutritional Info */}
                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                                <FormField
                                    control={form.control}
                                    name='carbs_g'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Carbs (g)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.1'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(parseFloat(e.target.value))
                                                    }
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='protein_g'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Protein (g)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.1'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(parseFloat(e.target.value))
                                                    }
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name='fat_g'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fat (g)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='number'
                                                    step='0.1'
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(parseFloat(e.target.value))
                                                    }
                                                    disabled={isSubmitting}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className='flex gap-2'>
                                <SheetClose asChild>
                                    <Button variant='outline' disabled={isSubmitting} className='flex-1'>
                                        Close
                                    </Button>
                                </SheetClose>
                                <Button type='submit' disabled={isSubmitting} className='flex-1'>
                                    {isSubmitting ? 'Saving...' : 'Save changes'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    )
}
