import { CallableRequest } from 'firebase-functions/v2/https';
export type Middleware<T> = (req: CallableRequest<T>) => Promise<CallableRequest<T>>;
export declare function chain<T>(middlewares: Middleware<T>[]): Promise<(req: CallableRequest<T>) => Promise<CallableRequest<T>>>;
//# sourceMappingURL=chain.d.ts.map