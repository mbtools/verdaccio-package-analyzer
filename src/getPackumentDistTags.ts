import fs from 'fs/promises';
import { PackageResult, NpmPackument, TagInfo } from './types';

async function getPackumentDistTags() {
  try {
    const packageList = (await fs.readFile('input/package-list.md', 'utf-8'))
      .replace(/\r/g, '')
      .split('\n')
      .filter(line => line.trim() && !line.startsWith('#'));

    const results: PackageResult[] = [];

    for (const pkg of packageList) {
      console.log(`Processing package: ${pkg}`);
      const url = `https://registry.npmjs.org/${pkg}`;
      
      try {
        const response = await fetch(url);
        const packument = await response.json() as NpmPackument;
        const distTags = packument['dist-tags'];
        const time = packument.time;

        const tagInfo: TagInfo[] = Object.entries(distTags).map(([tag, version]) => ({
          Tag: tag,
          Version: version,
          PublishDate: time[version]
        }));

        results.push({
          Package: pkg,
          Tags: tagInfo
        });
      } catch (error) {
        results.push({
          Package: pkg,
          Tags: [],
          Error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    await fs.writeFile(
      'data/dist-tags.json',
      JSON.stringify(results, null, 2),
      'utf-8'
    );
    console.log('Results saved to dist-tags.json');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

getPackumentDistTags(); 