import { Dispatch, SetStateAction } from 'react'
import { Exports } from '../states/Exports'

export type ExportsState = [Exports, Dispatch<SetStateAction<Exports>>]
