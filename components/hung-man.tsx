"use client"

import { useTheme } from "next-themes";
import * as React from "react";
const HungMan = (props: {
  size: number, gameState: number,
}) => {
  const { theme = "dark" } = useTheme()
  const color = (theme == "dark") ? "#F5F5F5" : "#313131"

  const head = <circle cx={18} cy={9} r={4} key={0} className="animated-path animate-draw-line"/>
  const torso = <path d="M18 13V24" key={1} className="animated-path animate-draw-line"/>
  const leftArm = <path d="M18 15L14 20" key={2} className="animated-path animate-draw-line"/>
  const rightArm = <path d="M18 15L22 20" key={3} className="animated-path animate-draw-line"/>
  const leftLeg = <path d="M18 23V23.5279C18 23.8384 17.9277 24.1446 17.7889 24.4223L15 30" key={4} className="animated-path animate-draw-line"/>
  const rightLeg = <path d="M18 24L21 30" key={5} className="animated-path animate-draw-line"/>

  const bodyParts = [head, torso, leftArm, rightArm, leftLeg, rightLeg]

  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeLinecap="round"
      stroke={color}
      strokeWidth={2}
      
    >
      <path d="M2 34H5M8 34H5M34 34H31M28 34H31M31 34V4C31 2.89543 30.1046 2 29 2H7C5.89543 2 5 2.89543 5 4V34" />
      <path d="M18 3V4.5" />
      {bodyParts.map((part) => {
        if (Number.parseInt(part.key!) < props.gameState) {
          return part
        }
      })}
    </svg>
  )

}
export default HungMan;
