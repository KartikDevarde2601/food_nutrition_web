import * as React from 'react'
import { PlusCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

export type WeightFilterMode = 'less' | 'greater' | 'between'

export type WeightRangeFilterProps = {
    title: string
    min?: number
    max?: number
    step?: number
    unit?: string
    weightFilter: WeightFilterMode
    weightMin: number
    weightMax: number
    onFilterChange: (filter: {
        weightFilter: WeightFilterMode
        weightMin: number
        weightMax: number
    }) => void
}

export function DataTableWeightRangeFilter({
    title,
    min = 0,
    max = 10000,
    step = 100,
    unit = 'g',
    weightFilter,
    weightMin,
    weightMax,
    onFilterChange,
}: WeightRangeFilterProps) {
    const id = React.useId()

    const formatValue = React.useCallback((value: number) => {
        return value.toLocaleString(undefined, { maximumFractionDigits: 0 })
    }, [])

    const handleModeChange = React.useCallback(
        (mode: WeightFilterMode) => {
            onFilterChange({
                weightFilter: mode,
                weightMin: mode === 'less' ? min : weightMin,
                weightMax: mode === 'greater' ? max : weightMax,
            })
        },
        [onFilterChange, weightMin, weightMax, min, max]
    )

    const handleMinChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const numValue = Number(event.target.value)
            if (!Number.isNaN(numValue) && numValue >= min && numValue <= weightMax) {
                onFilterChange({
                    weightFilter,
                    weightMin: numValue,
                    weightMax,
                })
            }
        },
        [onFilterChange, weightFilter, weightMax, min]
    )

    const handleMaxChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const numValue = Number(event.target.value)
            if (!Number.isNaN(numValue) && numValue <= max && numValue >= weightMin) {
                onFilterChange({
                    weightFilter,
                    weightMin,
                    weightMax: numValue,
                })
            }
        },
        [onFilterChange, weightFilter, weightMin, max]
    )

    const handleSliderChange = React.useCallback(
        (values: number[]) => {
            if (weightFilter === 'between' && values.length === 2) {
                onFilterChange({
                    weightFilter,
                    weightMin: values[0],
                    weightMax: values[1],
                })
            } else if (weightFilter === 'less' && values.length === 1) {
                onFilterChange({
                    weightFilter,
                    weightMin: min,
                    weightMax: values[0],
                })
            } else if (weightFilter === 'greater' && values.length === 1) {
                onFilterChange({
                    weightFilter,
                    weightMin: values[0],
                    weightMax: max,
                })
            }
        },
        [onFilterChange, weightFilter, min, max]
    )

    const onReset = React.useCallback(
        (event: React.MouseEvent) => {
            if (event.target instanceof HTMLDivElement) {
                event.stopPropagation()
            }
            onFilterChange({
                weightFilter: 'greater',
                weightMin: 0,
                weightMax: max,
            })
        },
        [onFilterChange, max]
    )

    // Check if filter is active (not at default values)
    const isActive = weightMin !== min || weightMax !== max

    // Get display text
    const getDisplayText = () => {
        switch (weightFilter) {
            case 'less':
                return `< ${formatValue(weightMax)}${unit}`
            case 'greater':
                return `> ${formatValue(weightMin)}${unit}`
            case 'between':
                return `${formatValue(weightMin)} - ${formatValue(weightMax)}${unit}`
        }
    }

    // Get slider value based on mode
    const getSliderValue = (): number[] => {
        switch (weightFilter) {
            case 'less':
                return [weightMax]
            case 'greater':
                return [weightMin]
            case 'between':
                return [weightMin, weightMax]
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-dashed font-normal"
                >
                    {isActive ? (
                        <div
                            role="button"
                            aria-label={`Clear ${title} filter`}
                            tabIndex={0}
                            className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            onClick={onReset}
                        >
                            <XCircle className="size-4" />
                        </div>
                    ) : (
                        <PlusCircle className="size-4" />
                    )}
                    <span>{title}</span>
                    {isActive && (
                        <>
                            <Separator
                                orientation="vertical"
                                className="mx-0.5 data-[orientation=vertical]:h-4"
                            />
                            <span className="text-xs">{getDisplayText()}</span>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <p className="font-medium">{title}</p>
                    </div>

                    {/* Filter Mode Selector */}
                    <div className="space-y-2">
                        <Label htmlFor={`${id}-mode`} className="text-xs text-muted-foreground">
                            Filter type
                        </Label>
                        <Select value={weightFilter} onValueChange={handleModeChange}>
                            <SelectTrigger id={`${id}-mode`} className="h-8">
                                <SelectValue placeholder="Select filter type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="less">Less than</SelectItem>
                                <SelectItem value="greater">Greater than</SelectItem>
                                <SelectItem value="between">Between</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Conditional Input Fields */}
                    <div className="space-y-3">
                        {weightFilter === 'greater' && (
                            <div className="space-y-2">
                                <Label htmlFor={`${id}-min`} className="text-xs text-muted-foreground">
                                    Minimum value
                                </Label>
                                <div className="relative">
                                    <Input
                                        id={`${id}-min`}
                                        type="number"
                                        inputMode="numeric"
                                        placeholder={min.toString()}
                                        min={min}
                                        max={max}
                                        value={weightMin}
                                        onChange={handleMinChange}
                                        className={cn('h-8', unit && 'pr-10')}
                                    />
                                    {unit && (
                                        <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
                                            {unit}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {weightFilter === 'less' && (
                            <div className="space-y-2">
                                <Label htmlFor={`${id}-max`} className="text-xs text-muted-foreground">
                                    Maximum value
                                </Label>
                                <div className="relative">
                                    <Input
                                        id={`${id}-max`}
                                        type="number"
                                        inputMode="numeric"
                                        placeholder={max.toString()}
                                        min={min}
                                        max={max}
                                        value={weightMax}
                                        onChange={handleMaxChange}
                                        className={cn('h-8', unit && 'pr-10')}
                                    />
                                    {unit && (
                                        <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-muted-foreground text-sm">
                                            {unit}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {weightFilter === 'between' && (
                            <div className="flex items-center gap-2">
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor={`${id}-min`} className="text-xs text-muted-foreground">
                                        Min
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id={`${id}-min`}
                                            type="number"
                                            inputMode="numeric"
                                            placeholder={min.toString()}
                                            min={min}
                                            max={weightMax}
                                            value={weightMin}
                                            onChange={handleMinChange}
                                            className={cn('h-8', unit && 'pr-8')}
                                        />
                                        {unit && (
                                            <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-1.5 text-muted-foreground text-xs">
                                                {unit}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className="text-muted-foreground mt-5">–</span>
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor={`${id}-max`} className="text-xs text-muted-foreground">
                                        Max
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id={`${id}-max`}
                                            type="number"
                                            inputMode="numeric"
                                            placeholder={max.toString()}
                                            min={weightMin}
                                            max={max}
                                            value={weightMax}
                                            onChange={handleMaxChange}
                                            className={cn('h-8', unit && 'pr-8')}
                                        />
                                        {unit && (
                                            <span className="absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-1.5 text-muted-foreground text-xs">
                                                {unit}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Slider */}
                        <div className="pt-2">
                            <Label htmlFor={`${id}-slider`} className="sr-only">
                                {title} slider
                            </Label>
                            <Slider
                                id={`${id}-slider`}
                                min={min}
                                max={max}
                                step={step}
                                value={getSliderValue()}
                                onValueChange={handleSliderChange}
                            />
                            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                <span>{formatValue(min)}{unit}</span>
                                <span>{formatValue(max)}{unit}</span>
                            </div>
                        </div>
                    </div>

                    {/* Clear Button */}
                    <Button
                        aria-label={`Clear ${title} filter`}
                        variant="outline"
                        size="sm"
                        onClick={onReset}
                        className="w-full"
                    >
                        Clear filter
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
