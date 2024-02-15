export declare const removeZeroesFunction: import("firebase-functions/lib/v2/core").CloudFunction<import("firebase-functions/v2/firestore").FirestoreEvent<import("firebase-functions/v2/firestore").Change<import("firebase-functions/v2/firestore").QueryDocumentSnapshot> | undefined, {
    grouptype: string;
    groupId: string;
    rosterId: string;
}>>;
export declare const assumeProfileCallable: import("firebase-functions/v2/https").CallableFunction<{
    profile: string;
}, any>;
export declare const createProfileCallable: import("firebase-functions/v2/https").CallableFunction<{
    name: string;
    description: string;
}, any>;
//# sourceMappingURL=index.d.ts.map