export const resolveAmount = (
  servingFigure: number | null,
  servingSize: number,
  amount: number,
) => {
  return servingFigure ? (servingFigure * amount) / servingSize : null;
};

export const displayNumber = (n: number | null | undefined) => {
  if (!n) return "-";
  return Number(n.toFixed(3)).toString();
};
