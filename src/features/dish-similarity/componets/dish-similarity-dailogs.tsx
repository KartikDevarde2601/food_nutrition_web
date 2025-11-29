import { ConfirmDialog } from '@/components/confirm-dialog'
import { useDishesSimilarity } from './dish-similarity-provider'
import { TransformedDish,DeleteManySimilarityDto } from '@/features/dish-similarity/data/schema'
import { useDeleteDishSimilarityMutation } from '@/hooks/dish-similarity/use-dishsimilarity-mutations'

export function DishesSimilarityDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useDishesSimilarity()
  
     const deleteMutation = useDeleteDishSimilarityMutation({
         onSuccess: () => {
           setOpen(null)
           setTimeout(() => {
             setCurrentRow(null)
           }, 500)
         },
       })
     
    

  const transfromDeleteMutation = (data:TransformedDish):DeleteManySimilarityDto => {
    return {
      pairs: data.similarDishes.map((similarDish) => ({
        dishID_1: data.dish_id,
        dishID_2: similarDish.dish_id,
      }))
    }
  }
  
 
  return (
    <>
      {currentRow && (
        <ConfirmDialog
          key='delete-similarity'
          destructive
          open={open === 'delete'}
          onOpenChange={() => {
            setOpen(null)
            setTimeout(() => {
              setCurrentRow(null)
            }, 500)
          }}
          handleConfirm={() => {
            const data = transfromDeleteMutation(currentRow)

            console.log('delete similarity payload',data)
            deleteMutation.mutate(data)
          }}
          className='max-w-md'
          title={`Delete this dish: ${currentRow.dish_name} ?`}
          desc={
            <>
              You are about to delete All similar{' '}
              <strong>{currentRow.dish_name}</strong>. <br />
              This action cannot be undone.
            </>
          }
          confirmText='Delete'
        />
      )}
    </>
  )
}
