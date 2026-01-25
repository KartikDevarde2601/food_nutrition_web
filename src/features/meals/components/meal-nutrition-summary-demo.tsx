import { Egg, Flame, Nut, Wheat } from 'lucide-react'

interface DemoNutritionData {
    calories: number
    protein: number
    carbs: number
    fat: number
}

interface MealNutritionSummaryDemoProps {
    title?: string
    type: 'user' | 'ai'
    data?: DemoNutritionData
}

// Dummy data for testing layouts
const DUMMY_USER_DATA: DemoNutritionData = {
    calories: 542,
    protein: 28,
    carbs: 65,
    fat: 18
}

const DUMMY_AI_DATA: DemoNutritionData = {
    calories: 498,
    protein: 32,
    carbs: 58,
    fat: 15
}

export function MealNutritionSummaryDemo({ title, type, data }: MealNutritionSummaryDemoProps) {
    const nutritionData = data || (type === 'user' ? DUMMY_USER_DATA : DUMMY_AI_DATA)

    const stats = [
        {
            name: 'Calories',
            value: Math.round(nutritionData.calories) + ' kcal',
            icon: Flame,
            color: 'text-orange-500'
        },
        {
            name: 'Protein',
            value: Math.round(nutritionData.protein) + 'g',
            icon: Egg,
            color: 'text-red-500'
        },
        {
            name: 'Carbs',
            value: Math.round(nutritionData.carbs) + 'g',
            icon: Wheat,
            color: 'text-amber-500'
        },
        {
            name: 'Fat',
            value: Math.round(nutritionData.fat) + 'g',
            icon: Nut,
            color: 'text-green-500'
        }
    ]

    return (
        <div className="w-full">
            {title && <h3 className="text-xs font-semibold mb-2 text-muted-foreground/70 uppercase tracking-wider">{title}</h3>}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <div key={i} className="flex items-center gap-2.5 bg-muted/40 px-4 py-2 rounded-xl border border-border/40 w-full">
                            <div className="flex items-center justify-center w-8 h-8 flex-shrink-0 rounded-lg bg-background shadow-sm border border-border/50">
                                <Icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                            <div className="flex flex-col min-w-0 py-0.5">
                                <span className="text-[11px] font-semibold text-muted-foreground/80 leading-tight truncate">{stat.name}</span>
                                <span className="text-[15px] font-bold tracking-tight leading-tight">{stat.value}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
