export function pagination(page, perPage): { page: number; perPage: number } {
  page = parseInt(page) || 1;
  perPage = parseInt(perPage) || 10;
  return {
    page,
    perPage,
  };
}
