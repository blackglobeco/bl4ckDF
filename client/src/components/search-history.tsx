import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, RotateCcw, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface HistoryItem {
  id: string;
  query: string;
  limit: number;
  lang: string;
  cost: string;
  timestamp: Date;
}

interface SearchHistoryProps {
  history: HistoryItem[];
  onRerun: (item: HistoryItem) => void;
  onClear: () => void;
}

export function SearchHistory({
  history,
  onRerun,
  onClear,
}: SearchHistoryProps) {
  if (history.length === 0) {
    return (
      <Card className="p-6 border">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <History className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            No search history yet
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-base font-semibold">Search History</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            data-testid="button-clear-history"
          >
            <Trash2 className="h-3 w-3 mr-2" />
            Clear
          </Button>
        </div>

        <div className="space-y-2">
          {history.map((item) => (
            <Card
              key={item.id}
              className="p-3 hover-elevate cursor-pointer"
              onClick={() => onRerun(item)}
              data-testid={`history-item-${item.id}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono truncate mb-1">
                    {item.query}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {item.lang.toUpperCase()}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Limit: {item.limit}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {item.cost}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRerun(item);
                  }}
                  data-testid={`button-rerun-${item.id}`}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}
