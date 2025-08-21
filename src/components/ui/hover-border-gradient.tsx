"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type HoverBorderGradientProps = {
  children?: React.ReactNode;
  containerClassName?: string;
  className?: string;
  as?: React.ElementType;
  duration?: number;
  [key: string]: any;
};

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "div",
  duration = 1,
  ...rest
}: HoverBorderGradientProps) {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-background p-[1px] transition-all duration-300 ease-in-out hover:bg-transparent",
        containerClassName
      )}
      {...rest}
    >
      <div
        className={cn(
          "relative z-10 h-full w-full rounded-[0.4rem] bg-gray-800/60 text-foreground",
          className
        )}
      >
        {children}
      </div>
      <AnimatePresence>
        {hovered && <MagicBorder duration={duration} />}
      </AnimatePresence>
    </Tag>
  );
}

const MagicBorder = ({
  duration = 1,
  className,
}: {
  duration?: number;
  className?: string;
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      className={cn(
        "pointer-events-none absolute left-0 top-0 h-full w-full",
        className
      )}
    >
      <motion.div
        animate={{
          backgroundPosition: `100% 100%`,
        }}
        transition={{
          duration,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          backgroundSize: "200% 200%",
          backgroundImage: `conic-gradient(from var(--gradient-angle), #77B5FE, #8FBC8F, #77B5FE)`,
        }}
        className="absolute inset-[1px] z-20 h-[calc(100%-2px)] w-[calc(100%-2px)] rounded-lg"
      ></motion.div>
      <motion.div
        animate={{
          '--gradient-angle': '360deg',
        }}
        transition={{
          duration: duration,
          ease: "linear",
          repeat: Infinity,
        }}
        className="absolute inset-0 z-10 h-full w-full rounded-lg"
        style={
          {
            '--gradient-angle': '0deg',
            background: `conic-gradient(from var(--gradient-angle), #77B5FE, #8FBC8F, #77B5FE)`,
          } as React.CSSProperties
        }
      />
    </motion.div>
  );
};
