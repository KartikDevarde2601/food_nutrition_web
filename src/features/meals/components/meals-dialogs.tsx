import { toast } from 'sonner'
import { useDeleteMealMutation } from '@/hooks/meals'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { MealsImportDialog } from './meals-import-dialog'
import { useMeals } from './meals-provider'

export function MealsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useMeals()
  const { mutateAsync: deleteMeal } = useDeleteMealMutation()

  return (
    <>
      <MealsImportDialog
        key='meal-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <ConfirmDialog
            key='meal-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={async () => {
              await deleteMeal(currentRow.mealId)
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              toast.success(`Meal ${currentRow.mealId} deleted`)
            }}
            className='max-w-md'
            title={`Delete this meal: ${currentRow.mealId} ?`}
            desc={
              <>
                You are about to delete a meal with the ID{' '}
                <strong>{currentRow.mealId}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
