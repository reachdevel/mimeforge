export const CATEGORIES = [
  'generic', 'text', 'code', 'data', 'pdf', 'word', 'sheet', 'slides', 'image', 'audio', 'video',
  'archive', 'font', 'ebook', 'database', 'executable', 'security', 'model3d', 'geo', 'mail', 'science',
  'disk', 'design', 'game',
] as const;
export type Category = (typeof CATEGORIES)[number];

export const isCategory = (v: string): v is Category => (CATEGORIES as readonly string[]).includes(v);

/** Extension → category for popular formats that mime types alone get wrong or do not know. Checked first. */
const EXT_GROUPS: Record<Exclude<Category, 'generic' | 'pdf' | 'word' | 'sheet' | 'slides' | 'audio' | 'video'>, string> = {
  text: 'txt text md markdown mdx log ini conf cfg rst adoc org tex lock gitignore editorconfig',
  code: 'js mjs cjs jsx ts tsx mts cts vue svelte astro py pyw rb go rs java kt kts swift c h cc cpp cxx hpp hh cs fs php sh bash zsh fish ps1 bat cmd lua pl pm r scala dart ex exs erl hs clj groovy gradle makefile dockerfile html htm xhtml css scss sass less ipynb vb vbs asm wasm coffee elm nim zig',
  data: 'json jsonc json5 jsonl ndjson yaml yml toml xml xsd xsl xslt rss atom plist env properties proto graphql gql ndjson csv-schema',
  image: 'jpg jpeg png gif webp avif heic heif bmp tif tiff ico icns svg raw cr2 nef dng jxl apng',
  archive: 'zip rar 7z tar gz tgz bz2 xz zst lz lz4 lzma cab jar war ear pkg deb rpm apk arc gtar ustar cfs msix msixbundle appx appxbundle sis sisx crx xpi oxt',
  font: 'ttf otf woff woff2 eot',
  ebook: 'epub mobi azw azw3 fb2 cbz cbr djvu lrf',
  database: 'db sqlite sqlite3 mdb accdb sql dbf',
  executable: 'exe msi app dll so dylib elf out com run class luac application xbap',
  security: 'pem key crt cer der pub gpg pgp asc pfx p12 jks csr kdbx scq scs spq spp roa mft dssc',
  model3d: 'glb gltf obj stl fbx dae 3ds blend step stp ply usdz',
  geo: 'kml kmz gpx geojson shp dwg dxf gml mvt mgp',
  mail: 'eml msg mbox ics vcf emlx',
  science: 'hdf hdf5 h5 nc mat fits cif pdb sdf mol seed mseed dataless',
  disk: 'iso dmg img toast vhd vhdx vmdk vdi qcow qcow2 ova ovf vbox vbox-extpack hdd nrg mdf wim',
  design: 'psd psb ai sketch fig xd indd indt idml cdr afdesign afphoto afpub xcf kra ora vsd vsdx vss vst vsw vtx vdx qwd qwt qxb qxd qxl qxt fm frame maker book',
  game: 'z1 z2 z3 z4 z5 z6 z7 z8 wad gam t3 sm smzip n-gage ngdat blb blorb c4d c4f c4g c4p c4u dir dcr dxr cst cct cxt w3d fgd swa aam aas swf rom nes smc sfc gba gbc gb nds n64 z64 v64 sav srm sms gg pce nsp xci pak vpk unity3d uasset umap',
};
/** Office-like and other formats mapped by function (no brand-specific bodies). */
const FUNCTION_MAP: Record<string, Category> = {
  // Google Workspace shortcut files
  gdoc: 'word', gsheet: 'sheet', gslides: 'slides', gdraw: 'image', gscript: 'code', gmap: 'geo',
  // StarOffice / StarDivision
  sdw: 'word', sgl: 'word', vor: 'word', sdc: 'sheet', smf: 'sheet', sdd: 'slides', sda: 'image',
  // MS Works, Project, Office theme, OneNote, XPS, HTML help
  wps: 'word', wcm: 'word', wks: 'sheet', wdb: 'database', mpt: 'sheet', thmx: 'slides',
  one: 'text', onea: 'text', onepkg: 'text', onetmp: 'text', onetoc: 'text', onetoc2: 'text', xps: 'pdf', chm: 'ebook',
  // KDE Calligra / KOffice
  kwd: 'word', kwt: 'word', ksp: 'sheet', kpr: 'slides', kpt: 'slides',
  // misc
  procreate: 'image', dra: 'image', dsf: 'image', xfdf: 'data', siv: 'code', sieve: 'code', texi: 'text', texinfo: 'text',
  icc: 'data', icm: 'data', pcap: 'data', cap: 'data', dmp: 'data',
  // formats found while triaging the generic list
  wpd: 'word', abw: 'word', fdf: 'pdf', oxps: 'pdf',
  saf: 'audio', spf: 'audio', mmf: 'audio', mlp: 'audio', rm: 'video', rmvb: 'video', mxf: 'video',
  // Lotus, Gnumeric and other office-like formats
  lwp: 'word', '123': 'sheet', gnumeric: 'sheet', pre: 'slides', apr: 'database', nsf: 'mail', see: 'mail',
  // archives / packages
  mar: 'archive', ipk: 'archive', joda: 'archive', portpkg: 'archive', ez3: 'archive',
  // audio (Yamaha HV, karaoke, music notation), video, compiled code, DRM / crypto, dynamic geometry & math
  hvp: 'audio', hvs: 'audio', mmd: 'audio', mus: 'audio', qam: 'video', mvb: 'video', elc: 'code', wmlsc: 'code',
  irm: 'security', nns: 'security', cryptonote: 'security',
  geo: 'science', i2g: 'science', cdy: 'science', dpg: 'science', kfo: 'science', nbp: 'science',
  // old archive formats, Android App Bundle (zip), Windows Installer parts, WML, RDF/SPARQL/MARC, KDE/Micrografx drawing, math, misc
  arj: 'archive', bcpio: 'archive', cpt: 'archive', dgc: 'archive', gca: 'archive', hqx: 'archive', sea: 'archive',
  shar: 'archive', sv4cpio: 'archive', sv4crc: 'archive', udeb: 'archive', aab: 'archive',
  osf: 'audio', hvd: 'audio', m13: 'video', m14: 'video', msm: 'executable', msp: 'executable', wmlc: 'code',
  nq: 'data', nt: 'data', rq: 'data', trig: 'data', mrc: 'data',
  flw: 'design', karbon: 'design', kon: 'design', flo: 'design', igx: 'design',
  gqf: 'science', gqs: 'science', mc1: 'science', fzs: 'sheet', chrt: 'sheet', atx: 'game',
};
const DOC_GROUPS: Record<string, Category> = {
  pdf: 'pdf', ps: 'pdf', eps: 'pdf', dvi: 'pdf',
  doc: 'word', docx: 'word', docm: 'word', dot: 'word', dotx: 'word', rtf: 'word', odt: 'word', pages: 'word',
  xls: 'sheet', xlsx: 'sheet', xlsm: 'sheet', xlsb: 'sheet', csv: 'sheet', tsv: 'sheet', ods: 'sheet', numbers: 'sheet',
  ppt: 'slides', pptx: 'slides', pptm: 'slides', pps: 'slides', ppsx: 'slides', odp: 'slides', key: 'slides',
};

export const EXT_OVERRIDES: ReadonlyMap<string, Category> = (() => {
  const m = new Map<string, Category>();
  for (const [cat, list] of Object.entries(EXT_GROUPS)) for (const ext of list.split(/\s+/)) m.set(ext, cat as Category);
  for (const [ext, cat] of Object.entries(DOC_GROUPS)) m.set(ext, cat);
  for (const [ext, cat] of Object.entries(FUNCTION_MAP)) m.set(ext, cat);
  m.set('key', 'slides'); // Keynote wins over the generic "private key" meaning
  return m;
})();

type Rule = [Category, RegExp];
/** Mime rules, first match wins (order matters: specific formats before broad ones). */
const MIME_RULES: Rule[] = [
  ['pdf', /^application\/(pdf|postscript|x-dvi)$/],
  ['word', /msword|wordprocessingml|vnd\.ms-word|\/rtf$|opendocument\.text|vnd\.sun\.xml\.writer/],
  ['sheet', /ms-excel|spreadsheetml|opendocument\.(spreadsheet|chart|formula)|vnd\.sun\.xml\.calc|^text\/(csv|tab-separated)/],
  ['slides', /powerpoint|presentationml|opendocument\.presentation|vnd\.sun\.xml\.impress/],
  ['database', /sqlite|ms-access|x-msaccess|opendocument\.database|x-dbf|^application\/sql/],
  ['ebook', /epub|mobipocket|x-fictionbook|x-cbr|x-cbz|ebook/],
  ['font', /^font\/|font-|-font|ms-fontobject/],
  ['image', /^image\/|opendocument\.(graphics|image)|x-msmetafile|x-emf|x-wmf/],
  ['video', /^video\/|^application\/(mp4|mp21)$/],
  ['audio', /^audio\/|mpegurl|x-scpls/],
  ['model3d', /^model\/|x-shader/],
  ['security', /pkcs|x509|pgp|pkix|x-pem|ms-pki|x-pkcs|cert|keys?$|pkixcmp/],
  ['geo', /google-earth|gpx|vnd\.geo|dwg|dxf|shapefile|^application\/gml/],
  ['mail', /^message\/|mbox|ms-outlook|^text\/(calendar|vcard|x-vcard)|^application\/(ics|vcard)/],
  ['science', /^chemical\/|x-hdf|netcdf|^application\/fits|mathematica|matlab|x-cdf/],
  ['archive', /zip|x-tar|gzip|x-7z|x-rar|rar-compressed|x-bzip|x-xz|x-compress|java-archive|x-rpm|vnd\.debian|x-iso9660|diskimage|android\.package|x-lzh|x-cpio|x-stuffit|x-ace|vnd\.ms-cab|installer/],
  ['executable', /x-msdownload|x-msdos-program|portable-executable|x-executable|x-msi|x-dosexec|x-mach-binary/],
  ['code', /javascript|ecmascript|^text\/(html|css|x-|javascript|typescript|jsx|tsx)|^application\/(x-sh(?![a-z])|x-csh|x-python|x-httpd|x-perl|x-ruby|x-php|wasm|typescript|x-tcl|sieve)/],
  ['data', /json|xml|yaml|cbor|protobuf|toml|graphql|rdf|iccprofile|^application\/(x-ndjson|x-plist)/],
  ['text', /^text\/|x-texinfo/],
];

export function classifyMime(mime: string): Category {
  for (const [cat, re] of MIME_RULES) if (re.test(mime)) return cat;
  return 'generic';
}

/**
 * Category for an extension (without dot, any case). `mimes` are all mime types registered for it; an extension can
 * have several (`mp4` is both application/mp4 and video/mp4), the first one that is not "generic" wins.
 */
export function classify(ext: string, mimes: string | readonly string[] = []): Category {
  const e = ext.toLowerCase().replace(/^\./, '');
  const override = EXT_OVERRIDES.get(e);
  if (override) return override;
  for (const m of typeof mimes === 'string' ? [mimes] : mimes) {
    const c = classifyMime(m);
    if (c !== 'generic') return c;
  }
  return 'generic';
}
