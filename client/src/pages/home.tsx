import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { SearchForm } from "@/components/search-form";
import { ResultCard } from "@/components/result-card";
import { SearchHistory } from "@/components/search-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface DatabaseResult {
  InfoLeak: string;
  Data: Array<Record<string, string>>;
}

interface ApiResponse {
  List: Record<string, DatabaseResult>;
  "Error code"?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState("search");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { toast } = useToast();

  const { data: searchHistory = [] } = useQuery<any[]>({
    queryKey: ["/api/history"],
  });

  const searchMutation = useMutation({
    mutationFn: async (data: any): Promise<ApiResponse> => {
      const queries = Array.isArray(data.query)
        ? data.query
        : data.query.split("\n").filter((q: string) => q.trim());

      const response = await apiRequest("POST", "/api/search", {
        request: queries.length === 1 ? queries[0] : queries,
        limit: data.limit,
        lang: data.lang,
        type: data.type || "json",
      });
      return await response.json();
    },
    onSuccess: (data: ApiResponse) => {
      if (data["Error code"]) {
        toast({
          title: "API Error",
          description: data["Error code"],
          variant: "destructive",
        });
        return;
      }

      const results = Object.entries(data.List || {}).map(
        ([databaseName, dbData]) => ({
          databaseName,
          infoLeak: dbData.InfoLeak || "No information available",
          data: dbData.Data || [],
          count: dbData.Data?.length || 0,
        })
      );

      setSearchResults(results);
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      setActiveTab("results");

      toast({
        title: "Search completed",
        description: `Found ${results.length} database(s) with results`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Search failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/history");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      toast({
        title: "History cleared",
        description: "Search history has been cleared successfully",
      });
    },
  });

  const handleSearch = (data: any) => {
    searchMutation.mutate(data);
  };

  const handleRerunSearch = (item: any) => {
    handleSearch({
      query: item.query,
      limit: item.limit,
      lang: item.lang,
      type: "json",
    });
  };

  const handleClearHistory = () => {
    clearHistoryMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search" data-testid="tab-search">
                Search
              </TabsTrigger>
              <TabsTrigger value="results" data-testid="tab-results">
                Results ({searchResults.length})
              </TabsTrigger>
              <TabsTrigger value="history" data-testid="tab-history">
                History ({searchHistory.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-6 mt-6">
              <SearchForm onSearch={handleSearch} />
            </TabsContent>

            <TabsContent value="results" className="space-y-4 mt-6">
              {searchMutation.isPending ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                  <p className="mt-4 text-muted-foreground">
                    Searching databases...
                  </p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No results yet. Perform a search to see results here.
                </div>
              ) : (
                searchResults.map((result, idx) => (
                  <ResultCard
                    key={idx}
                    databaseName={result.databaseName}
                    infoLeak={result.infoLeak}
                    data={result.data}
                    count={result.count}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <SearchHistory
                history={searchHistory}
                onRerun={handleRerunSearch}
                onClear={handleClearHistory}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}