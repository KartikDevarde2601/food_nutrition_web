import { Card, CardHeader, CardTitle } from "./ui/card"
import { Skeleton } from "./ui/skeleton"
import { CardContent } from "./ui/card"


export function MetricCard({
    title,
    icon: Icon,
    isLoading,
    content,
}: {
    title: string
    icon: React.ElementType
    value?: string | number
    isLoading?: boolean
    content: React.ReactNode
}) {
    return (
        <Card className='gap-3'>
            <CardHeader className='flex flex-row items-center  space-y-0 pb-2'>
                {isLoading ? (
                    <Skeleton className='h-4 w-4 rounded-full' />
                ) : (
                    <Icon className='h-4 w-4 mr-2 text-muted-foreground' />
                )}
                <CardTitle className='text-sm font-medium'>
                    {isLoading ? (
                        <Skeleton className='h-4 w-24' />
                    ) : (
                        title
                    )}
                </CardTitle>

            </CardHeader>
            <CardContent>
                {content}
            </CardContent>
        </Card>
    )
}