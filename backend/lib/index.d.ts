export declare const removeZeroes: import("firebase-functions/lib/v2/core").CloudFunction<import("firebase-functions/v2/firestore").FirestoreEvent<import("firebase-functions/v2/firestore").Change<import("firebase-functions/v2/firestore").QueryDocumentSnapshot> | undefined, {
    grouptype: string;
    groupId: string;
    rosterId: string;
}>>;
export declare const assumeProfile: import("firebase-functions/v2/https").CallableFunction<{
    profile: string;
}, any>;
export declare const createProfile: import("firebase-functions/v2/https").CallableFunction<{
    name: string;
    description: string;
}, any>;
export declare const fetchProfiles: import("firebase-functions/v2/https").CallableFunction<import("./gateway/profiles/fetchProfiles").ListCall, any>;
export declare const createPost: import("firebase-functions/v2/https").CallableFunction<{}, any>;
//# sourceMappingURL=index.d.ts.map