import { Field, Order } from '../enum/sort-enum';

export function sort(sorting: { sortBy: Field; sortOrder: Order }) {
  let { sortBy, sortOrder } = sorting;
  sortBy = sortBy === Field.createdAt ? Field.createdAt : Field.updatedAt;
  sortOrder =
    sortOrder === Order.ascending ? Order.ascending : Order.descending;
  return {
    sortBy,
    sortOrder,
  };
}
