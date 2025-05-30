<CategoryFilter
  selected={selectedCategory}
  onChange={(value) => {
    setSelectedCategory(value);
    setSearchCategory(value);
    setPage(0);
    setSearchParams(value ? { page: 0, keyword: value } : { page: 0 });
  }}
  onReset={() => {
    setSelectedCategory("");
    setSearchCategory("");
    setPage(0);
    setSearchParams({ page: 0 });
  }}
/>
