import { SearchForm } from "@/components/search/Form";
import { SearchResultsBody } from "@/components/search/SearchResultsBody";

const SearchPage = () => {
  return (
    <div className="min-h-screen px-6 pt-4 font-display md:px-12">
      <h1 className="my-6 text-3xl">Search</h1>
      <SearchForm />
      <SearchResultsBody />
    </div>
  );
};

export default SearchPage;
