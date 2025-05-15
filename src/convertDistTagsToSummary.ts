import fs from 'fs/promises';
import { PackageResult } from './types';

async function convertDistTagsToSummary() {
  try {
    const data = await fs.readFile('data/dist-tags.json', 'utf-8');
    const results = JSON.parse(data) as PackageResult[];

    const md: string[] = ['# Verdaccio NPM Package Version Summary\n'];
    md.push('| Package | Latest | 6-next | next | next-7 | next-8 | Other Tags |');
    md.push('|---------|---------|---------|------|---------|---------|------------|');

    for (const entry of results) {
      const { Package, Tags } = entry;
      
      // Initialize version variables
      let latest = '-';
      let sixNext = '-';
      let next = '-';
      let nextSeven = '-';
      let nextEight = '-';
      const otherTags: string[] = [];

      // Process each tag
      for (const tag of Tags) {
        switch (tag.Tag) {
          case 'latest':
            latest = tag.Version;
            break;
          case '6-next':
            sixNext = tag.Version;
            break;
          case 'next':
            next = tag.Version;
            break;
          case 'next-7':
            nextSeven = tag.Version;
            break;
          case 'next-8':
            nextEight = tag.Version;
            break;
          default:
            otherTags.push(tag.Tag);
        }
      }

      // Format other tags
      const otherTagsStr = otherTags.length > 0 
        ? otherTags.sort().join(', ')
        : '-';

      // Add row to markdown
      md.push(`| ${Package} | ${latest} | ${sixNext} | ${next} | ${nextSeven} | ${nextEight} | ${otherTagsStr} |`);
    }

    await fs.writeFile('output/summary.md', md.join('\n'), 'utf-8');
    console.log('Summary table generated in summary.md');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

convertDistTagsToSummary(); 