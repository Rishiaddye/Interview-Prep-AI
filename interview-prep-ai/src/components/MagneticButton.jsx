import { motion, useMotionValue, useSpring } from "framer-motion";

const MagneticButton = ({ children, className = "", ...props }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const config = { stiffness: 300, damping: 20, mass: 0.6 };
  const xSpring = useSpring(x, config);
  const ySpring = useSpring(y, config);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - (left + width / 2);
    const offsetY = e.clientY - (top + height / 2);

    x.set(offsetX * 0.25);
    y.set(offsetY * 0.25);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default MagneticButton;
