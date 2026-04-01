"use client";

import { useMotionValue, useSpring, useTransform, motion } from "motion/react";
import { myCustomFont } from "../fonts";
import { Code2, Terminal, Database, Cpu, Braces, Network } from "lucide-react";

function MainScreen() {
  const customFont = myCustomFont;

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const dx = useSpring(x, springConfig);
  const dy = useSpring(y, springConfig);

  const layer1X = useTransform(dx, [-500, 500], [-20, 20]);
  const layer2X = useTransform(dx, [-500, 500], [-40, 40]);
  const layer3X = useTransform(dx, [-500, 500], [-60, 60]);

  function handleMouseMove(event: React.MouseEvent) {
    x.set(event.clientX - window.innerWidth / 2);
    y.set(event.clientY - window.innerHeight / 2);
  }

  return (
    <div onMouseMove={handleMouseMove}>
      <div className="relative flex items-center justify-center h-screen">
        <motion.div
          style={{ x: layer1X }}
          className={`absolute z-10 text-[225px] text-gray-400 text-bold ${customFont.className} mb-100 mr-100`}
        >
          Jay
        </motion.div>
        <motion.div
          style={{ x: layer2X }}
          className="absolute z-20 text-9xl font-name-bold text-center text-gray-600 "
        >
          Jeet <br />
          Bubna
        </motion.div>
        <motion.div
          style={{ x: layer3X }}
          className={`absolute z-30 text-[225px] text-gray-400 text-bold ${customFont.className} mt-90 ml-50`}
        >
          Blur
        </motion.div>
      </div>

      <div className="absolute top-10 right-40 z-40 flex flex-col items-end space-y-[-10px] opacity-60">
        <div className="flex space-x-2 items-center">
          <motion.div
            style={{ x: layer1X }}
            className="rotate-[-12deg] bg-gray-800 p-2 rounded-lg border border-gray-700"
          >
            <Code2 size={32} className="text-gray-300" />
          </motion.div>
          <motion.div style={{ x: layer2X }} className="rotate-[15deg]">
            <Terminal size={48} className="text-gray-500" />
          </motion.div>
        </div>
        <motion.div style={{ x: layer3X }} className="mr-8 rotate-[-5deg]">
          <Cpu size={28} className="text-gray-400" />
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-100 z-40 flex items-end space-x-[-5px] opacity-50">
        <motion.div style={{ x: layer3X }} className="rotate-[10deg]">
          <Database size={36} className="text-gray-500" />
        </motion.div>
        <motion.div
          style={{ x: layer2X }}
          className="mb-6 rotate-[-20deg] bg-gray-900 p-1 border border-gray-800"
        >
          <Braces size={40} className="text-gray-400" />
        </motion.div>
        <motion.div style={{ x: layer1X }} className="rotate-[5deg]">
          <Network size={24} className="text-gray-600" />
        </motion.div>
      </div>
    </div>
  );
}

export default MainScreen;
