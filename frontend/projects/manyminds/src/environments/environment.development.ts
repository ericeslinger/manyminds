export const environment = {
  useEmulators: true,
  production: false,
  firebase: {
    projectId: 'demo-trellis',
    apiKey: 'demo-api-key',
  },
};

// Makes life easier in dev mode.
import 'zone.js/plugins/zone-error'; // Included with Angular CLI.
