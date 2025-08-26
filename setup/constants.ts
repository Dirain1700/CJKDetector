"use strict";

import * as path from "node:path";

export const UNIHAN_URL = "https://www.unicode.org/Public/UNIDATA/Unihan.zip";
export const DATA_DIR = process.env.UNIHAN_DATA_DIR || "./unihan_data";
export const RAW_DIR = path.join(DATA_DIR, "raw");
export const ZIP_INDEX = path.join(RAW_DIR, "Unihan.zip");
export const DISTRIBUTED_CODES_DIR = path.join(DATA_DIR, "result");
