import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select'
import { usePerformance } from './performance-provider'

export function MetricSelector() {
    const { activeMetric, setActiveMetric } = usePerformance()

    return (
        <div className="flex items-center space-x-2">
            <Select value={activeMetric} onValueChange={setActiveMetric}>
                <SelectTrigger>
                    <SelectValue placeholder='Select Metric' />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='#cMeals'># Correct Meals</SelectItem>
                    <SelectItem value='%cMeals'>% Correct Meals</SelectItem>
                    <SelectItem value='MAE'>MAE</SelectItem>
                    <SelectItem value='RMSE'>RMSE</SelectItem>
                    <SelectItem value='NMAE.protein'>NMAE (Protein)</SelectItem>
                    <SelectItem value='NMAE.fat'>NMAE (Fat)</SelectItem>
                    <SelectItem value='NMAE.carbs'>NMAE (Carbs)</SelectItem>
                    <SelectItem value='NRMSE.protein'>NRMSE (Protein)</SelectItem>
                    <SelectItem value='NRMSE.fat'>NRMSE (Fat)</SelectItem>
                    <SelectItem value='NRMSE.carbs'>NRMSE (Carbs)</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
