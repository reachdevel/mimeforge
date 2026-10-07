/** Rasterize an SVG string. Needs the optional dependency `@resvg/resvg-js`. */
export async function renderPng(svg: string, size: number): Promise<Buffer> {
  let mod: { Resvg: new (svg: string, opts: object) => { render(): { asPng(): Buffer } } };
  try {
    mod = (await import('@resvg/resvg-js')) as unknown as typeof mod;
  } catch {
    throw new Error('PNG export needs the optional dependency @resvg/resvg-js (npm i @resvg/resvg-js).');
  }
  return new mod.Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
}
