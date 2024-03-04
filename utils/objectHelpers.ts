const isObject = (val: unknown): val is object =>
  val && typeof val === "object";

const mergeArrayWithDedupe = (a: any[], b: any[]) =>
  Array.from(new Set([...a, ...b]));

/** Recursively merge the content of the new object to the existing one. */
export function deepMerge(target: object, obj: object): object {
  for (const key of Object.keys(obj)) {
    const oldVal = target[key];
    const newVal = obj[key];

    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      target[key] = mergeArrayWithDedupe(oldVal, newVal);
    } else if (isObject(oldVal) && isObject(newVal)) {
      target[key] = deepMerge(oldVal, newVal);
    } else {
      target[key] = newVal;
    }
  }

  return target;
}

export function sortDependencies<T extends object = object>(packageJson: T): T {
  const sorted = {};

  const depTypes = [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ];

  for (const depType of depTypes) {
    if (packageJson[depType]) {
      sorted[depType] = {};

      Object.keys(packageJson[depType])
        .sort()
        .forEach((name) => {
          sorted[depType][name] = packageJson[depType][name];
        });
    }
  }

  return {
    ...packageJson,
    ...sorted,
  };
}
