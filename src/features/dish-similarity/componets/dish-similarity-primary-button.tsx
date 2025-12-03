import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDishesSimilarity } from './dish-similarity-provider'

export function DishSimilarityPrimaryButtons() {
  const { setOpen } = useDishesSimilarity()
  return (
    <div className='flex gap-2'>
      <Button
        variant='default'
        size='sm'
        className='flex h-8 lg:flex'
        onClick={() => setOpen('create')}
      >
        <Plus size={14} className='mr-2' strokeWidth={1.5} />
        Create
      </Button>
    </div>
  )
}
