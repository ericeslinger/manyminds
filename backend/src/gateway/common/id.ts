export interface Id<T extends string = string> {
  type: T;
  id: string;
}

export interface NullId {
  type: string;
  id: null;
}

export interface IdType {
  type: string;
}

export function pathId({ type, id }: Id) {
  return `${type}/${id}`;
}

export function fieldId({ type, id }: Id) {
  return `${type}#${id}`;
}
