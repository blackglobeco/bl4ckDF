import { SearchForm } from "../search-form";

export default function SearchFormExample() {
  const handleSearch = (data: any) => {
    console.log("Search submitted:", data);
  };

  return (
    <div className="p-6 bg-background max-w-2xl">
      <SearchForm onSearch={handleSearch} />
    </div>
  );
}
