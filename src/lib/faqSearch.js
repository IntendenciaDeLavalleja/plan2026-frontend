export function normalizeFaqText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-UY')
    .trim();
}

export function filterFaqItems(items, query, category) {
  const normalizedQuery = normalizeFaqText(query);
  return items.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    const searchableText = [item.question, ...item.answer, ...(item.bullets ?? []), ...(item.keywords ?? [])].join(' ');
    return normalizeFaqText(searchableText).includes(normalizedQuery);
  });
}
