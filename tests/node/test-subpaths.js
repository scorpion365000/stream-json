import {test} from 'tape-six';

test.asPromise('subpath /: default Node entry exposes parserStream + parser', async (t, resolve) => {
  const main = await import('@yahyeapps/stream-json');
  t.equal(typeof main.default, 'function', 'default export is a function');
  t.equal(typeof main.parserStream, 'function', 'named parserStream exported');
  t.equal(typeof main.parser, 'function', 'named parser exported');
  t.equal(main.default, main.parserStream, 'default === parserStream');
  t.equal(typeof main.parser.asStream, 'function', 'parser.asStream attached on default entry');
  t.equal(typeof main.parser.asWebStream, 'function', 'parser.asWebStream attached on default entry');
  resolve();
});

test.asPromise('subpath /web: parserWebStream + parser exposed; Web-shaped only', async (t, resolve) => {
  const web = await import('@yahyeapps/stream-json/web');
  t.equal(typeof web.default, 'function', 'default export is a function');
  t.equal(typeof web.parserWebStream, 'function', 'named parserWebStream exported');
  t.equal(typeof web.parser, 'function', 'named parser exported');
  t.equal(web.default, web.parserWebStream, 'default === parserWebStream');
  t.equal(typeof web.parser.asWebStream, 'function', 'parser.asWebStream attached on web entry');
  resolve();
});

test.asPromise('default and /web share the same underlying core parser', async (t, resolve) => {
  const main = await import('@yahyeapps/stream-json');
  const web = await import('@yahyeapps/stream-json/web');
  const core = await import('@yahyeapps/stream-json/core/parser.js');
  t.equal(main.parser, core.default, 'main parser === core parser');
  t.equal(web.parser, core.default, 'web parser === core parser');
  resolve();
});

test.asPromise('subpath /<component>: wildcard `./*` resolves Node wrappers', async (t, resolve) => {
  const components = [
    ['@yahyeapps/stream-json/parser.js', 'parser'],
    ['@yahyeapps/stream-json/disassembler.js', 'disassembler'],
    ['@yahyeapps/stream-json/stringer.js', 'stringer'],
    ['@yahyeapps/stream-json/assembler.js', 'Assembler'],
    ['@yahyeapps/stream-json/utils/batch.js', 'batch'],
    ['@yahyeapps/stream-json/utils/verifier.js', 'verifier'],
    ['@yahyeapps/stream-json/utils/with-parser.js', 'withParser'],
    ['@yahyeapps/stream-json/utils/flex-assembler.js', 'FlexAssembler'],
    ['@yahyeapps/stream-json/filters/filter.js', 'filter'],
    ['@yahyeapps/stream-json/filters/pick.js', 'pick'],
    ['@yahyeapps/stream-json/filters/ignore.js', 'ignore'],
    ['@yahyeapps/stream-json/filters/replace.js', 'replace'],
    ['@yahyeapps/stream-json/streamers/stream-array.js', 'streamArray'],
    ['@yahyeapps/stream-json/streamers/stream-object.js', 'streamObject'],
    ['@yahyeapps/stream-json/streamers/stream-values.js', 'streamValues'],
    ['@yahyeapps/stream-json/jsonl/parser.js', 'jsonlParser'],
    ['@yahyeapps/stream-json/jsonl/stringer.js', 'jsonlStringer'],
    ['@yahyeapps/stream-json/jsonc/parser.js', 'parser'],
    ['@yahyeapps/stream-json/jsonc/stringer.js', 'stringer'],
    ['@yahyeapps/stream-json/jsonc/verifier.js', 'verifier']
  ];
  for (const [path, name] of components) {
    const mod = await import(path);
    t.ok(mod.default, `${path} has a default export`);
    t.equal(typeof mod.default, name === 'Assembler' || name === 'FlexAssembler' ? 'function' : 'function', `${path} default is callable`);
  }
  resolve();
});

test.asPromise('subpath /web/<component>: stream-shaped wrappers expose asWebStream', async (t, resolve) => {
  const components = [
    '@yahyeapps/stream-json/web/parser.js',
    '@yahyeapps/stream-json/web/disassembler.js',
    '@yahyeapps/stream-json/web/stringer.js',
    '@yahyeapps/stream-json/web/utils/batch.js',
    '@yahyeapps/stream-json/web/utils/verifier.js',
    '@yahyeapps/stream-json/web/utils/with-parser.js',
    '@yahyeapps/stream-json/web/filters/filter.js',
    '@yahyeapps/stream-json/web/filters/pick.js',
    '@yahyeapps/stream-json/web/filters/ignore.js',
    '@yahyeapps/stream-json/web/filters/replace.js',
    '@yahyeapps/stream-json/web/streamers/stream-array.js',
    '@yahyeapps/stream-json/web/streamers/stream-object.js',
    '@yahyeapps/stream-json/web/streamers/stream-values.js',
    '@yahyeapps/stream-json/web/jsonl/parser.js',
    '@yahyeapps/stream-json/web/jsonl/stringer.js',
    '@yahyeapps/stream-json/web/emitter.js',
    '@yahyeapps/stream-json/web/jsonc/parser.js',
    '@yahyeapps/stream-json/web/jsonc/stringer.js',
    '@yahyeapps/stream-json/web/jsonc/verifier.js'
  ];
  for (const path of components) {
    const mod = await import(path);
    t.ok(mod.default, `${path} has a default export`);
    t.equal(typeof mod.default.asWebStream, 'function', `${path} default.asWebStream is callable`);
  }
  resolve();
});

test.asPromise('subpath /web/<assembler>: class re-exports keep identity', async (t, resolve) => {
  const webAsm = await import('@yahyeapps/stream-json/web/assembler.js');
  const coreAsm = await import('@yahyeapps/stream-json/core/assembler.js');
  t.equal(webAsm.default, coreAsm.default, 'web/assembler === core/assembler (no Node-stream coupling)');

  const webFlex = await import('@yahyeapps/stream-json/web/utils/flex-assembler.js');
  const coreFlex = await import('@yahyeapps/stream-json/core/utils/flex-assembler.js');
  t.equal(webFlex.default, coreFlex.default, 'web/flex-assembler === core/flex-assembler');
  resolve();
});
