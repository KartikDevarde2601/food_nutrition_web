import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDeleteDishMutation } from '../../../hooks/dishes/use-dishes-mutations'
import { DishMutateDrawer } from './dish-mutate-drawer'
import { useDishes } from './dishes-provider'

export function DishesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDishes()

  const deleteMutation = useDeleteDishMutation({
    onSuccess: () => {
      setOpen(null)
      setTimeout(() => {
        setCurrentRow(null)
      }, 500)
    },
  })

  return (
    <>
      {/* Create/Update Drawer */}
      <DishMutateDrawer
        open={open === 'create' || open === 'update'}
        onOpenChange={(v) => {
          if (!v) {
            setOpen(null)
          }
        }}
        currentRow={open === 'update' ? currentRow : null}
      />

      {currentRow && (
        <ConfirmDialog
          key='dish-delete'
          destructive
          open={open === 'delete'}
          onOpenChange={() => {
            setOpen('delete')
            setTimeout(() => {
              setCurrentRow(null)
            }, 500)
          }}
          handleConfirm={() => {
            deleteMutation.mutate(currentRow.dish_id)
          }}
          className='max-w-md'
          title={`Delete this dish: ${currentRow.dish_id} ?`}
          desc={
            <>
              You are about to delete a dish with the ID{' '}
              <strong>{currentRow.dish_id}</strong>. <br />
              This action cannot be undone.
            </>
          }
          confirmText='Delete'
        />
      )}
    </>
  )
}
