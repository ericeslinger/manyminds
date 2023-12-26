import {
  assertSucceeds,
  assertFails,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { setLogLevel } from 'firebase/firestore';

let testEnv: RulesTestEnvironment;

interface Acl {
  users?: Record<string, boolean>;
  groups?: Record<string, boolean>;
}

async function tick(count: number = 100) {
  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), count);
  });
}

before(async () => {
  setLogLevel('error');
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-trellis',
    hub: { host: '127.0.0.1', port: 4400 },
    firestore: {},
  });
});

after(async () => {
  await testEnv.cleanup();

  const { host, port } = testEnv.emulators.firestore!;
  const quotedHost = host.includes(':') ? `[${host}]` : host;
  console.log(
    `http://${quotedHost}:${port}/emulator/v1/projects/${testEnv.projectId}:ruleCoverage.html`
  );
});

beforeEach(async () => {
  testEnv.clearFirestore();
  await seedUsers();
});

describe('artifact access', () => {
  it('allows read access by user', async () => {
    await seedArtifact({ id: 'potato', readers: { users: { alice: true } } });

    const db = testEnv.authenticatedContext('alice').firestore();
    await assertSucceeds(db.doc('artifacts/potato').get());
  });

  it('allows read access by group', async () => {
    await seedArtifact({ id: 'potato', readers: { groups: { groupa: true } } });

    const db = testEnv.authenticatedContext('alice').firestore();
    await assertSucceeds(db.doc('artifacts/potato').get());
  });

  it('blocks read access', async () => {
    await seedArtifact({
      id: 'potato',
      readers: { groups: { groupa: true }, users: { alice: true } },
    });

    const db = testEnv.authenticatedContext('bob').firestore();
    await assertFails(db.doc('artifacts/potato').get());
  });

  it('allows write access by user', async () => {
    await seedArtifact({ id: 'potato', writers: { users: { alice: true } } });

    const db = testEnv.authenticatedContext('alice').firestore();
    await assertSucceeds(
      db.doc('artifacts/potato').update({ potato: 'whatever' })
    );
  });

  it('allows write access by group', async () => {
    await seedArtifact({ id: 'potato', writers: { groups: { groupa: true } } });

    const db = testEnv.authenticatedContext('alice').firestore();
    await assertSucceeds(
      db.doc('artifacts/potato').update({ potato: 'whatever' })
    );
  });

  it('blocks write access', async () => {
    await seedArtifact({
      id: 'potato',
      writers: { groups: { groupa: true }, users: { alice: true } },
    });

    const db = testEnv.authenticatedContext('bob').firestore();
    await assertFails(
      db.doc('artifacts/potato').update({ potato: 'whatever' })
    );
  });
});

async function seedArtifact({
  id,
  owners,
  writers,
  readers,
}: {
  id: string;
  owners?: Acl;
  readers?: Acl;
  writers?: Acl;
}) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await db.doc(`/artifacts/${id}`).set({ foo: 'bar' });
    await tick();
    if (owners) {
      await db.doc(`/artifacts/${id}/_/owners`).set(owners);
    }
    if (writers) {
      await db.doc(`/artifacts/${id}/_/writers`).set(writers);
    }
    if (readers) {
      await db.doc(`/artifacts/${id}/_/readers`).set(readers);
    }
  });
}

async function seedUsers() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await Promise.all(
      [
        { path: '/users/alice', value: {} },
        { path: '/users/bob', value: {} },
        { path: '/users/charlie', value: {} },
        {
          path: '/users/alice/_/memberships',
          value: { indirect: { groupa: true, groupb: true, groupc: true } },
        },
        {
          path: '/users/bob/_/memberships',
          value: { indirect: { groupb: true, groupc: true } },
        },
        {
          path: '/users/charlie/_/memberships',
          value: { indirect: { groupc: true } },
        },
      ].map((v) => db.doc(v.path).set(v.value))
    );
  });
}
