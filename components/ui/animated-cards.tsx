"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CardSpotlight } from "./card-spotlight";

export const AnimatedCards = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon: string;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <CardSpotlight
          className="relative h-full p-6 border-transparent overflow-hidden"
          key={item + " " + idx}
        >
          <div className="relative z-50">
            <span className="text-4xl mb-4 block">{item.icon}</span>
            <h3 className="font-bold text-xl mb-2 text-neutral-100">
              {item.title}
            </h3>
            <p className="text-neutral-300">{item.description}</p>
          </div>
        </CardSpotlight>
      ))}
    </div>
  );
};
