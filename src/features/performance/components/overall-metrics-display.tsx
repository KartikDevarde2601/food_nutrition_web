import {
  CheckCircle2,
  Percent,
  Sigma,
  Activity,
  Database,
  Gauge,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { MetricCard } from '@/components/metric-card'
import { type OverallMetrics } from '../data/schema'

interface OverallMetricsDisplayProps {
  metrics: OverallMetrics | null
  isLoading?: boolean
}

interface MetricConfig {
  title: string
  icon: React.ElementType
  getValue: (metrics: OverallMetrics) => string | number
  description: string
}

const metricsConfig: MetricConfig[] = [
  {
    title: 'Dish Matches',
    icon: CheckCircle2,
    getValue: (m) => m['#dMatch'],
    description: '# of matching dishes',
  },
  {
    title: 'Match Rate',
    icon: Percent,
    getValue: (m) => m['%dMatch'],
    description: '% of dishes matched',
  },
  {
    title: 'MAE (g)',
    icon: Sigma,
    getValue: (m) => m.MAE,
    description: 'Mean absolute error',
  },
  {
    title: 'RMSE (g)',
    icon: Activity,
    getValue: (m) => m.RMSE,
    description: 'Root mean squared error',
  },
  {
    title: 'MAPE (%)',
    icon: Gauge,
    getValue: (m) => m.MAPE,
    description: 'Mean absolute percentage error',
  },
  {
    title: 'Unique Dishes',
    icon: Database,
    getValue: (m) => m.totalUniqueDishes,
    description: 'Total unique dishes',
  },
]

export function OverallMetricsDisplay({
  metrics,
  isLoading,
}: OverallMetricsDisplayProps) {
  if (!isLoading && !metrics) {
    return (
      <div className='flex h-32 items-center justify-center rounded-md border border-dashed'>
        <p className='text-muted-foreground text-sm'>
          Please reload or select two different models for comparison
        </p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6'>
      {metricsConfig.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          icon={metric.icon}
          isLoading={isLoading}
          content={
            <div>
              {isLoading ? (
                <Skeleton className='mb-1 h-8 w-16' />
              ) : (
                <div className='text-2xl font-bold'>
                  {metrics ? metric.getValue(metrics) : undefined}
                </div>
              )}
              <div className='text-muted-foreground text-sm'>
                {metric.description}
              </div>
            </div>
          }
        />
      ))}
    </div>
  )
}
