export function isEmptyObj(obj: { [key: string]: string }) {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    if (val.trim().length) {
      acc[key] = val.trim();
    }
    return acc;
  }, {});
}
