import { QueryDocumentSnapshot, Transaction } from 'firebase-admin/firestore';
import { Id } from '../common/id';
export interface RosterId {
    resource: Id;
    type: string;
}
export interface Roster extends RosterId {
    direct: Record<string, boolean>;
    indirect: Record<string, number>;
}
export interface Membership {
    thisId: RosterId;
    memberId: RosterId;
}
export declare function rosterPathId(id: RosterId): string;
export declare function rosterPathString(id: RosterId): string;
export declare const RosterConverter: {
    toFirestore: (data: Roster) => Roster;
    fromFirestore: (snapshot: QueryDocumentSnapshot) => Roster;
};
export declare function createRoster(id: RosterId, initial?: string[]): Promise<void>;
export declare function getRoster(id: RosterId, trx?: Transaction): Promise<Roster>;
export declare function hasMember({ memberId, thisId, }: Membership | {
    thisId: RosterId;
    memberId: string;
}): Promise<boolean>;
export declare function addMember({ memberId, thisId }: Membership): Promise<void>;
export declare function removeMember({ memberId, thisId }: Membership): Promise<void>;
//# sourceMappingURL=roster.d.ts.map