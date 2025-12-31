import { getRouteApi } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useModelsQuery } from '@/hooks/programs/use-models-query'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

const route = getRouteApi('/_authenticated/programs/$id/performance')

export function ModelSelector() {
  const navigate = route.useNavigate()
  const search = route.useSearch()

  const { data: models = [], isLoading } = useModelsQuery({ includeGT: true })

  const handleModelChange =
    (modelType: 'model_one' | 'model_two') => (value: string) => {
      const selectedModelId = parseInt(value)
      const otherModel =
        modelType === 'model_one' ? search.model_two : search.model_one

      // Check if trying to select the same model as the other model
      if (selectedModelId === otherModel) {
        toast.warning('Cannot select the same model', {
          description: 'Please select two different models to compare.',
        })
        return
      }

      navigate({
        search: (prev) => ({
          ...prev,
          [modelType]: selectedModelId,
        }),
      })
    }

  if (isLoading) {
    return (
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4'>
        <div className='flex flex-col gap-2'>
          <Label>Model 1</Label>
          <div className='bg-muted h-10 w-48 animate-pulse rounded-md' />
        </div>
        <div className='flex flex-col gap-2'>
          <Label>Model 2</Label>
          <div className='bg-muted h-10 w-48 animate-pulse rounded-md' />
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4'>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='model-one-select'>Model 1</Label>
        <Select
          value={String(search.model_one)}
          onValueChange={handleModelChange('model_one')}
        >
          <SelectTrigger id='model-one-select' className='w-48'>
            <SelectValue placeholder='Select Model 1' />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.model_id} value={String(model.model_id)}>
                {model.name || `Model ${model.model_id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='model-two-select'>Model 2</Label>
        <Select
          value={String(search.model_two)}
          onValueChange={handleModelChange('model_two')}
        >
          <SelectTrigger id='model-two-select' className='w-48'>
            <SelectValue placeholder='Select Model 2' />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.model_id} value={String(model.model_id)}>
                {model.name || `Model ${model.model_id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
