import { useState } from "react"
import { MeshGradient, DotOrbit } from "@paper-design/shaders-react"

export default function AnimatedBackground() {
  const [speed] = useState(1.0)
  const [intensity] = useState(1.5)

  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden">
      <MeshGradient
        className="w-full h-full absolute inset-0"
        colors={["#000000", "#1a1a1a", "#333333", "#ffffff"]}
        speed={speed}
        backgroundColor="#000000"
      />

      <div className="w-full h-full absolute inset-0 opacity-60">
        <DotOrbit
          className="w-full h-full"
          dotColor="#333333"
          orbitColor="#1a1a1a"
          speed={speed * 1.5}
          intensity={intensity * 0.8}
        />
      </div>
    </div>
  )
}