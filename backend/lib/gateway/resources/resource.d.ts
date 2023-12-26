import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { Id } from '../common/id';
export type Permission = 'reader' | 'writer' | 'owner';
export declare const PERMISSIONS: [Permission, Permission, Permission];
export interface ResourceMetadata {
    metadatatype: 'resourceacl';
    permission: Permission;
    public: boolean;
    list: Record<string, true>;
}
export declare const ResourceMetadataConverter: {
    toFirestore: (data: ResourceMetadata) => ResourceMetadata;
    fromFirestore: (snapshot: QueryDocumentSnapshot) => ResourceMetadata;
};
export declare function getResource(id: Id, permission: Permission): Promise<ResourceMetadata>;
//# sourceMappingURL=resource.d.ts.map