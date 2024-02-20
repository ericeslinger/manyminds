import { AuthData } from 'firebase-functions/lib/common/providers/https';
export declare function authorize(target: {
    type: string;
    id: string;
}, actor: AuthData, role: {
    contains: string;
}): Promise<boolean>;
//# sourceMappingURL=authorize.d.ts.map