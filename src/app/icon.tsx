
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
          <rect x="0" y="0" width="32" height="32" rx="9" fill="white" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 6C12.6863 6 10 8.68629 10 12C10 16.5 16 26 16 26C16 26 22 16.5 22 12C22 8.68629 19.3137 6 16 6ZM16 14.5C14.6193 14.5 13.5 13.3807 13.5 12C13.5 10.6193 14.6193 9.5 16 9.5C17.3807 9.5 18.5 10.6193 18.5 12C18.5 13.3807 17.3807 14.5 16 14.5Z"
            fill="black"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
