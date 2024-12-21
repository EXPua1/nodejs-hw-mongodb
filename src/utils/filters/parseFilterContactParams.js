export const parseFilterContactParams = (query) => {
  const filters = {};

  // Проверяем, передан ли параметр фильтра по типу контакта (contactType)
  if (query.type) {
    const validTypes = ['work', 'home', 'personal'];
    if (validTypes.includes(query.type)) {
      filters.contactType = query.type;
    }
  }

  // Проверяем, передан ли параметр фильтра по избранности (isFavourite)
  if (query.isFavourite !== undefined) {
    // Преобразуем в Boolean, если параметр существует
    const isFavourite =
      query.isFavourite === 'true' || query.isFavourite === true;
    filters.isFavourite = isFavourite;
  }

  return filters;
};
