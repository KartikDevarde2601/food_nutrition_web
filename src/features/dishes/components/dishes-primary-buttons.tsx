import { Download, Plus } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useDishes } from './dishes-provider'

export function DishesPrimaryButtons() {
  const { setOpen } = useDishes()
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        size='sm'
        className='ml-auto hidden h-8 lg:flex'
        onClick={() => setOpen('import')}
      >
        <Download size={14} className='mr-2' strokeWidth={1.5} />
        Import
      </Button>
      <Button
        variant='default'
        size='sm'
        className='ml-auto hidden h-8 lg:flex'
        asChild
      >
        <Link to='/dishes/create'>
          <Plus size={14} className='mr-2' strokeWidth={1.5} />
          Create
        </Link>
      </Button>
    </div>
  )
}

