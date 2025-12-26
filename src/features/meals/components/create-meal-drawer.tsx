import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSaveMealMutation } from '@/hooks/meals'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet'
import { SingleImageUpload } from '@/components/upload-image'
import { type MealForm, MealFormSchema } from '../data/schema'
import { useProgramQuery } from '@/hooks/programs'
import { getRouteApi } from '@tanstack/react-router'

const route = getRouteApi('/_authenticated/programs/$id/meals')

type CreateMealDrawerProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function CreateMealDrawer({
    open,
    onOpenChange,
}: CreateMealDrawerProps) {
    // Fetch programs for dropdown
    const { id } = route.useParams()

    const { data: programsData, isLoading: isLoadingPrograms } = useProgramQuery(id)

    // Mutation
    const saveMutation = useSaveMealMutation({
        onSuccess: () => {
            onOpenChange(false)
            form.reset()
        },
    })

    const form = useForm<MealForm>({
        resolver: zodResolver(MealFormSchema),
        defaultValues: {
            image: undefined,
            program_id: undefined,
        },
    })

    // Reset form and set program_id when drawer opens
    useEffect(() => {
        if (open && programsData) {
            form.reset({
                image: undefined,
                program_id: programsData.program_id,
                feedback: '',
            })
        }
    }, [open, form, programsData])

    const onSubmit = (data: MealForm) => {
        // Prepare payload - only send image and program_id (required fields)
        const payload: MealForm = {
            image: data.image,
            program_id: data.program_id,
        }

        // Add feedback if provided
        if (data.feedback && data.feedback.trim()) {
            payload.feedback = data.feedback
        }

        saveMutation.mutate(payload)
    }

    const isSubmitting = saveMutation.isPending

    return (
        <Sheet
            open={open}
            onOpenChange={(v) => {
                onOpenChange(v)
                if (!v) {
                    form.reset()
                }
            }}
        >
            <SheetContent className='flex flex-col w-[500px] sm:w-[600px] p-0 gap-4'>
                <SheetHeader className='px-4'>
                    <SheetTitle>Create Meal</SheetTitle>
                    <SheetDescription>
                        Add a new meal by uploading an image and selecting a program.
                        Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 min-h-0 bg-background/50 overflow-y-auto">
                    <Form {...form}>
                        <form
                            id='meal-form'
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-6 px-4 pb-4'
                        >
                            {/* Meal Image */}
                            <FormField
                                control={form.control}
                                name='image'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meal Image *</FormLabel>
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

                            {/* Program Display */}
                            <div className='space-y-2'>
                                <FormLabel>Program</FormLabel>
                                <div className='flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm'>
                                    {isLoadingPrograms ? (
                                        <span className='text-muted-foreground'>Loading...</span>
                                    ) : (
                                        <span className='font-medium'>{programsData?.name}</span>
                                    )}
                                </div>
                            </div>

                            <div className='flex gap-2'>
                                <SheetClose asChild>
                                    <Button variant='outline' disabled={isSubmitting} className='flex-1'>
                                        Close
                                    </Button>
                                </SheetClose>
                                <Button type='submit' disabled={isSubmitting} className='flex-1'>
                                    {isSubmitting ? 'Saving...' : 'Save meal'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    )
}
