"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
async function convertDistTagsToSummary() {
    try {
        const data = await promises_1.default.readFile('data/dist-tags.json', 'utf-8');
        const results = JSON.parse(data);
        const md = ['# Verdaccio NPM Package Version Summary\n'];
        md.push('<div style="font-size:smaller">\n');
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
            const otherTags = [];
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
        md.push('\n</div>\n');
        await promises_1.default.writeFile('output/summary.md', md.join('\n'), 'utf-8');
        console.log('Summary table generated in summary.md');
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}
convertDistTagsToSummary();
