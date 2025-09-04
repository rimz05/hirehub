// instrument.js
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: "https://01b76a85f6a7cb603ae78446350d22e0@o4509139189104640.ingest.us.sentry.io/4509139342327808",
  integrations: [nodeProfilingIntegration(),
    Sentry.mongooseIntegration()
  ],
//   tracesSampleRate: 1.0, // Adjust this as needed for performance tracing
  profilesSampleRate: 1.0, // Adjust this as needed for profiling
});
