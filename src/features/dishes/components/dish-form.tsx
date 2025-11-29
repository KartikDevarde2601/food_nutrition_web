import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
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
import { Textarea } from '@/components/ui/textarea'
import { SingleImageUpload } from '@/components/upload-image'
import { type Dish, type DishForm, dishFormSchema } from '../data/schema'

type DishFormProps = {
  dishId?: number | string
  currentRow?: Dish
  mode: 'create' | 'edit'
}

export function DishForm({ dishId, currentRow, mode }: DishFormProps) {
  const navigate = useNavigate()
  const isUpdate = mode === 'edit'

  const { data: dishData, isLoading: isLoadingDish } = useDishQuery(dishId!, {
    enabled: !!dishId && isUpdate,
  })

  const createMutation = useCreateDishMutation({
    onSuccess: () => {
      navigate({ to: '/dishes' })
    },
  })

  const updateMutation = useUpdateDishMutation({
    onSuccess: () => {
      navigate({ to: '/dishes' })
    },
  })

  const defaultValues: DishForm = {
    dish_name: '',
    description: '',
    image: undefined,
    carbs_g: 0,
    protein_g: 0,
    fat_g: 0,
  }

  const form = useForm<DishForm>({
    resolver: zodResolver(dishFormSchema),
    defaultValues,
  })

  // Reset form when data is loaded
  useEffect(() => {
    if (dishData) {
      form.reset({
        dish_name: dishData.dish_name,
        description: dishData.description,
        image: dishData.image_url, // Pass the URL string for preview
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
    }
  }, [dishData, currentRow, form])

  const onSubmit = (data: DishForm) => {
    // Prepare payload
    const payload = { ...data }

    // If image is a string (existing URL), remove it so we don't send it as a file
    if (typeof payload.image === 'string') {
      delete payload.image
    }

    if (isUpdate && dishId) {
      updateMutation.mutate({ id: Number(dishId), data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleCancel = () => {
    navigate({ to: '/dishes' })
  }

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    (isUpdate && isLoadingDish)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
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
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Enter description'
                  rows={4}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    disabled={isLoading}
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
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    disabled={isLoading}
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
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex gap-4'>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Saving...' : isUpdate ? 'Update Dish' : 'Create Dish'}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
