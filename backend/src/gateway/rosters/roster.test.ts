import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { describe, it, expect, beforeAll } from '@jest/globals';
import { parallelizeWithDelay, serialize, wait } from '../../testing/async';
import {
  addMember,
  removeMember,
  hasMember,
  Membership,
  rosterPathString,
  getRoster,
  rosterPathId,
  RosterId,
  RosterConverter,
} from './roster';
import {
  RulesTestEnvironment,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';

let env: RulesTestEnvironment;

beforeAll(async () => {
  initializeApp({ projectId: 'demo-trellis' });
  env = await initializeTestEnvironment({ projectId: 'demo-trellis' });
});

afterAll(async () => {
  await env.clearFirestore();
});

async function createRosterForTesting(id: RosterId) {
  await getFirestore()
    .doc(rosterPathString(id))
    .withConverter(RosterConverter)
    .create({
      indirect: {
        [rosterPathId(id)]: 1,
      },
      direct: {},
      ...id,
    });
  return id;
}

async function createRostersForTesting<
  T extends string,
  const K extends ReadonlyArray<string>
>(t: T, tags: K): Promise<Record<K[number], RosterId>> {
  return Object.fromEntries(
    await Promise.all(
      tags.map(async (tag) => {
        const container = await createRosterForTesting({
          resource: {
            id: tag,
            type: t,
          },
          type: 'reader',
        });
        return [tag, container];
      })
    )
  );
}

async function countPaths({ thisId, memberId }: Membership): Promise<number> {
  const downData = await getRoster(thisId);
  return downData.indirect[rosterPathId(memberId)] || 0;
}

async function assertNone({ thisId, memberId }: Membership) {
  const downData = await getRoster(thisId);
  expect(downData.indirect[rosterPathId(memberId)]).toBeUndefined();
}

describe('group addition', () => {
  it('propagates group additions', async () => {
    const groupTags = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const createdGroups = await createRostersForTesting(
      'simpleaddition',
      groupTags
    );
    await parallelizeWithDelay(
      groupTags.map((val, idx) =>
        idx < groupTags.length - 1
          ? addMember({
              memberId: createdGroups[groupTags[idx + 1]],
              thisId: createdGroups[val],
            })
          : Promise.resolve()
      )
    );
    for (let i = 0; i < groupTags.length; i++) {
      for (let j = i; j < groupTags.length; j++) {
        expect(
          await hasMember({
            memberId: createdGroups[groupTags[j]],
            thisId: createdGroups[groupTags[i]],
          })
        ).toEqual(true);
      }
    }
  });

  it('handles multigroup add propagation', async () => {
    const groupTags = ['a', 'b0', 'b1', 'b2', 'c', 'd'];
    const createdGroups = await createRostersForTesting(
      'multigroupaddition',
      groupTags
    );
    await parallelizeWithDelay([
      addMember({ memberId: createdGroups['b0'], thisId: createdGroups['a'] }),
      addMember({ memberId: createdGroups['b1'], thisId: createdGroups['a'] }),
      addMember({ memberId: createdGroups['b2'], thisId: createdGroups['a'] }),
      addMember({ memberId: createdGroups['c'], thisId: createdGroups['b0'] }),
      addMember({ memberId: createdGroups['c'], thisId: createdGroups['b1'] }),
      addMember({ memberId: createdGroups['c'], thisId: createdGroups['b2'] }),
      addMember({ memberId: createdGroups['d'], thisId: createdGroups['c'] }),
    ]);
    expect(
      await hasMember({
        memberId: createdGroups['d'],
        thisId: createdGroups['a'],
      })
    ).toEqual(true);
    expect(
      await countPaths({
        thisId: createdGroups['a'],
        memberId: createdGroups['c'],
      })
    ).toEqual(3);
    expect(
      await countPaths({
        thisId: createdGroups['a'],
        memberId: createdGroups['d'],
      })
    ).toEqual(3);
  });

  it('avoids direct cycles', async () => {
    const { parent, child } = await createRostersForTesting('cycle', [
      'parent',
      'child',
    ]);

    await addMember({ memberId: parent, thisId: child });

    await expect(
      addMember({ memberId: child, thisId: parent })
    ).rejects.toEqual(expect.anything());
  });

  it('avoids indirect cycles', async () => {
    const { parent, child, grandchild } = await createRostersForTesting(
      'indirectcycle',
      ['parent', 'child', 'grandchild']
    );

    await addMember({ memberId: parent, thisId: child });
    await addMember({ memberId: child, thisId: grandchild });

    await expect(
      addMember({ memberId: grandchild, thisId: parent })
    ).rejects.toEqual(expect.anything());
  });

  it('prevents self-addition', async () => {
    const { self } = await createRostersForTesting('self-add', ['self']);

    await expect(addMember({ memberId: self, thisId: self })).rejects.toEqual(
      expect.anything()
    );
  });
});

describe('group subtraction', () => {
  it('removes correctly', async () => {
    const groupTags = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const createdGroups = await createRostersForTesting(
      'simple-remove',
      groupTags
    );
    await serialize(
      groupTags.map((val, idx) =>
        idx < groupTags.length - 1
          ? addMember({
              memberId: createdGroups[groupTags[idx + 1]],
              thisId: createdGroups[val],
            })
          : Promise.resolve()
      )
    );
    await removeMember({
      memberId: createdGroups['e'],
      thisId: createdGroups['d'],
    });
    expect(
      await hasMember({
        memberId: createdGroups['g'],
        thisId: createdGroups['a'],
      })
    ).toEqual(false);
    await wait(1000);
    await assertNone({
      memberId: createdGroups['g'],
      thisId: createdGroups['a'],
    });
  });

  it('handles multigroup remove propagation', async () => {
    const groupTags = ['a', 'b0', 'b1', 'b2', 'c', 'd'];
    const createdGroups = await createRostersForTesting(
      'multi-path-remove',
      groupTags
    );
    await serialize([
      addMember({
        memberId: createdGroups['b0'],
        thisId: createdGroups['a'],
      }),
      addMember({
        memberId: createdGroups['b1'],
        thisId: createdGroups['a'],
      }),
      addMember({
        memberId: createdGroups['b2'],
        thisId: createdGroups['a'],
      }),
      addMember({
        memberId: createdGroups['c'],
        thisId: createdGroups['b0'],
      }),
      addMember({
        memberId: createdGroups['c'],
        thisId: createdGroups['b1'],
      }),
      addMember({
        memberId: createdGroups['c'],
        thisId: createdGroups['b2'],
      }),
      addMember({
        memberId: createdGroups['d'],
        thisId: createdGroups['c'],
      }),
    ]);

    await removeMember({
      memberId: createdGroups['c'],
      thisId: createdGroups['b0'],
    });

    expect(
      await hasMember({
        memberId: createdGroups['d'],
        thisId: createdGroups['a'],
      })
    ).toEqual(true);

    await removeMember({
      memberId: createdGroups['c'],
      thisId: createdGroups['b1'],
    });
    expect(
      await hasMember({
        memberId: createdGroups['d'],
        thisId: createdGroups['a'],
      })
    ).toEqual(true);

    await removeMember({
      memberId: createdGroups['c'],
      thisId: createdGroups['b2'],
    });
    expect(
      await hasMember({
        memberId: createdGroups['d'],
        thisId: createdGroups['a'],
      })
    ).toEqual(false);
  });

  it('prevents self-removal', async () => {
    const { self } = await createRostersForTesting('self-remove', ['self']);

    await expect(
      removeMember({ memberId: self, thisId: self })
    ).rejects.toEqual(expect.anything());
  });

  it('prevents unlinked removal', async () => {
    const { one, two } = await createRostersForTesting('unlinked-remove', [
      'one',
      'two',
    ]);

    await expect(removeMember({ memberId: one, thisId: two })).rejects.toEqual(
      expect.anything()
    );
  });
});
