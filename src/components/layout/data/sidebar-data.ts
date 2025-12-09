import { ListTodo, AudioWaveform } from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  programs: [
    {
      name: 'Food Nutrition',
      logo: AudioWaveform,
    },
  ],
  navGroups: [
    {
      title: 'Dishes Management',
      items: [
        {
          title: 'Dishes',
          url: '/dishes',
          icon: ListTodo,
        },
        {
          title: 'Dishes-Similarity',
          url: '/dishes/similarity',
          icon: ListTodo,
        },
      ],
    },
  ],
}
