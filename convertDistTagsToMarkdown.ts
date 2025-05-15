import fs from 'fs/promises';
import { PackageResult } from './types';

async function convertDistTagsToMarkdown() {
  try {
    const data = await fs.readFile('data/dist-tags.json', 'utf-8');
    const results = JSON.parse(data) as PackageResult[];

    const md: string[] = ['# Verdaccio NPM Package Dist-Tags\n'];

    for (const entry of results) {
      md.push(`## ${entry.Package}\n`);
      
      if (entry.Tags.length === 0) {
        if ('Error' in entry) {
          md.push(`_Error: ${entry.Error}_\n`);
        } else {
          md.push('_No dist-tags found._\n');
        }
        continue;
      }

      md.push('| Tag | Version | Publish Date |');
      md.push('|-----|---------|--------------|');
      
      for (const tag of entry.Tags) {
        md.push(`| ${tag.Tag} | ${tag.Version} | ${tag.PublishDate} |`);
      }
      
      md.push('');
    }

    await fs.writeFile('output/dist-tags.md', md.join('\n'), 'utf-8');
    console.log('Markdown report generated in dist-tags.md');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

convertDistTagsToMarkdown(); 