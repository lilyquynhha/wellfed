import { cn } from "@/lib/utils";

export function Heading({
  size,
  text,
  className,
}: {
  size: 1 | 2 | 3;
  text: string;
  className?: string;
}) {
  switch (size) {
    case 1:
      return (
        <h1 className={cn("text-center text-7xl font-semibold", className)}>
          {text}
        </h1>
      );
    case 2:
      return (
        <h2 className={cn("text-4xl font-semibold", className)}>{text}</h2>
      );
    case 3:
      return <h3 className={cn("text-3xl font-medium", className)}>{text}</h3>;
  }
}
