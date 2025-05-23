import React, { FC } from 'react'

const CanvideoSvg: FC = () => (
  <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="point-gradient">
        <stop offset="0%" stopColor="black" />
        <stop offset="100%" stopColor="white" />
      </radialGradient>

      {/* Grid Mask For Triangle */}
      <mask id="grid">
        {/* By default it should be filled */}
        <rect width="1000" height="1000" fill="white" />

        {/* Gruadual fill */}
        <circle cx="500" cy="350" r="200" fill="url(#point-gradient)" />

        {/* Add lines of transparentness */}
        <g stroke="black" strokeWidth="10">
          {/* Vertical Lines */}
          <line x1="400" x2="400" y1="0" y2="1000" />
          <line x1="450" x2="450" y1="0" y2="1000" />
          <line x1="500" x2="500" y1="0" y2="1000" />
          <line x1="550" x2="550" y1="0" y2="1000" />
          <line x1="600" x2="600" y1="0" y2="1000" />
          <line x1="650" x2="650" y1="0" y2="1000" />
          <line x1="700" x2="700" y1="0" y2="1000" />
          <line x1="750" x2="750" y1="0" y2="1000" />

          {/* Horizontal Lines */}
          <line x1="0" x2="1000" y1="300" y2="300" />
          <line x1="0" x2="1000" y1="350" y2="350" />
          <line x1="0" x2="1000" y1="400" y2="400" />
          <line x1="0" x2="1000" y1="450" y2="450" />
          <line x1="0" x2="1000" y1="500" y2="500" />
          <line x1="0" x2="1000" y1="550" y2="550" />
          <line x1="0" x2="1000" y1="600" y2="600" />
          <line x1="0" x2="1000" y1="650" y2="650" />
        </g>
      </mask>

      {/* Point Mask For Point Currently Being Drawn */}
      <mask id="point">
        {/* Filled Background */}
        <rect width="1000" height="1000" fill="white" />

        {/* No Aim Zone */}
        <circle cx="586.602541" cy="400" r="15" fill="black" />

        {/* Don't Cut Up C */}
        {/* C */}
        <g strokeWidth="100" fill="none" strokeLinecap="round" stroke="black" opacity="0.5">
          <path d="M819.5,819.5 A450,450,0,1,1,819.5,180.5" />
        </g>
      </mask>
    </defs>

    {/* C */}
    <g strokeWidth="100" fill="none" strokeLinecap="round">
      {/* dodgerBlue */}
      <path d="M180.5,180.5 A450,450,0,0,1,819.5,180.5" stroke="dodgerBlue" />
      {/* (mediumSeaGreen * 2 + dogderBlue) / 3 */}
      <path d="M180.5,819.5 A450,450,0,0,1,180.5,180.5" stroke="#32a7a0" />
      {/* mediumSeaGreen */}
      <path d="M819.5,819.5 A450,450,0,0,1,180.5,819.5" stroke="mediumSeaGreen" />
    </g>

    {/* Laser */}
    <polyline strokeLinecap="round" points="413.39746,300,413.39746,700,759.807621,500,586.602541,400" fill="none"
      stroke="red" strokeWidth="10" />

    {/* Laser Aimer */}
    <g strokeWidth="5" stroke="red" mask="url(#point)">
      <line x1="586.602541" x2="586.602541" y1="0" y2="1000" />
      <line x1="0" x2="1000" y1="400" y2="400" />
    </g>

    {/* Triangle */}
    {/* The Center of gravity is 500, 5000 */}
    <polygon points="413.39746,300 413.39746,700 759.807621,500" fill="red" opacity="1" mask="url(#grid)" />
  </svg>
)

export default CanvideoSvg
