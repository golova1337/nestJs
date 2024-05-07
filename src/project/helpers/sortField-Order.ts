export function sort(field, order) {
  const sortField = field || 'createdAt';
  const sortOrder = order === 'asc' ? 1 : -1;
  return {
    sortField,
    sortOrder,
  };
}
