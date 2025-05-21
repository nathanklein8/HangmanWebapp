"use client"

import { failState } from "@/data/data";
import { useTheme } from "next-themes";
import * as React from "react";
import { useState, useEffect } from "react";

const HungMan = (props: {
  size: number,
  numIncorrect: number,
  strokeWidth: number
}) => {

  const { resolvedTheme } = useTheme()

  const themeColor = resolvedTheme === "dark"
    ? "#EFEFEF"
    : "#101010"

  const [bodyColor, setBodyColor] = useState<string>(themeColor)

  useEffect(() => {
    if (props.numIncorrect == failState) {
      setTimeout(() => {
        // need a slight delay so that when the last limb
        // appears, it's color is white, then will
        // appropriately fade to red
        setBodyColor("#d42a2a")
      }, 100)
    } else if (props.numIncorrect == 0) {
      setBodyColor(themeColor)
    }
  }, [props.numIncorrect])


  const head = <circle
    cx={18} cy={9} r={4} key={0}
    className="animated-path animate-draw-line-fast"
    transform="rotate(-90, 18, 9)"
    stroke={bodyColor} />
  const torso = <path d="M18 13V24" key={1}
    className="animated-path animate-draw-line"
    stroke={bodyColor} />
  const leftArm = <path d="M18 15L14 20" key={2}
    className="animated-path animate-draw-line"
    stroke={bodyColor} />
  const rightArm = <path d="M18 15L22 20" key={3}
    className="animated-path animate-draw-line"
    stroke={bodyColor} />
  const leftLeg = <path d="M18 23V23.5279C18 23.8384 17.9277 24.1446 17.7889 24.4223L15 30" key={4}
    className="animated-path animate-draw-line"
    stroke={bodyColor} />
  const rightLeg = <path d="M18 24L21 30" key={5}
    className="animated-path animate-draw-line"
    stroke={bodyColor} />

  const bodyParts = [head, torso, leftArm, rightArm, leftLeg, rightLeg]

  return (
    <div className="flex flex-row justify-center">
      <svg
        width={props.size}
        height={props.size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        strokeLinecap="round"
        stroke={themeColor}
        strokeWidth={props.strokeWidth}
      >
        <path d="M2 34H5M8 34H5M34 34H31M28 34H31M31 34V4C31 2.89543 30.1046 2 29 2H7C5.89543 2 5 2.89543 5 4V34" />
        <path d="M18 3V4.8" />
        {bodyParts.map((part) => {
          if (Number.parseInt(part.key!) < props.numIncorrect) {
            return part
          }
        })}
      </svg>
    </div>
  )

}
export default HungMan;
