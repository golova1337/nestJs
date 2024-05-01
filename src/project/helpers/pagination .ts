export function pagination(page, perPage) {
  page = parseInt(page) || 1;
  perPage = parseInt(perPage) || 10;
  return {
    page,
    perPage,
  };
}
