import { createFileRoute } from '@tanstack/react-router'
import { ProgramLayout } from '@/components/layout/program-layout'

export const Route = createFileRoute('/_authenticated/programs/$id')({
    component: ProgramLayout,
})


