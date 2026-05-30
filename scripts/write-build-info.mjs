import { mkdir, writeFile } from 'node:fs/promises';

const commitSha =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  'local';

const commitRef =
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.GITHUB_REF_NAME ||
  process.env.GITHUB_REF ||
  'local';

const buildInfo = {
  project: 'myalchemy-report',
  productName: 'My Alchemy',
  repo: process.env.GITHUB_REPOSITORY || 'andylitvinov-design/report',
  commitSha,
  commitRef,
  buildTime: new Date().toISOString(),
  platform: process.env.VERCEL ? 'Vercel' : 'GitHub Pages or local',
  productionUrl: 'https://myalchemy.vercel.app/',
  alternateUrl: 'https://holistichealing.vercel.app/',
  legacyUrl: 'https://andylitvinov-design.github.io/report/'
};

await mkdir('public', { recursive: true });
await writeFile('public/build-info.json', `${JSON.stringify(buildInfo, null, 2)}\n`);

console.log('Wrote public/build-info.json');
console.log(JSON.stringify(buildInfo, null, 2));
