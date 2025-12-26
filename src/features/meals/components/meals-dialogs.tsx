import { toast } from 'sonner'
import { useDeleteMealMutation } from '@/hooks/meals'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useMeals } from './meals-provider'
import { CreateMealDrawer } from './create-meal-drawer'

export function MealsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useMeals()
  const { mutateAsync: deleteMeal } = useDeleteMealMutation()

  return (
    <>
      {/* Create Meal Drawer */}
      <CreateMealDrawer
        open={open === 'create'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'create' : null)}
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
