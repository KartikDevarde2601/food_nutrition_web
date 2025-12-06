import { useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    flexRender,
} from '@tanstack/react-table'
import { Card } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { usePerformanceMatrixQuery } from '@/hooks/performance/use-performance-matrix-query'
import { useModelsQuery } from '@/hooks/programs/use-models-query'
import { usePerformance } from './performance-provider'
import { getRouteApi } from '@tanstack/react-router'


export function MetricMatrixTable() {
    const route = getRouteApi('/_authenticated/performance/')
    const search = route.useSearch()
    const { activeMetric, dateRange, groupSimilarMeals } = usePerformance()

    // Fetch Matrix Data
    const { data: matrixData, isLoading: isMatrixLoading } = usePerformanceMatrixQuery({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        groupSimilar: groupSimilarMeals,
        programs: search.program_id,
        meals: search.meal_ids,
    })

    // Fetch Models for Names
    const { data: models = [], isLoading: isModelsLoading } = useModelsQuery()

    const modelNameMap = useMemo(() => {
        const map: Record<string, string> = {}
        models.forEach((m) => {
            // @ts-ignore - model_name might be missing in type definition but present in API
            map[String(m.model_id)] = m.model_name || m.name || `Model ${m.model_id}`
        })
        return map
    }, [models])

    interface TableRow {
        rowId: string
        data: Record<string, any>
    }

    const columnHelper = createColumnHelper<TableRow>()

    const columns = useMemo(() => {
        if (!matrixData) return []

        // First column: Row Header (Model Name)
        const cols: any[] = [
            columnHelper.accessor('rowId', {
                header: 'Model \\ Model',
                cell: (info) => {
                    const id = info.getValue()
                    return <span className='font-medium'>{modelNameMap[id] || `Model ${id}`}</span>
                },
            }),
        ]

        // Dynamic Columns: One for each Model in columns
        matrixData.cols.forEach((colId: string) => {
            cols.push(
                columnHelper.display({
                    id: colId,
                    header: () => <span>{modelNameMap[colId] || `Model ${colId}`}</span>,
                    cell: (info) => {
                        const rowId = info.row.original.rowId
                        const rowData = info.row.original.data

                        // Handle Diagonal (Same Model)
                        if (rowId === colId) {
                            return <span className="text-muted-foreground">NA</span>
                        }

                        const metrics = rowData[colId]
                        if (!metrics) return <span className="text-muted-foreground">-</span>

                        let value: number | undefined

                        // Handle nested metrics
                        if (activeMetric.startsWith('NMAE.')) {
                            const key = activeMetric.split('.')[1] as string
                            value = metrics.NMAE?.[key]
                        } else if (activeMetric.startsWith('NRMSE.')) {
                            const key = activeMetric.split('.')[1] as string
                            value = metrics.NRMSE?.[key]
                        } else {
                            value = metrics[activeMetric as keyof typeof metrics] as number
                        }

                        if (value === undefined) return <span>-</span>

                        return <span>{typeof value === 'number' ? value.toFixed(2) : value}</span>
                    },
                })
            )
        })

        return cols
    }, [matrixData, activeMetric, modelNameMap])

    const tableData = useMemo(() => {
        if (!matrixData) return []
        return matrixData.rows.map((rowId: string): TableRow => ({
            rowId,
            data: matrixData.data[rowId] || {},
        }))
    }, [matrixData])

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (isMatrixLoading || isModelsLoading) {
        return (
            <Card className='p-4'>
                <div className='overflow-hidden rounded-md border'>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className='whitespace-nowrap'
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Loading matrix...
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </Card>
        )
    }

    return (
        <div className='overflow-hidden rounded-md border'>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className='whitespace-nowrap'
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} className='whitespace-nowrap'>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

    )
}
