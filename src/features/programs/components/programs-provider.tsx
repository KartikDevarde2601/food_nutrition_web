import React, { useState } from 'react'
import { type Program } from '../data/schema'

type ProgramsDialogType = 'create' | 'edit' | 'delete' | null

interface ProgramsContextType {
  open: ProgramsDialogType
  setOpen: (str: ProgramsDialogType) => void
  currentRow: Program | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Program | null>>
}

const ProgramsContext = React.createContext<ProgramsContextType | null>(null)

interface ProgramsProviderProps {
  children: React.ReactNode
}

export function ProgramsProvider({ children }: ProgramsProviderProps) {
  const [open, setOpen] = useState<ProgramsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Program | null>(null)

  return (
    <ProgramsContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </ProgramsContext.Provider>
  )
}

export function usePrograms() {
  const context = React.useContext(ProgramsContext)

  if (!context) {
    throw new Error('usePrograms must be used within a ProgramsProvider')
  }

  return context
}
