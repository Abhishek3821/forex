import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { build } from 'esbuild';
import { unlink } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const generated = new URL('./.navigation-pages-check.mjs', import.meta.url);
await build({
  stdin: {
    contents: `export { MemoryRouter } from 'react-router-dom';
      export { navigationPages } from './src/data/navigationPages';
      export { pageExperiences } from './src/data/pageExperiences';
      export { RemainingDetailPage, RemainingCategoryPage } from './src/pages/RemainingPages';
      export { appRoutes } from './src/routes';
      export { navItems } from './src/data/siteData';
      export { navigationLinks, navigationGroupLinks } from './src/data/navigationLinks';`,
    resolveDir: root,
  },
  bundle: true, platform: 'node', format: 'esm', jsx: 'automatic',
  external: ['react', 'react-dom', 'react-dom/server'],
  banner: { js: `import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);` },
  outfile: fileURLToPath(generated),
  plugins: [{ name: 'ignore-visual-assets', setup(builder) {
    builder.onLoad({ filter: /\.(css|png|svg)$/ }, () => ({ contents: 'export default "illustrative-asset";', loader: 'js' }));
  } }],
});
try {
  const { MemoryRouter, navigationPages, pageExperiences, RemainingDetailPage, RemainingCategoryPage, appRoutes, navItems, navigationLinks, navigationGroupLinks } = await import(generated.href);
  const routes = new Set(appRoutes[0].children.map(route => route.index ? '/' : `/${route.path}`));
  const dedicated = new Set(['Web Trading Platform', 'White Label', 'Introducing Brokers', 'Asset Managers']);
  const remaining = navigationPages.filter(page => !dedicated.has(page.name));
  assert.equal(remaining.length, 12, 'Expected twelve remaining detail pages');
  for (const page of remaining) {
    const profile = pageExperiences[page.name];
    assert.ok(profile, `${page.name}: missing content profile`);
    assert.equal(profile.process.length, 4, `${page.name}: implementation steps`);
    assert.equal(profile.benefits.length, 3, `${page.name}: benefit content`);
    assert.equal(profile.faqs.length, 3, `${page.name}: FAQ content`);
    for (const name of profile.related) assert.ok(routes.has(navigationLinks[name]), `${page.name}: unknown related page ${name}`);
    const html = renderToString(React.createElement(MemoryRouter, {}, React.createElement(RemainingDetailPage, { page })));
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${page.name}: one main heading`);
    assert.ok((html.match(/<section[ >]/g) || []).length >= 8, `${page.name}: full page sections`);
    assert.equal((html.match(/<details[ >]/g) || []).length, 3, `${page.name}: expandable FAQs`);
    assert.equal((html.match(/aria-pressed="true"/g) || []).length >= 1, true, `${page.name}: selected capability`);
    assert.ok(!/href="(?:undefined|#)"/.test(html), `${page.name}: invalid link`);
    assert.ok(routes.has(page.path), `${page.name}: route missing`);
    assert.ok(html.includes('rp-layout-'), `${page.name}: distinct layout family`);
    assert.ok((html.match(/class="signal-graphic /g) || []).length >= 4, `${page.name}: graphical content`);
    console.log(`PASS ${page.path}`);
  }
  for (const category of ['Solutions', 'Technology']) {
    const html = renderToString(React.createElement(MemoryRouter, {}, React.createElement(RemainingCategoryPage, { category })));
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${category}: one main heading`);
    assert.ok((html.match(/<section[ >]/g) || []).length >= 6, `${category}: full hub sections`);
    assert.ok(!/href="(?:undefined|#)"/.test(html), `${category}: invalid link`);
    console.log(`PASS /${category.toLowerCase()}`);
  }
  for (const group of navItems) {
    assert.ok(routes.has(navigationGroupLinks[group.label]), `${group.label}: group route missing`);
    for (const item of group.items || []) assert.ok(routes.has(navigationLinks[item]), `${item}: navbar route missing`);
  }
  for (const path of ['solutions/forex-brokers', 'solutions/prop-firms', 'solutions/liquidity-providers', 'solutions/white-label', 'solutions/introducing-brokers', 'solutions/asset-managers', 'platform', 'platform/web-trading']) {
    const route = appRoutes[0].children.find(item => item.path === path);
    const html = renderToString(React.createElement(MemoryRouter, {}, route.element));
    assert.ok(html.includes('visual-ribbon '), `${path}: dedicated page graphic`);
    assert.ok(html.includes('signal-graphic '), `${path}: rendered SVG visual`);
    console.log(`PASS graphics /${path}`);
  }
  const home = appRoutes[0].children.find(item => item.index);
  const homeHtml = renderToString(React.createElement(MemoryRouter, {}, home.element));
  assert.ok(homeHtml.includes('home-feature-bento'), 'Home: asymmetrical feature layout');
  assert.ok(homeHtml.includes('signal-graphic '), 'Home: feature graphics');
  console.log('PASS home page graphics');
  const seen = new Set();
  for (const route of appRoutes[0].children) {
    if (route.path && ['about', 'contact-us', 'forex-broker', 'forex-brokers', 'prop-firms', 'liquidity-providers', 'white-label', 'introducing-brokers', 'asset-managers'].includes(route.path)) continue;
    const html = renderToString(React.createElement(MemoryRouter, {}, route.element));
    const firstSectionEnd = html.indexOf('</section>');
    const hero = firstSectionEnd === -1 ? html : html.slice(0, firstSectionEnd);
    const path = route.index ? '/' : `/${route.path}`;
    assert.ok(hero.includes('hero-enhanced'), `${path}: enhanced hero`);
    assert.ok(!hero.includes('hero-atmosphere'), `${path}: hero background effect removed`);
    assert.ok(hero.includes('hero-graphic-primary'), `${path}: primary hero graphic`);
    assert.ok(hero.includes('hero-graphic-secondary'), `${path}: secondary hero graphic`);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${path}: one main heading after hero update`);
    seen.add(path);
  }
  assert.equal(seen.size, 26, 'All primary page heroes covered');
  console.log(`PASS enhanced hero and two graphics on ${seen.size} primary pages`);
  console.log('PASS every desktop/mobile navbar destination resolves to an application route');
} finally {
  await unlink(generated);
}
