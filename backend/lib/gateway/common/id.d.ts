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
export declare function pathId({ type, id }: Id): string;
export declare function fieldId({ type, id }: Id): string;
//# sourceMappingURL=id.d.ts.map