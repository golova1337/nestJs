import { Field, Order } from '../enum/sort-enum';

export function sort(
  field: Field,
  order: Order,
): { sortField: string; sortOrder: number } {
  const sortField = field || 'createdAt';
  const sortOrder = order === 'asc' ? 1 : -1;
  return {
    sortField,
    sortOrder,
  };
}
