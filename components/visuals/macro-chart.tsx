import { Label, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { displayNumber } from "@/lib/actions/food/food-logic";
import { cn } from "@/lib/utils";

const chartConfig = {
  amount: {
    label: "Amount",
  },
  carbs: {
    label: "Carbs",
    color: "hsl(var(--carbs))",
  },
  protein: {
    label: "Protein",
    color: "hsl(var(--protein))",
  },
  fat: {
    label: "Fat",
    color: "hsl(var(--fat))",
  },
} satisfies ChartConfig;

export function MacroChart({
  macros,
  className,
  size,
}: {
  macros: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
  size: "sm" | "md";
  className?: string;
}) {
  if (macros.carbs == 0 && macros.protein == 0 && macros.fat == 0) {
    return;
  }

  const chartData = [
    { macro: "carbs", amount: macros.carbs, fill: "var(--color-carbs)" },
    { macro: "protein", amount: macros.protein, fill: "var(--color-protein)" },
    { macro: "fat", amount: macros.fat, fill: "var(--color-fat)" },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(
        `mx-auto aspect-square ${size == "sm" && "max-h-36"} ${size == "md" && "max-h-40"}`,
        className,
      )}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="amount"
          nameKey="macro"
          innerRadius={size == "sm" ? 45 : 50}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {displayNumber(macros.calories)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 18}
                      className="fill-muted-foreground"
                    >
                      kcal
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
