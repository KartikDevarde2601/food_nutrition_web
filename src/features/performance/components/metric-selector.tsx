import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { usePerformance } from '../context/performance-provider'

export function MetricSelector() {
  const { activeMetric, setActiveMetric } = usePerformance()

  return (
    <div className='flex items-center space-x-2'>
      <Select value={activeMetric} onValueChange={setActiveMetric}>
        <SelectTrigger>
          <SelectValue placeholder='Select Metric' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='#cMeals'># MEALS</SelectItem>
          <SelectItem value='%cMeals'>% DISHES MATCH</SelectItem>
          <SelectItem value='MAE'>MAE (g)</SelectItem>
          <SelectItem value='RMSE'>RMSE (g)</SelectItem>
          <SelectItem value='MAPE'>MAPE (%)</SelectItem>
          <SelectItem value='NMAE.protein'>NMAE (Protein) (g)</SelectItem>
          <SelectItem value='NMAE.fat'>NMAE (Fat) (g)</SelectItem>
          <SelectItem value='NMAE.carbs'>NMAE (Carbs) (g)</SelectItem>
          <SelectItem value='NRMSE.protein'>NRMSE (Protein) (g)</SelectItem>
          <SelectItem value='NRMSE.fat'>NRMSE (Fat) (g)</SelectItem>
          <SelectItem value='NRMSE.carbs'>NRMSE (Carbs) (g)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
