export function sort(field, order) {
  const sortQuery = {};
  const sortField = field || 'createdAt';
  sortQuery[sortField] = order === 'asc' ? 1 : -1;
  return sortQuery;
}
