import { SearchHistory } from "../search-history";

export default function SearchHistoryExample() {
  const mockHistory = [
    {
      id: "1",
      query: "example@gmail.com",
      limit: 100,
      lang: "en",
      cost: "$0.0030",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      query: "Elon Reeve Musk",
      limit: 300,
      lang: "ru",
      cost: "$0.0041",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "3",
      query: "google",
      limit: 100,
      lang: "en",
      cost: "$0.0030",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
  ];

  const handleRerun = (item: any) => {
    console.log("Rerun search:", item);
  };

  const handleClear = () => {
    console.log("Clear history");
  };

  return (
    <div className="p-6 bg-background max-w-2xl">
      <SearchHistory
        history={mockHistory}
        onRerun={handleRerun}
        onClear={handleClear}
      />
    </div>
  );
}
