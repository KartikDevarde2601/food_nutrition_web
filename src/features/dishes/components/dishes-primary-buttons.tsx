import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDishes } from './dishes-provider'

export function DishesPrimaryButtons() {
  const { setOpen } = useDishes()
  return (
    <div className='flex gap-2'>
      <Button
        variant='default'
        size='sm'
        className='flex h-8 items-center lg:flex'
        onClick={() => setOpen('create')}
      >
        <Plus size={14} className='mr-2' strokeWidth={1.5} />
        Create
      </Button>
    </div>
  )
}


