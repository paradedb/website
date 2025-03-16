import React from "react"

export default function DuckdbLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 300 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_72_461)">
        <mask
          id="mask0_72_461"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="300"
          height="300"
        >
          <path d="M300 0H0V300H300V0Z" fill="white" />
        </mask>
        <g mask="url(#mask0_72_461)">
          <path
            d="M150 298C68.147 298 2 231.854 2 150C2 68.146 68.147 2 150 2C231.854 2 298 68.146 298 150C298 231.854 231.854 298 150 298Z"
            fill="black"
          />
          <path
            d="M57.877 150C57.877 183.828 85.363 211.314 119.191 211.314C153.02 211.314 180.505 183.828 180.505 150C180.505 116.172 153.02 88.686 119.191 88.686C85.363 88.686 57.877 116.172 57.877 150Z"
            fill="#FFF000"
          />
          <path
            d="M229.134 127.951H200.138V171.747H229.134C241.216 171.747 251.183 161.779 251.183 149.698C251.183 137.616 241.216 127.951 229.134 127.951Z"
            fill="#FFF000"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_72_461">
          <rect width="300" height="300" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
