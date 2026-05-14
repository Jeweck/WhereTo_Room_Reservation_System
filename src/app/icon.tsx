
import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'WhereTo Logo'
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse render element
      <div
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>
          </defs>
          <rect
            x="3"
            y="3"
            width="26"
            height="26"
            rx="8"
            stroke="url(#grad)"
            strokeWidth="2.5"
          />
          <path
            d="M20 10C20 10 12 10 12 16C12 22 20 22 20 16C20 16 20 10 12 10"
            stroke="url(#grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}
