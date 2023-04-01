function filterAndSort(data, authorFilter, priceMin, priceMax, sortBy) {
  // Apply author filter if specified
  if (authorFilter) {
    data = data.filter((item) => item.author === authorFilter);
  }

  // Apply price interval filter if specified
  if (priceMin && priceMax) {
    data = data.filter(
      (item) => item.price >= priceMin && item.price <= priceMax
    );
  }

  // Apply sorting if specified
  if (sortBy) {
    switch (sortBy) {
      case "titleAsc":
        data.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "titleDesc":
        data.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "priceAsc":
        data.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        data.sort((a, b) => b.price - a.price);
        break;
      case "authorAsc":
        data.sort((a, b) => a.author.localeCompare(b.author));
        break;
      case "authorDesc":
        data.sort((a, b) => b.author.localeCompare(a.author));
        break;
      default:
        break;
    }
  }

  return data;
}
