import { useDeleteProgramMutation } from '@/hooks/programs'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { usePrograms } from './programs-provider'

export function ProgramsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = usePrograms()
  const deleteMutation = useDeleteProgramMutation({
    onSuccess: () => {
      setOpen(null)
      setTimeout(() => {
        setCurrentRow(null)
      }, 500)
    },
  })

  return (
    <>
      {currentRow && (
        <ConfirmDialog
          key='program-delete'
          destructive
          open={open === 'delete'}
          onOpenChange={() => {
            setOpen(null)
            setTimeout(() => {
              setCurrentRow(null)
            }, 500)
          }}
          handleConfirm={() => {
            deleteMutation.mutate(currentRow.program_id)
          }}
          className='max-w-md'
          title={`Delete this program: ${currentRow.name}?`}
          desc={
            <>
              You are about to delete the program{' '}
              <strong>{currentRow.name}</strong>. <br />
              This action cannot be undone.
            </>
          }
          confirmText='Delete'
        />
      )}
    </>
  )
}
