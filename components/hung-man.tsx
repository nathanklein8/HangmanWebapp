import { useTheme } from "next-themes";
import * as React from "react";
const HungMan = (props: {
  size: number, gameState: number,
}) => {
  const { theme = "dark" } = useTheme()
  const color = (theme == "dark") ? "#F5F5F5" : "#202020"

  const head = <circle cx={18} cy={9} r={4} stroke={color} strokeWidth={2} key={0}/>
  const torso = <path d="M18 13V24" stroke={color} strokeWidth={2} key={1}/>
  const leftArm = <path d="M18 15L14 20" stroke={color} strokeWidth={2} key={2}/>
  const rightArm = <path d="M18 15L22 20" stroke={color} strokeWidth={2} key={3}/>
  const leftLeg = <path d="M18 23V23.5279C18 23.8384 17.9277 24.1446 17.7889 24.4223L15 30" stroke={color} strokeWidth={2} key={4}/>
  const rightLeg = <path d="M18 24L21 30" stroke={color} strokeWidth={2} key={5}/>

  const bodyParts = [head, torso, leftArm, rightArm, leftLeg, rightLeg]

  return (
    <svg width={props.size} height={props.size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_0_1)">
        <path d="M6 35H3M0 35H3M3 35V3C3 1.89543 3.89543 1 5 1H31C32.1046 1 33 1.89543 33 3V35M33 35H36H32.5M33 35H32.5M29 35H32.5" stroke={color} strokeWidth="2" />
        <path d="M18 1V5" stroke={color} strokeWidth="2" />
      </g>
      {bodyParts.map((part) => {
        if (Number.parseInt(part.key!) < props.gameState) {
          return part
        }
      })}
    </svg>
  )

}
export default HungMan;
