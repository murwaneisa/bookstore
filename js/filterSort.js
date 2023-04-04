export function filterAndSort(
  data,
  cateFilter,
  authorFilter,
  priceMin,
  priceMax,
  sortBy
) {
  console.log("priceMin", priceMin);
  console.log("priceMax", priceMax);
  if (cateFilter) {
    console.log("category filter");
    if (cateFilter != "all") {
      data = data.filter(
        (filter_books) => filter_books.category === cateFilter
      );
    }
    data = data;
  }
  // Apply author filter if specified
  if (authorFilter) {
    console.log("author filter");
    data = data.filter((item) => item.author == authorFilter);
  }

  // Apply price interval filter if specified
  if (priceMin && priceMax) {
    data = data.filter(
      (item) => item.price >= priceMin && item.price <= priceMax
    );
  }

  // Apply sorting if specified
  if (sortBy) {
    console.log("sortBy", sortBy);
    switch (sortBy) {
      case "title_asc":
        data.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title_desc":
        data.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price_asc":
        data.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        data.sort((a, b) => b.price - a.price);
        break;
      case "author_asc":
        data.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case "author_desc":
        data.sort((a, b) => b.author.localeCompare(a.author));
        break;
      default:
        break;
    }
  }

  return data;
}
