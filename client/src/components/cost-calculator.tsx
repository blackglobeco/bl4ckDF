import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";

interface CostCalculatorProps {
  query: string;
  limit: number;
}

function calculateComplexity(query: string): number {
  const words = query
    .split(/\s+/)
    .filter((word) => {
      if (word.length < 4 && !/^\d{6,}$/.test(word)) return false;
      if (/^\d{1,5}$/.test(word)) return false;
      if (/^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}$/.test(word)) return false;
      return true;
    });

  const wordCount = words.length;
  if (wordCount === 0) return 1;
  if (wordCount === 1) return 1;
  if (wordCount === 2) return 5;
  if (wordCount === 3) return 16;
  return 40;
}

function calculateCost(limit: number, complexity: number): number {
  return (5 + Math.sqrt(limit * complexity)) / 5000;
}

export function CostCalculator({ query, limit }: CostCalculatorProps) {
  const complexity = calculateComplexity(query);
  const cost = calculateCost(limit, complexity);

  const costLevel = cost > 0.01 ? "high" : cost > 0.005 ? "medium" : "low";

  return (
    <Card className="p-4 border">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Estimated Cost</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Complexity</p>
            <p className="text-lg font-semibold">{complexity}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Limit</p>
            <p className="text-lg font-semibold">{limit}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Cost</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">${cost.toFixed(4)}</p>
              <Badge
                variant={costLevel === "high" ? "destructive" : "secondary"}
                className="text-xs"
              >
                {costLevel}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
