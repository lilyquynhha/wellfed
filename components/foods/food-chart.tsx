import { Label, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { spServing } from "@/lib/supabase/database-types";
import { displayNumber } from "@/lib/actions/food/food-logic";

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

export function FoodChart({
  macros,
}: {
  macros: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
}) {
  if (macros.carbs == 0 && macros.protein == 0 && macros.fat == 0) {
    return (
      <>
        <div className="flex justify-between items-end mt-2">
          <p className="text-2xl font-extrabold">Calories</p>
          <p className="text-5xl font-extrabold">0</p>
        </div>

        <div className="h-2 bg-primary mt-2 mb-3"></div>
      </>
    );
  }

  const chartData = [
    { macro: "carbs", amount: macros.carbs, fill: "var(--color-carbs)" },
    { macro: "protein", amount: macros.protein, fill: "var(--color-protein)" },
    { macro: "fat", amount: macros.fat, fill: "var(--color-fat)" },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-32"
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
          innerRadius={35}
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
