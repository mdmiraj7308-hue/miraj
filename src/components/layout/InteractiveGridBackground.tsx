"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const CELL_SIZE = 120;
const STEP = CELL_SIZE;

type Dimensions = {
  width: number;
  height: number;
};

function getGridSize({ width, height }: Dimensions) {
  const columns = Math.max(1, Math.ceil(width / STEP) + 1);
  const rows = Math.max(1, Math.ceil(height / STEP) + 1);
  return { columns, rows, total: columns * rows };
}

export function InteractiveGridBackground() {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);

  const { columns, rows, total } = useMemo(
    () => getGridSize(dimensions),
    [dimensions],
  );

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateHoverCapability = () => setCanHover(media.matches);
    updateHoverCapability();
    media.addEventListener("change", updateHoverCapability);

    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => {
      media.removeEventListener("change", updateHoverCapability);
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!canHover || columns === 0) return;

      const column = Math.floor(event.clientX / STEP);
      const row = Math.floor(event.clientY / STEP);

      if (column < 0 || row < 0 || column >= columns || row >= rows) {
        setHoveredIndex(null);
        return;
      }

      setHoveredIndex(row * columns + column);
    },
    [canHover, columns, rows],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  useEffect(() => {
    if (!canHover) return;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [canHover, handleMouseMove, handleMouseLeave]);

  const cells = useMemo(() => Array.from({ length: total }, (_, index) => index), [total]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070a]"
    >
      <div
        className="absolute left-0 top-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, ${CELL_SIZE}px)`,
          gap: 0,
        }}
      >
        {cells.map((index) => {
          const column = index % columns;
          const row = Math.floor(index / columns);

          return (
          <div
            key={index}
            style={{ width: CELL_SIZE, height: CELL_SIZE }}
            className={cn(
              "grid-cell-glow box-border rounded-[10px] border border-[rgba(100,116,139,0.18)] bg-transparent transition-[border-color,box-shadow,background-color] duration-200 ease-out",
              column > 0 && "-ml-px",
              row > 0 && "-mt-px",
              hoveredIndex === index &&
                "z-10 border-[rgba(180,200,255,0.9)] bg-[rgba(120,150,255,0.12)] shadow-[0_0_22px_rgba(140,170,255,0.65),0_0_40px_rgba(96,130,255,0.35),inset_0_0_20px_rgba(160,190,255,0.18)]",
            )}
          />
          );
        })}
      </div>
    </div>
  );
}
