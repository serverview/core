
import * as pkg from "../package.json";

// --- CONFIGURATION ---

export const PORT = Bun.env.PORT || 44080;
export const BASE_PATH = Bun.env.BASE_PATH || '/var/www/svh';
export const SV_VERSION = pkg.version;
export const INDEX_FILES = (Bun.env.INDEX_FILES || 'index.svh,index.html').split(',');
// ---------------------
