import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const includesTrue = (obj: any) => {
  for (const key in obj) {
    if (obj[key] === true) return true;
    if (typeof obj[key] === "object" && includesTrue(obj[key])) return true;
    if (Array.isArray(obj[key]) && (obj[key].includes(true) || includesTrue(obj[key]))) return true;
  }
  return false;
};

export const getDirtyValues = (values: any, dirtyFields: any) =>
  Object.entries(dirtyFields).reduce((acc, [key, value]) => {
    if (value === false) return acc;
    if (value === true) {
      return { ...acc, [key]: values[key] };
    }
    if (includesTrue(value)) {
      return { ...acc, [key]: values[key] };
    }
    return acc;
  }, {} as any);
