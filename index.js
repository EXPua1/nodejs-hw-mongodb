import { initMongoConnection } from './src/db/initMongoConnection.js';
import { setupServer } from './src/server.js';

setupServer();
initMongoConnection();