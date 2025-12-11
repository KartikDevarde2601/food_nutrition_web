import { createFileRoute } from '@tanstack/react-router'
import { useProgramQuery } from '@/hooks/programs/use-programs-query'
import { ProgramsDialogs } from '@/features/programs/components/programs-dialogs'
import { ProgramsProvider } from '@/features/programs/components/programs-provider'
import { ProgramDetailsComponent } from '@/features/programs/components/programs-details-page'

export const Route = createFileRoute('/_authenticated/programs/$id/')({
    component: ProgramDetails,
})

function ProgramDetailsContent() {
    const { id } = Route.useParams()
    const { data: program, isLoading, isError } = useProgramQuery(id)

    if (isLoading) return <div>Loading...</div>
    if (isError || !program) return <div>Program not found</div>

    return (
        <>
            <ProgramDetailsComponent program={program} />
            <ProgramsDialogs />
        </>


    )
}

export function ProgramDetails() {
    return (
        <ProgramsProvider>
            <ProgramDetailsContent />
        </ProgramsProvider>
    )
}
