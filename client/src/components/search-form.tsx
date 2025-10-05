import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

interface SearchFormProps {
  onSearch: (data: any) => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [queryType, setQueryType] = useState<"single" | "multiple">("single");
  const [singleQuery, setSingleQuery] = useState("");
  const [multipleQueries, setMultipleQueries] = useState("");
  const [limit] = useState(400);
  const [lang] = useState("en");
  const [type] = useState("json");
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    const query = queryType === "single" ? singleQuery : multipleQueries;
    setTimeout(() => {
      onSearch({ query, limit, lang, type });
      setIsSearching(false);
    }, 500);
  };

  const currentQuery = queryType === "single" ? singleQuery : multipleQueries;

  return (
    <Card className="p-6 border">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-semibold">Search Database</h3>
        </div>

        <Tabs value={queryType} onValueChange={(v) => setQueryType(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single" data-testid="tab-single-query">
              Single Query
            </TabsTrigger>
            <TabsTrigger value="multiple" data-testid="tab-multiple-queries">
              Multiple Queries
            </TabsTrigger>
          </TabsList>
          <TabsContent value="single" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="single-query">Search Query</Label>
              <Input
                id="single-query"
                value={singleQuery}
                onChange={(e) => setSingleQuery(e.target.value)}
                placeholder="example@gmail.com"
                className="h-12 text-base"
                data-testid="input-single-query"
              />
            </div>
          </TabsContent>
          <TabsContent value="multiple" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="multiple-queries">
                Multiple Queries (one per line)
              </Label>
              <Textarea
                id="multiple-queries"
                value={multipleQueries}
                onChange={(e) => setMultipleQueries(e.target.value)}
                placeholder="example@gmail.com&#10;Elon Reeve Musk&#10;google"
                className="min-h-32 font-mono text-sm"
                data-testid="input-multiple-queries"
              />
            </div>
          </TabsContent>
        </Tabs>

        <Button
          type="submit"
          className="w-full h-12 text-base font-medium"
          disabled={!currentQuery || isSearching}
          data-testid="button-search"
        >
          {isSearching ? "Searching..." : "Search Database"}
        </Button>
      </form>
    </Card>
  );
}
