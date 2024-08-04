import Confetti from 'react-dom-confetti';

interface CustomConfettiProps {
    active: boolean
}

export function CustomConfetti(props:CustomConfettiProps) {

  return (
    <div className="absolute inset-0 w-4 h-4 mx-auto">
        <Confetti active={props.active} config={{
          angle: 270,
          spread: 360,
          stagger: 3,
          startVelocity: 20,
          dragFriction: 0.07,
          duration: 8000,
          elementCount: 100
        }} />
        <Confetti active={props.active} config={{
          angle: 270,
          spread: 360,
          stagger: 3,
          startVelocity: 20,
          dragFriction: 0.2,
          duration: 8000,
          elementCount: 25
        }} />
      </div>
  )
}
