
/**
 * Convert NULL from sql to undefined
 */
export function sql2Reply(row){
  const target = {};
  for (const [k, v] of Object.entries(row)) {
    if (v !== null) {
      if (v instanceof Date) {
        target[k] = v.toISOString();
      } else {
        target[k] = v;
      }
    }
  }
  return target;
}
