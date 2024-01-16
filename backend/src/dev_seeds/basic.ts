import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

(async () => {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  process.env.FIRESTORE_FUNCTIONS_EMULATOR_HOST = 'localhost:5001';

  admin.initializeApp({ projectId: 'demo-trellis' });

  const firestore = getFirestore();

  await firestore.doc('site/meta').create({
    name: 'Manyminds',
  });

  await firestore.doc('posts/1').create({
    id: '1',
    handle: 'The first post',
    body: `
    # This is the first post
    And it is cool
  `,
    public: true,
    tags: ['meta', 'site', 'first'],
  });
})();
