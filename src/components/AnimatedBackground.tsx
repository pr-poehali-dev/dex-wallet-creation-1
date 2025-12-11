import { useState } from "react"
import { MeshGradient } from "@paper-design/shaders-react"

export default function AnimatedBackground() {
  const [speed] = useState(1.0)

  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden bg-[#000000]">
      <MeshGradient
        className="w-full h-full absolute inset-0"
        colors={["#000000", "#1a1a1a", "#2a2a2a", "#4a4a4a"]}
        speed={speed}
      />
    </div>
  )
}