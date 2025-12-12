import { CheckCircle2, Percent, Sigma, Activity, Database } from 'lucide-react'
import { MetricCard } from '@/components/metric-card'
import { Skeleton } from '@/components/ui/skeleton'
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
        title: 'MAE',
        icon: Sigma,
        getValue: (m) => m.MAE.toFixed(2),
        description: 'Mean absolute error',
    },
    {
        title: 'RMSE',
        icon: Activity,
        getValue: (m) => m.RMSE.toFixed(2),
        description: 'Root mean squared error',
    },
    {
        title: 'Unique Dishes',
        icon: Database,
        getValue: (m) => m.totalUniqueDishes,
        description: 'Total unique dishes',
    },
]



export function OverallMetricsDisplay({ metrics, isLoading }: OverallMetricsDisplayProps) {
    if (!isLoading && !metrics) {
        return (
            <div className='flex h-32 items-center justify-center rounded-md border border-dashed'>
                <p className='text-sm text-muted-foreground'>
                    Please reload or select two different models for comparison
                </p>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5'>
            {metricsConfig.map((metric) => (
                <MetricCard
                    key={metric.title}
                    title={metric.title}
                    icon={metric.icon}
                    isLoading={isLoading}
                    content={
                        <div>
                            {isLoading ? (
                                <Skeleton className='h-8 w-16 mb-1' />
                            ) : (
                                <div className='text-2xl font-bold'>{metrics ? metric.getValue(metrics) : undefined}</div>
                            )}
                            <div className='text-sm text-muted-foreground'>{metric.description}</div>
                        </div>
                    }

                />
            ))}
        </div>
    )
}
