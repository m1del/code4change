import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface Props {
  direction: "left" | "right" | "top" | "bottom";
  children: JSX.Element;
  width?: "fit-content" | "100%";
  delay?: number;
}

export const FadeIn = ({
  direction,
  children,
  width = "fit-content",
  delay = 0.25,
}: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView]);

  const hidden = { opacity: 0, x: 0, y: 0 };

  if (direction === "left") {
    hidden.x = -400;
  } else if (direction === "right") {
    hidden.x = 400;
  } else if (direction === "top") {
    hidden.y = -400;
  } else if (direction === "bottom") {
    hidden.y = 400;
  }

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width,
        margin: "auto",
      }}
    >
      <motion.div
        variants={{
          hidden: hidden,
          visible: { opacity: 1, x: 0, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay: delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};
