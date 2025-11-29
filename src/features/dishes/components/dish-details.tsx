import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import { Edit, ArrowLeft, Calendar, User } from 'lucide-react'
import { useDishQuery } from '@/hooks/dishes'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

interface DishDetailsProps {
  dishId: string | number
}

export function DishDetails({ dishId }: DishDetailsProps) {
  const navigate = useNavigate()
  const { data: dish, isLoading, error } = useDishQuery(dishId)

  if (isLoading) {
    return <DishDetailsSkeleton />
  }

  if (error || !dish) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <h3 className='text-lg font-semibold'>Error loading dish</h3>
        <p className='text-muted-foreground'>
          {error?.message || 'Dish not found'}
        </p>
        <Button
          variant='outline'
          className='mt-4'
          onClick={() => navigate({ to: '/dishes' })}
        >
          Back to Dishes
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header Section */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => navigate({ to: '/dishes' })}
            className='h-8 w-8 sm:h-10 sm:w-10'
          >
            <ArrowLeft className='h-4 w-4 sm:h-5 sm:w-5' />
            <span className='sr-only'>Back</span>
          </Button>
          <div>
            <h1 className='text-xl font-bold tracking-tight sm:text-3xl'>
              {dish.dish_name}
            </h1>
            <p className='text-muted-foreground text-sm sm:text-base'>
              Dish Details
            </p>
          </div>
        </div>
        <Button
          onClick={() =>
            navigate({
              to: '/dishes/edit/$id',
              params: { id: dish.dish_id.toString() },
            })
          }
          className='w-full sm:w-auto'
        >
          <Edit className='mr-2 h-4 w-4' />
          Edit Dish
        </Button>
      </div>

      <Separator />

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Main Content - Image and Description */}
        <div className='space-y-6 lg:col-span-2'>
          <div className='bg-muted/50 overflow-hidden rounded-xl border shadow-sm'>
            {dish.image_url ? (
              <img
                src={dish.image_url}
                alt={dish.dish_name}
                className='aspect-video w-full object-cover transition-all hover:scale-105'
              />
            ) : (
              <div className='bg-muted text-muted-foreground flex aspect-video w-full items-center justify-center'>
                No Image Available
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground leading-relaxed'>
                {dish.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Nutrition and Meta */}
        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Nutritional Facts</CardTitle>
            </CardHeader>
            <CardContent className='grid gap-4'>
              <div className='flex items-center justify-between rounded-lg border p-3 shadow-sm'>
                <span className='text-sm font-medium'>Carbs</span>
                <Badge variant='secondary' className='text-base'>
                  {dish.carbs_g}g
                </Badge>
              </div>
              <div className='flex items-center justify-between rounded-lg border p-3 shadow-sm'>
                <span className='text-sm font-medium'>Protein</span>
                <Badge variant='secondary' className='text-base'>
                  {dish.protein_g}g
                </Badge>
              </div>
              <div className='flex items-center justify-between rounded-lg border p-3 shadow-sm'>
                <span className='text-sm font-medium'>Fat</span>
                <Badge variant='secondary' className='text-base'>
                  {dish.fat_g}g
                </Badge>
              </div>

              <Separator className='my-2' />

              <div className='flex items-center justify-between pt-2'>
                <span className='font-semibold'>Total Calories</span>
                <span className='text-primary text-xl font-bold'>
                  {/* Rough calculation: 4 cal/g for carbs/protein, 9 cal/g for fat */}
                  {Math.round(
                    dish.carbs_g * 4 + dish.protein_g * 4 + dish.fat_g * 9
                  )}
                  <span className='text-muted-foreground ml-1 text-sm font-normal'>
                    kcal
                  </span>
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Metadata</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 text-sm'>
              <div className='text-muted-foreground flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                <span>Created: {format(new Date(dish.created_at), 'PPP')}</span>
              </div>
              <div className='text-muted-foreground flex items-center gap-2'>
                <Calendar className='h-4 w-4' />
                <span>Updated: {format(new Date(dish.updated_at), 'PPP')}</span>
              </div>
              {dish.added_by && (
                <div className='text-muted-foreground flex items-center gap-2'>
                  <User className='h-4 w-4' />
                  <span>Added by ID: {dish.added_by}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function DishDetailsSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-24' />
        </div>
        <Skeleton className='h-10 w-24' />
      </div>
      <Separator />
      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='space-y-6 lg:col-span-2'>
          <Skeleton className='aspect-video w-full rounded-xl' />
          <Skeleton className='h-32 w-full rounded-xl' />
        </div>
        <div className='space-y-6'>
          <Skeleton className='h-64 w-full rounded-xl' />
          <Skeleton className='h-32 w-full rounded-xl' />
        </div>
      </div>
    </div>
  )
}
