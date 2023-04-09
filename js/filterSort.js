export function filterAndSort(
  data,
  cateFilter,
  authorFilter,
  priceMin,
  priceMax,
  sortBy,
  bookTitle
) {
  if (cateFilter) {
    console.log("category filter", cateFilter);
    if (cateFilter != "all") {
      data = data.filter(
        (filter_books) => filter_books.category === cateFilter
      );
    }
    data = data;
  }
  // Apply author filter if specified
  if (authorFilter) {
    console.log("author filter is", authorFilter);
    if (authorFilter != "all") {
      data = data.filter((item) => item.author == authorFilter);
    }
    data = data;
  }

  // Apply price interval filter if specified
  if (priceMin && priceMax) {
    data = data.filter(
      (item) => item.price >= priceMin && item.price <= priceMax
    );
  }
  // Apply search book title if specified
  if (bookTitle) {
    console.log("first, book title", bookTitle);
    if (bookTitle != "all") {
      data = data.filter((item) => item.title === bookTitle);
    }
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
