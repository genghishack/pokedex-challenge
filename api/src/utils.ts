export const arrayContainsArray = (superset: any[], subset: any[]) => {
  return subset.every(value => superset.indexOf(value) >= 0);
}
