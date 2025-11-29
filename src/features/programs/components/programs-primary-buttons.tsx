import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePrograms } from './programs-provider'

export function ProgramsPrimaryButtons() {
  const { setOpen } = usePrograms()
  return (
    <div className='flex gap-2'>
      <Button
        variant='default'
        size='sm'
        className='ml-auto hidden h-8 lg:flex'
        onClick={() => setOpen('create')}
      >
        <Plus size={14} className='mr-2' strokeWidth={1.5} />
        Create
      </Button>
    </div>
  )
}
