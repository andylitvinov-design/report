import { readFileSync, writeFileSync } from 'node:fs';
const b64 = readFileSync('design/ref-small.b64', 'utf8').replace(/\s+/g, '');
writeFileSync('design/ref-small.jpg', Buffer.from(b64, 'base64'));
console.log('created design/ref-small.jpg');
