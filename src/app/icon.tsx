import { ImageResponse } from 'next/og'

export const runtime = 'edge'
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
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '24%',
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="black"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12Z" />
          <circle cx="12" cy="9" r="2.5" fill="white" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
