import { Suspense, lazy, useRef } from 'react'
import type { SPEObject, Application } from '@splinetool/runtime'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const splineRef = useRef<Application | null>(null)
  const robotRef = useRef<SPEObject | null>(null)

  const onLoad = (spline: Application) => {
    splineRef.current = spline
    
    const robot = spline.findObjectByName('Robot')
    if (robot) {
      robotRef.current = robot
    }
  }

  const onMouseEnter = () => {
    if (robotRef.current) {
      robotRef.current.emitEvent('mouseHover')
    }
  }

  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span className="loader"></span>
        </div>
      }
    >
      <div onMouseEnter={onMouseEnter} className="w-full h-full">
        <Spline
          scene={scene}
          className={className}
          onLoad={onLoad}
        />
      </div>
    </Suspense>
  )
}