import {
  DocumentSnapshot,
  FieldValue,
  QueryDocumentSnapshot,
  Transaction,
  getFirestore,
} from 'firebase-admin/firestore';

import { Id, pathId, fieldId } from '../common/id';
import { HttpsError } from 'firebase-functions/v2/https';
import { info } from 'firebase-functions/logger';

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

export function rosterPathId(id: RosterId) {
  return `${fieldId(id.resource)}#${id.type}`;
}

export function parseRosterPathId(id: string): RosterId {
  const blocks = id.split('#');
  if (blocks.length !== 3) {
    throw new HttpsError('invalid-argument', `cannot parse ${id}`);
  } else {
    return {
      type: blocks[2],
      resource: {
        id: blocks[1],
        type: blocks[0],
      },
    };
  }
}

export function rosterPathString(id: RosterId) {
  return `${pathId(id.resource)}/_rosters/${id.type}`;
}

export const RosterConverter = {
  toFirestore: (data: Roster) => data,
  fromFirestore: (snapshot: QueryDocumentSnapshot) => snapshot.data() as Roster,
};

export async function createRoster(id: RosterId, initial: string[] = []) {
  getFirestore()
    .doc(rosterPathString(id))
    .withConverter(RosterConverter)
    .create({
      ...id,
      direct: Object.fromEntries(initial.map((v) => [v, true])),
      indirect: {
        [rosterPathId(id)]: 1,
      },
    });
}

export async function getRoster(id: RosterId, trx?: Transaction) {
  const docId = getFirestore()
    .doc(rosterPathString(id))
    .withConverter(RosterConverter);
  const roster = await (trx ? trx.get(docId) : docId.get());
  if (!roster.exists) {
    throw new HttpsError('not-found', `${rosterPathString(id)} not found`);
  }
  return roster.data()!;
}

export async function hasMember({
  memberId,
  thisId,
}: Membership | { thisId: RosterId; memberId: string }) {
  const roster = await getRoster(thisId);
  const memberString =
    typeof memberId === 'string' ? memberId : rosterPathId(memberId);
  return roster.indirect[memberString] > 0;
}

export async function addMember({ memberId, thisId }: Membership) {
  info({ memberId, thisId });
  return op({ action: 'add', memberId, thisId });
}

export async function removeMember({ memberId, thisId }: Membership) {
  return op({ action: 'remove', memberId, thisId });
}

export async function initializeRosters(resource: Id, first?: RosterId) {
  const readers = { type: 'readers', resource };
  const commenters = { type: 'commenters', resource };
  const editors = { type: 'editors', resource };

  await Promise.all(
    [readers, commenters, editors].map((role) => createRoster(role))
  );
  await Promise.all(
    [
      [first, editors],
      [editors, commenters],
      [commenters, readers],
    ].map(([memberId, thisId]) => {
      if (memberId && thisId) {
        return addMember({ memberId, thisId });
      } else {
        return;
      }
    })
  );
}

async function op({
  action,
  thisId,
  memberId,
}: Membership & {
  action: 'add' | 'remove';
}) {
  return getFirestore().runTransaction(
    async (trx) => {
      const [memberDoc, thisDoc] = await Promise.all([
        getRoster(memberId, trx),
        getRoster(thisId, trx),
      ]);

      validateOperation({ action, memberDoc, thisDoc });

      const multiplier = action === 'add' ? 1 : -1;
      // A. Get everything that (this) is a member of, except self
      const transitives = await trx
        .get(
          getFirestore()
            .collectionGroup('_rosters')
            .where(`indirect.${rosterPathId(thisId)}`, '>', 0)
            .withConverter(RosterConverter)
        )
        .then((list) =>
          list.docs.filter(
            (doc) => rosterPathId(doc.data()) !== rosterPathId(thisDoc)
          )
        );
      //TODO: try splitting this into two updates
      trx.update(getFirestore().doc(rosterPathString(thisDoc)), {
        ...patchGroup(memberDoc, multiplier),
        [`direct.${rosterPathId(memberDoc)}`]: true,
      } as any);

      // B. For everything that (this) is a member of, add the new member to those memberships.
      for (const transitive of transitives) {
        trx.update(
          transitive.ref,
          patchGroup(
            memberDoc,
            multiplier * transitive.data().indirect[rosterPathId(thisDoc)]!
          )
        );
      }
    },
    { readOnly: false, maxAttempts: 100 }
  );
}

function validateOperation({
  thisDoc,
  memberDoc,
  action,
}: {
  memberDoc: Roster;
  thisDoc: Roster;
  action: 'add' | 'remove';
}) {
  if (action === 'add') {
    if (memberDoc.indirect[rosterPathId(thisDoc)]) {
      throw new Error(
        `Error: ${rosterPathId(thisDoc)} is already a member of ${rosterPathId(
          memberDoc
        )}, cannot introduce a cycle.`
      );
    }
    if (thisDoc.direct[rosterPathId(memberDoc)]) {
      throw new Error(
        `Error: ${rosterPathId(
          memberDoc
        )} is already a member of ${rosterPathId(thisDoc)}`
      );
    }
  } else if (action === 'remove') {
    if (rosterPathId(thisDoc) === rosterPathId(memberDoc)) {
      throw new Error(
        `Error: ${rosterPathId(thisDoc)} cannot be removed from itself`
      );
    }
    if (!thisDoc.direct[rosterPathId(memberDoc)]) {
      throw new Error(
        `Error: ${rosterPathId(thisDoc)} is not a member of ${rosterPathId(
          memberDoc
        )}`
      );
    }
  }
}

function patchGroup(transitive: Roster, multiplier: number) {
  return Object.fromEntries(
    Object.entries(transitive.indirect).map(([t, c]) => [
      `indirect.${t}`,
      FieldValue.increment(c * multiplier),
    ])
  );
}
