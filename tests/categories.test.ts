import { describe, expect, it } from 'vitest';
import { allExtensions, categoryFor, classify } from '../src/index.js';

describe('categories', () => {
  it.each([
    ['pdf', 'pdf'], ['docx', 'word'], ['xlsx', 'sheet'], ['pptx', 'slides'], ['png', 'image'], ['jpg', 'image'], ['mp3', 'audio'],
    ['mp4', 'video'], ['zip', 'archive'], ['ttf', 'font'], ['epub', 'ebook'], ['sqlite', 'database'], ['exe', 'executable'],
    ['pem', 'security'], ['glb', 'model3d'], ['kml', 'geo'], ['eml', 'mail'], ['json', 'data'], ['py', 'code'], ['tsx', 'code'],
    ['gdoc', 'word'], ['gsheet', 'sheet'], ['gslides', 'slides'], ['sdw', 'word'], ['wps', 'word'], ['one', 'text'], ['xps', 'pdf'], ['chm', 'ebook'],
    ['m3u8', 'audio'], ['wmf', 'image'], ['icc', 'data'], ['texi', 'text'], ['siv', 'code'], ['kwd', 'word'], ['m4p', 'video'], ['sh', 'code'],
    ['iso', 'disk'], ['dmg', 'disk'], ['vmdk', 'disk'], ['vhd', 'disk'], ['psd', 'design'], ['ai', 'design'], ['vsdx', 'design'], ['qxd', 'design'], ['fm', 'design'],
    ['z5', 'game'], ['rom', 'game'], ['wad', 'game'], ['swf', 'game'], ['gba', 'game'], ['dir', 'game'],
    ['gbr', 'generic'], ['kdbx', 'security'], ['rm', 'video'], ['mxf', 'video'], ['mmf', 'audio'], ['class', 'executable'], ['xpi', 'archive'], ['appx', 'archive'], ['lrf', 'ebook'], ['mseed', 'science'], ['mvt', 'geo'],
    ['lwp', 'word'], ['123', 'sheet'], ['pre', 'slides'], ['nsf', 'mail'], ['ipk', 'archive'], ['hvs', 'audio'], ['qam', 'video'], ['elc', 'code'], ['irm', 'security'], ['i2g', 'science'], ['cdy', 'science'],
    ['bin', 'generic'], ['sc', 'generic'], ['aep', 'generic'], ['bpk', 'generic'], ['deploy', 'generic'],
    ['arj', 'archive'], ['aab', 'archive'], ['msp', 'executable'], ['nt', 'data'], ['flw', 'design'], ['gqs', 'science'], ['chrt', 'sheet'], ['atx', 'game'], ['osf', 'audio'], ['m13', 'video'], ['wmlc', 'code'],
    ['xar', 'generic'], ['vox', 'generic'], ['dump', 'generic'], ['u32', 'generic'],
    ['txt', 'text'], ['md', 'text'], ['unknownext', 'generic'], ['.PDF', 'pdf'],
  ])('%s → %s', (ext, cat) => expect(categoryFor(ext)).toBe(cat));

  it('prefers the first non-generic mime of an extension', () => expect(classify('x', ['application/foo', 'video/x-foo'])).toBe('video'));
  it('knows 1000+ extensions, all lowercase', () => {
    const all = allExtensions();
    expect(all.length).toBeGreaterThan(1000);
    expect(all.every((e) => e === e.toLowerCase())).toBe(true);
  });
});
