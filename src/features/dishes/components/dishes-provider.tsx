import React, { useState } from 'react'
import { type Dish } from '../data/schema'

type DishesDialogType = 'delete' | 'import' | null

interface DishesContextType {
  open: DishesDialogType
  setOpen: (str: DishesDialogType) => void
  currentRow: Dish | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Dish | null>>
}

const DishesContext = React.createContext<DishesContextType | null>(null)

interface DishesProviderProps {
  children: React.ReactNode
}

export function DishesProvider({ children }: DishesProviderProps) {
  const [open, setOpen] = useState<DishesDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Dish | null>(null)

  return (
    <DishesContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </DishesContext.Provider>
  )
}

export function useDishes() {
  const context = React.useContext(DishesContext)

  if (!context) {
    throw new Error('useDishes must be used within a DishesProvider')
  }

  return context
}
