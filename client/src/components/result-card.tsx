import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Database,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultCardProps {
  databaseName: string;
  infoLeak: string;
  data: Array<Record<string, string>>;
  count: number;
}

export function ResultCard({
  databaseName,
  infoLeak,
  data,
  count,
}: ResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    const text = JSON.stringify({ databaseName, infoLeak, data }, null, 2);
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `Data from ${databaseName} copied successfully`,
    });
  };

  const handleExport = () => {
    console.log("Export triggered for:", databaseName);
    toast({
      title: "Export started",
      description: `Exporting data from ${databaseName}`,
    });
  };

  return (
    <Card className="border overflow-hidden">
      <div
        className="p-4 cursor-pointer hover-elevate"
        onClick={() => setIsExpanded(!isExpanded)}
        data-testid={`card-result-${databaseName}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <h3 className="text-base font-semibold truncate">
                {databaseName}
              </h3>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {count} records
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {infoLeak}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            data-testid={`button-expand-${databaseName}`}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t bg-muted/20 p-4 space-y-4">
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              data-testid={`button-copy-${databaseName}`}
            >
              <Copy className="h-3 w-3 mr-2" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              data-testid={`button-export-${databaseName}`}
            >
              <Download className="h-3 w-3 mr-2" />
              Export
            </Button>
          </div>

          <div className="space-y-3">
            {data.map((record, idx) => (
              <Card key={idx} className="p-3 bg-card">
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(record).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"
                    >
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide min-w-32">
                        {key}
                      </span>
                      <span className="text-sm font-mono break-all">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
