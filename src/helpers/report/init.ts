/*eslint @typescript-eslint/no-unsafe-assignment: "off" */
/*eslint @typescript-eslint/no-unsafe-call: "off" */
/*eslint @typescript-eslint/no-unsafe-member-access: "off" */
const fs = require("fs-extra");

fs.ensureDir("test-results");
fs.emptyDir("test-results");