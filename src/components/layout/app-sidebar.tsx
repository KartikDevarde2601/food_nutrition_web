import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AudioWaveform } from 'lucide-react'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { useProgramsQuery } from '@/hooks/programs/use-programs-query'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { data: programs = [] } = useProgramsQuery()

  // Transform programs into sidebar format
  const programsGroup = {
    title: 'Programs Management',
    items: programs.map((program) => ({
      title: program.name,
      icon: AudioWaveform,
      items: [
        {
          title: 'Meals',
          url: `/meals?program_id=${program.program_id}`,
        },
        {
          title: 'Performance',
          url: `/performance?model_one=1&model_two=2&program_id=${program.program_id}&groupSimilarDishes=1&groupSimilarMeals=1`,
        },
      ],
    })),
  }

  // Merge static navGroups with dynamic programs group
  // Filtering out existing "Programs Management" if it exists to avoid duplicates/confusion, 
  // or we could just append. 
  // The user requirement implies listing them "using" the hook, likely replacing the static placeholder.
  const staticGroups = sidebarData.navGroups.filter(
    (group) => group.title !== 'Programs Management'
  )
  const navGroups = [...staticGroups, programsGroup]

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
