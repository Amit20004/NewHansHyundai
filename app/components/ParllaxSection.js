'use client'

import { useEffect } from 'react'
import { Parallax } from 'react-parallax'
import Lenis from '@studio-freight/lenis'
import '../css/Parallax.css'

const ParallaxSection = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: true,
    })

    const raf = (time) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])

  return (
    <div className="w-full flex justify-center">
      <div className="w-full ">
        <Parallax
          id="mainParallax"
          bgImage="https://res.cloudinary.com/dhgp0n6xf/image/upload/v1753425154/parallaxImage_ypqsnw.png"
          strength={400}
        >
          <div id="parallax" className="h-[500px]"></div>
        </Parallax>
      </div>
    </div>
  )
}

export default ParallaxSection
