import React, { useState } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { type Meal } from '../data/schema'

type MealsDialogType = 'create' | 'update' | 'delete' | 'import'

type MealsContextType = {
  open: MealsDialogType | null
  setOpen: (str: MealsDialogType | null) => void
  currentRow: Meal | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Meal | null>>
}

const MealsContext = React.createContext<MealsContextType | null>(null)

export function MealsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<MealsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Meal | null>(null)

  return (
    <MealsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </MealsContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMeals = () => {
  const mealsContext = React.useContext(MealsContext)

  if (!mealsContext) {
    throw new Error('useMeals has to be used within <MealsContext>')
  }

  return mealsContext
}
