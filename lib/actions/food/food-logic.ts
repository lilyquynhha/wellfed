export const resolveAmount = (
  servingFigure: number | null,
  servingSize: number,
  amount: number,
) => {
  return servingFigure ? (servingFigure * amount) / servingSize : null;
};

export const displayNumber = (n: number | null | undefined, unit?: string) => {
  if (n == null || n == undefined) return "-";
  return `${Number(n.toFixed(2)).toString()}${unit ?? ""}`;
};
