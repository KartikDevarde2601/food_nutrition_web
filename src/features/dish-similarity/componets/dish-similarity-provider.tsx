import React, { useState } from 'react'
import { TransformedDish } from '../data/schema'

type DishSimilarityDialogType = 'create' | 'edit' | 'delete' | null

interface DishSimilarityContextType {
  open: DishSimilarityDialogType
  setOpen: (str: DishSimilarityDialogType) => void
  currentRow: TransformedDish | null
  setCurrentRow: React.Dispatch<React.SetStateAction<TransformedDish | null>>
}

const DishSimilarityContext =
  React.createContext<DishSimilarityContextType | null>(null)

interface DishesProviderProps {
  children: React.ReactNode
}

export function DishesSimilarityProvider({ children }: DishesProviderProps) {
  const [open, setOpen] = useState<DishSimilarityDialogType>(null)
  const [currentRow, setCurrentRow] = useState<TransformedDish | null>(null)

  return (
    <DishSimilarityContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </DishSimilarityContext.Provider>
  )
}

export function useDishesSimilarity() {
  const context = React.useContext(DishSimilarityContext)

  if (!context) {
    throw new Error('useDishesSimilarity must be used within a DishesSimilarityProvider')
  }

  return context
}
