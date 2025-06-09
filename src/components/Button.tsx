import React, { CSSProperties } from 'react'
import ScaleLoader from 'react-spinners/ScaleLoader'

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'red'
}

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  loading?: boolean
  style?: React.CSSProperties
}
export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  disabled = false,
  loading = false,
  style
}) => {
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center w-full"
      onClick={onClick}
      disabled={loading}
    >
      <>
        {loading ? (
          <ScaleLoader
            color={'#ffffff'}
            loading={true}
            cssOverride={override}
            width={5}
            height={15}
            barCount={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : (
          children
        )}
        {/* {!loading && children} */}
      </>
    </button>
  )
}
