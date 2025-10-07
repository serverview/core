
import { startServer } from './server';
import { PORT, BASE_PATH, INDEX_FILES, SV_VERSION } from './config';

console.log(`
🎉 SVH Server v${SV_VERSION} is running on http://localhost:${PORT}`);
console.log(`Serving files from base path: ${BASE_PATH}`);
console.log(`Index files: ${INDEX_FILES.join(', ')}`);

startServer();
