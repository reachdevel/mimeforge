/** Rasterize an SVG string. Needs the optional dependency `@resvg/resvg-js`. */
export async function renderPng(svg: string, size: number): Promise<Buffer> {
  let mod: { Resvg: new (svg: string, opts: object) => { render(): { asPng(): Buffer } } };
  try {
    mod = (await import('@resvg/resvg-js')) as unknown as typeof mod;
  } catch {
    throw new Error('PNG export needs the optional dependency @resvg/resvg-js (npm i @resvg/resvg-js).');
  }
  // Our icons contain no <text>, so skip loading system fonts (it dominates the render time).
  return new mod.Resvg(svg, { fitTo: { mode: 'width', value: size }, font: { loadSystemFonts: false } }).render().asPng();
}
