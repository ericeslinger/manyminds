import { QueryDocumentSnapshot, Transaction } from 'firebase-admin/firestore';
import { Id } from '../common/id';
export interface ContainerMetadata {
    up: {
        direct: Record<string, true>;
        indirect: Record<string, number>;
    };
}
export declare const ContainerMetadataConverter: {
    toFirestore: (data: ContainerMetadata) => ContainerMetadata;
    fromFirestore: (snapshot: QueryDocumentSnapshot) => ContainerMetadata;
};
export declare function getContainer(id: Id, trx?: Transaction): Promise<ContainerMetadata>;
export declare function hasMember(id: Id, downId: Id): Promise<boolean | undefined>;
export declare function op({ action, downId, upId, }: {
    action: 'add' | 'remove';
    downId: Id;
    upId: Id;
}): Promise<void>;
export declare function createContainer<T extends string>(id: Id<T>): Promise<Id<T>>;
//# sourceMappingURL=container.d.ts.map