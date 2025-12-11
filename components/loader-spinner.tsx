import type { SVGProps } from "react"

interface LoaderSpinnerProps extends SVGProps<SVGSVGElement> {
  trackActiveColor?: string
  trackColor?: string
}

const LoaderSpinner = ({
  trackActiveColor = "var(--gray-1000)",
  trackColor = "var(--alpha-15)",
  ...props
}: LoaderSpinnerProps) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke={trackColor}
      strokeWidth="3"
      fill="none"
    />
    <path
      d="M12 2a10 10 0 0 1 10 10"
      stroke={trackActiveColor}
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    >
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 12 12"
        to="360 12 12"
        dur="1s"
        repeatCount="indefinite"
      />
    </path>
  </svg>
)

export default LoaderSpinner
