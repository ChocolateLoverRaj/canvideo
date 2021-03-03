import { renderToString } from 'react-dom/server'
import { join } from 'path'
import CanvideoSvg from '../dist/index'
import { writeFileSync } from 'fs'
import React from 'react'

global.React = React

const svg = renderToString(<CanvideoSvg />)

writeFileSync(join(__dirname, '../dist/logo.svg'), svg)
