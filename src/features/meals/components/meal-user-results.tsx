import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import {
  useForm,
  useFieldArray,
  UseFormReturn,
  useWatch,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Trash2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDishesQuery } from '@/hooks/dishes'
import { useCorrectMealMutation } from '@/hooks/meals/use-meals-mutations'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { DishPopover } from '@/components/dishes-pop-over'
import { Dish } from '@/features/dishes/data/schema'
import { useMealFormContext } from '../context/meal-form-provider'
import {
  TransformedIdentifier,
  TransformedIdentifierSchema,
} from '../data/schema'

// Form schema using TransformedIdentifierSchema
const FormSchema = z.object({
  identifiers: z.array(TransformedIdentifierSchema),
  feedback: z.string().optional(),
})

type FormValues = z.infer<typeof FormSchema>

interface MealUserResultsProps {
  identifiers: TransformedIdentifier[]
  meal_id: number
  model_id: number
  feedback: string
  allDishes: Dish[]
}

function DishSearchPopover({
  index,
  form,
  allDishes,
}: {
  index: number
  form: UseFormReturn<FormValues>
  allDishes: any[]
}) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)

  const { data: searchDishesData, isLoading: isSearching } = useDishesQuery({
    search: debouncedSearch,
    limit: 100,
  })

  const searchDishes = searchDishesData?.data || []
  const currentValue = form.watch(`identifiers.${index}.dishId`)
  const selectedDish = allDishes.find((d) => d.dish_id === Number(currentValue))

  return (
    <DishPopover
      dishes={searchDishes.length > 0 ? searchDishes : allDishes}
      selectedValue={selectedDish?.dish_id}
      onSelect={(dishId) => {
        form.setValue(`identifiers.${index}.dishId`, String(dishId))
      }}
      placeholder='Search dishes...'
      buttonText={selectedDish?.dish_name || 'Select dish...'}
      isLoading={isSearching}
      enableSearch
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      open={open}
      onOpenChange={setOpen}
    />
  )
}

export function MealResults({
  identifiers,
  model_id,
  meal_id,
  feedback,
  allDishes,
}: MealUserResultsProps) {
  const { updateFormDishes } = useMealFormContext()
  const { mutate: correctMeal } = useCorrectMealMutation()

  // Initialize form with existing identifiers using TransformedIdentifierSchema
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      identifiers: identifiers.map((id) => ({
        dishId: String(id.dishId),
        userWeight: id.userWeight,
        aiWeight: id.aiWeight,
        position: id.position,
        tag: id.tag, // Include tag in form data
      })),
      feedback: feedback || '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'identifiers',
  })

  // Watch form values and update tags dynamically
  const watchedIdentifiers = useWatch({
    control: form.control,
    name: 'identifiers',
  })

  // Debounce form updates to context for nutrition recalculation (300ms)
  const debouncedIdentifiers = useDebounce(watchedIdentifiers, 300)

  // Sync debounced form values to context
  useEffect(() => {
    if (!debouncedIdentifiers) return
    updateFormDishes(String(model_id), debouncedIdentifiers)
  }, [debouncedIdentifiers, updateFormDishes, model_id])

  // Update tags dynamically based on watched (non-debounced) values
  useEffect(() => {
    if (!watchedIdentifiers) return

    watchedIdentifiers.forEach((identifier, index) => {
      const hasUserWeight = identifier.userWeight !== undefined
      const hasAiWeight =
        identifier.aiWeight !== undefined && identifier.aiWeight !== ''

      let newTag: 'user' | 'ai' | 'both'
      if (hasUserWeight && hasAiWeight) {
        newTag = 'both'
      } else if (hasUserWeight) {
        newTag = 'user'
      } else {
        newTag = 'ai'
      }

      // Only update if tag has changed to avoid infinite loop
      const currentTag = form.getValues(`identifiers.${index}.tag`)
      if (currentTag !== newTag) {
        form.setValue(`identifiers.${index}.tag`, newTag)
      }
    })
  }, [watchedIdentifiers, form])

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    correctMeal({
      meal_id: meal_id,
      dishCorrection: data.identifiers,
      feedback: data.feedback || '',
    })
  }

  // Define columns with inline editing
  const columns: ColumnDef<TransformedIdentifier>[] = useMemo(
    () => [
      {
        accessorKey: 'dishId',
        header: 'Dish',
        cell: ({ row }) => {
          const index = row.index
          const error =
            form.formState.errors.identifiers?.[index]?.dishId?.message

          return (
            <div className='flex flex-col'>
              <DishSearchPopover
                index={index}
                form={form}
                allDishes={allDishes}
              />
              {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}
            </div>
          )
        },
      },
      {
        accessorKey: 'userWeight',
        header: 'User Weight (g)',
        cell: ({ row }) => {
          const index = row.index
          const error =
            form.formState.errors.identifiers?.[index]?.userWeight?.message

          return (
            <div className='flex flex-col'>
              <Input
                type='number'
                placeholder='User'
                step='10'
                {...form.register(`identifiers.${index}.userWeight`)}
                className={cn(error && 'border-red-500')}
              />
              {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}
            </div>
          )
        },
      },
      {
        accessorKey: 'aiWeight',
        header: 'AI Weight (g)',
        cell: ({ row }) => {
          const index = row.index
          const error =
            form.formState.errors.identifiers?.[index]?.aiWeight?.message

          return (
            <div className='flex flex-col'>
              <Input
                type='number'
                placeholder='AI'
                {...form.register(`identifiers.${index}.aiWeight`)}
                className={cn(error && 'border-red-500')}
                disabled={true}
              />
              {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}
            </div>
          )
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const index = row.index
          const tag = row.original.tag
          if (tag === 'both' || tag === 'ai') {
            return null
          }
          return (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => remove(index)}
              className='h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700'
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          )
        },
      },
    ],
    [form, allDishes, remove]
  )

  const table = useReactTable({
    data: fields,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Add new row
  const handleAddRow = () => {
    append({
      dishId: '',
      userWeight: '',
      aiWeight: undefined,
      position: '',
      tag: 'user',
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No dishes added yet. Click "Add Row" to start.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div>
          <Textarea
            placeholder='Enter your feedback'
            {...form.register('feedback')}
          />
        </div>
        <div className='flex justify-between gap-4'>
          <Button
            type='button'
            size='sm'
            className='flex-1'
            onClick={handleAddRow}
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Row
          </Button>

          <Button
            type='button'
            variant='outline'
            size='sm'
            className='flex-1'
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button type='submit' size='sm' className='flex-1'>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}
