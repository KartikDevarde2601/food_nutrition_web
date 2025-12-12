import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import { ListOrdered, Calendar, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Main } from '@/components/layout/main'
import { ProgramDetail } from '../data/schema'
import { MetricCard } from '@/components/metric-card'

interface ProgramDetailsContentProps {
    program: ProgramDetail
}

export function ProgramDetailsComponent({ program }: ProgramDetailsContentProps) {
    const navigate = useNavigate()

    return (
        <Main className="flex flex-1 flex-col gap-6 sm:gap-8">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{program.name}</h1>
                            <p className="text-muted-foreground">Program Information</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => navigate({
                            to: `/programs/${program.program_id}/meals`,
                        })}
                    >
                        View Meal
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            const defaultModelId = Number(program.default_model?.model_id) || 1
                            navigate({
                                to: `/programs/${program.program_id}/performance`,
                                search: {
                                    model_one: defaultModelId,
                                    model_two: defaultModelId === 2 ? 1 : 2,
                                }
                            })
                        }}
                    >
                        Performance
                    </Button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Left Section */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Description */}
                    <Card>
                        <CardHeader className="flex flex-row items-center ">
                            <Info className="h-5 w-5 mr-2 text-muted-foreground" />
                            <CardTitle>Program Description</CardTitle>

                        </CardHeader>
                        <CardContent className="ml-8">
                            <p className="text-muted-foreground leading-relaxed">
                                {program.description}
                            </p>
                        </CardContent>
                    </Card>


                    {/* STATISTICS ROW: Meals, Dishes & Date Information */}
                    <div className="grid gap-4 lg:grid-cols-3">
                        <MetricCard
                            title="Dishes"
                            icon={ListOrdered}
                            content={
                                <div>
                                    <div className="text-2xl font-bold">
                                        {program.dishes || 0}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        # of total dishes
                                    </p>
                                </div>
                            }
                        />

                        <MetricCard
                            title="Meals"
                            icon={ListOrdered}
                            content={
                                <div>
                                    <div className="text-2xl font-bold">
                                        {program._count.meals || 0}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        # of total meals
                                    </p>
                                </div>
                            }
                        />

                        <MetricCard
                            title="Date Information"
                            icon={Calendar}
                            content={
                                <div>
                                    {program.last_created_meal && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Earliest Date</span>
                                            <span className="font-medium">
                                                {format(new Date(program.last_created_meal), 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                    )}

                                    {program.last_updated_meal && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Latest Date</span>
                                            <span className="font-medium">
                                                {format(new Date(program.last_updated_meal), 'MMM dd, yyyy')}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            }
                        />
                    </div>
                </div>

                {/* Right Section: Model Info */}
                <Card className="space-y-4 p-6">
                    <CardHeader>
                        <CardTitle>Default Model</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {program.default_model?.model_id ? (
                            <div className="space-y-3">
                                <div>
                                    <p className="text-muted-foreground text-sm">Model Name</p>
                                    <p className="font-medium">{program.default_model.name}</p>
                                </div>

                                <div>
                                    <p className="text-muted-foreground text-sm">Description</p>
                                    <p className="text-sm leading-relaxed">{program.default_model.description}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-sm">No default model assigned</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Main>
    )
}
