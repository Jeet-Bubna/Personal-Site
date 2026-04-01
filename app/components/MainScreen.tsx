"use client"

import { useMotionValue, useSpring, useTransform, motion } from "motion/react"
import { myCustomFont } from "../fonts"

function MainScreen() {
  const customFont = myCustomFont;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = {"damping":25, "stiffness":150};
  const dx = useSpring(x, springConfig);
  const dy = useSpring(y, springConfig)

  const layer1X = useTransform(dx, [-500, 500], [-20, 20]);
  const layer2X = useTransform(dx, [-500, 500], [-40, 40]);
  const layer3X = useTransform(dx, [-500, 500], [-60, 60]);

  function handleMouseMove(event: React.MouseEvent){
    x.set(event.clientX - window.innerWidth / 2);
    y.set(event.clientY - window.innerHeight / 2)
  }

  return (
    <div onMouseMove={handleMouseMove}>
    <div className='relative flex items-center justify-center h-screen'>
        <motion.div style={{ x: layer1X}} className={`absolute z-10 text-[225px] text-gray-400 text-bold ${customFont.className} mb-100 mr-100`}>
        Jay 
        </motion.div>
        <motion.div style={{ x: layer2X}}className="absolute z-20 text-9xl font-name-bold text-center text-gray-600 ">
        Jeet <br/>Bubna
        </motion.div>
        <motion.div style={{ x: layer3X}}className={`absolute z-30 text-[225px] text-gray-400 text-bold ${customFont.className} mt-90 ml-50`}>
        Blur
        </motion.div>
    </div>
    </div>
  )
}

export default MainScreen