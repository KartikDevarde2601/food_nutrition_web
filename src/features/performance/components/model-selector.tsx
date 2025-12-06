import { getRouteApi } from '@tanstack/react-router'
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select'
import { useModelsQuery } from '@/hooks/programs/use-models-query'
import { Label } from '@/components/ui/label'

const route = getRouteApi('/_authenticated/performance/')

export function ModelSelector() {
    const navigate = route.useNavigate()
    const search = route.useSearch()

    const { data: models = [], isLoading } = useModelsQuery()

    const handleModelOneChange = (value: string) => {
        navigate({
            search: (prev) => ({
                ...prev,
                model_one: parseInt(value),
            }),
        })
    }

    const handleModelTwoChange = (value: string) => {
        navigate({
            search: (prev) => ({
                ...prev,
                model_two: parseInt(value),
            }),
        })
    }

    if (isLoading) {
        return (
            <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4'>
                <div className='flex flex-col gap-2'>
                    <Label>Model 1</Label>
                    <div className='h-10 w-48 animate-pulse rounded-md bg-muted' />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label>Model 2</Label>
                    <div className='h-10 w-48 animate-pulse rounded-md bg-muted' />
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
                    onValueChange={handleModelOneChange}
                >
                    <SelectTrigger id='model-one-select' className='w-48'>
                        <SelectValue placeholder='Select Model 1' />
                    </SelectTrigger>
                    <SelectContent>
                        {models
                            .filter((model) => Number(model.model_id) !== search.model_two)
                            .map((model) => (
                                <SelectItem
                                    key={model.model_id}
                                    value={String(model.model_id)}
                                >
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
                    onValueChange={handleModelTwoChange}
                >
                    <SelectTrigger id='model-two-select' className='w-48'>
                        <SelectValue placeholder='Select Model 2' />
                    </SelectTrigger>
                    <SelectContent>
                        {models
                            .filter((model) => Number(model.model_id) !== search.model_one)
                            .map((model) => (
                                <SelectItem
                                    key={model.model_id}
                                    value={String(model.model_id)}
                                >
                                    {model.name || `Model ${model.model_id}`}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
