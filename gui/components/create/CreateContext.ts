import { createContext, Dispatch, SetStateAction, Context } from 'react'

export type TCreateContext = [string, Dispatch<SetStateAction<string>>]

const CreateContext = (createContext as Function)() as Context<TCreateContext>

export default CreateContext
