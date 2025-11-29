import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateProgramDto } from '@/lib/api/programs.api'
import {
  useCreateProgramMutation,
  useUpdateProgramMutation,
} from '@/hooks/programs'
import { useModelsQuery } from '@/hooks/programs'
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import {
  type Program,
  ProgramFormValues,
  programFormSchema,
} from '../data/schema'
import { usePrograms } from './programs-provider'

type ProgramsMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Program | null
}

export function ProgramsMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: ProgramsMutateDrawerProps) {
  const isUpdate = !!currentRow
  const { setCurrentRow } = usePrograms()

  // Fetch models for dropdown
  const { data: models = [], isLoading: isLoadingModels } = useModelsQuery()

  // Mutations
  const createMutation = useCreateProgramMutation({
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
    },
  })

  const updateMutation = useUpdateProgramMutation({
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
      setCurrentRow(null)
    },
  })

  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues: {
      name: '',
      description: '',
      default_model_id: undefined,
    },
  })

  // Reset form when currentRow changes or drawer opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: currentRow?.name ?? '',
        description: currentRow?.description ?? '',
        default_model_id: currentRow?.default_model_id,
      })
    }
  }, [open, currentRow, form])

  const onSubmit = (data: ProgramFormValues) => {
    const trasformdata = {
      name: data.name,
      description: data.description,
      defaultModelId: data.default_model_id,
    } as CreateProgramDto
    if (isUpdate && currentRow) {
      updateMutation.mutate({
        id: currentRow.program_id,
        data: trasformdata,
      })
    } else {
      createMutation.mutate(trasformdata)
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

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
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Program</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the program by providing necessary info.'
              : 'Add a new program by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id='programs-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            {/* Name */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter program name' />
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
                      placeholder='Enter program description'
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Default Model */}
            <FormField
              control={form.control}
              name='default_model_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Model</FormLabel>
                  <SelectDropdown
                    key={field.value || 'empty'}
                    defaultValue={field.value ? String(field.value) : ''}
                    onValueChange={(value) => {
                      if (value && value !== '') {
                        field.onChange(Number(value))
                      } else {
                        field.onChange(undefined)
                      }
                    }}
                    placeholder={
                      isLoadingModels ? 'Loading models...' : 'Select a model'
                    }
                    disabled={isLoadingModels || isSubmitting}
                    items={models.map((model) => ({
                      key: model.model_id,
                      label: model.name,
                      value: String(model.model_id),
                    }))}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline' disabled={isSubmitting}>
              Close
            </Button>
          </SheetClose>

          <Button form='programs-form' type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
