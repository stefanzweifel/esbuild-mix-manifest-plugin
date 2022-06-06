// Test suite heavily inspired by https://github.com/jfortunato/esbuild-plugin-manifest.

import mixManifestPlugin from '../src/index';
// @ts-ignore
import fs from 'fs';
import rimraf from 'rimraf';

const OUTPUT_MANIFEST = 'test/output/mix-manifest.json';

function buildOptions(pluginOptions = {}, overrideBuildOptions = {}) {
    const defaultBuildOptions = {
        entryPoints: {
            'css/example': 'test/input/example.css',
            'js/example': 'test/input/example.js',
        },
        outdir: 'test/output',
        outbase: 'test/output',
        metafile: true,
        plugins: [mixManifestPlugin(pluginOptions)],
    }

    return {...defaultBuildOptions, ...overrideBuildOptions};
};

function metafileContents(): { [key: string]: string } {
    return JSON.parse(fs.readFileSync(OUTPUT_MANIFEST, 'utf-8'));
};

beforeEach(() => {
    return new Promise(resolve => rimraf('test/output', resolve))
});

test('it returns a valid esbuild plugin interface', () => {
    expect(mixManifestPlugin()).toHaveProperty('name');
    expect(mixManifestPlugin()).toHaveProperty('setup');
    expect(mixManifestPlugin().name).toBe('esbuild-mix-manifest-plugin');
});

test('it works with a require call', () => {
    const mixManifestPlugin = require('../src/index');
    expect(mixManifestPlugin()).toHaveProperty('name');
    expect(mixManifestPlugin()).toHaveProperty('setup');
});

test('it should include the esbuild metafile during setup', async () => {
    const result = await require('esbuild').build(buildOptions());

    expect(result).toHaveProperty('metafile');
});

test('it should generate the manifest.json in the outdir', async () => {
    await require('esbuild').build(buildOptions());

    expect(fs.existsSync(OUTPUT_MANIFEST)).toBe(true);
});

test('it should generate hashed filenames by default', async () => {
    await require('esbuild').build(buildOptions());

    expect(metafileContents()['/js/example.js']).toMatch(/\/js\/example\.js\?id\=[^\.]*$/);
    expect(metafileContents()['/css/example.css']).toMatch(/\/css\/example\.css\?id\=[^\.]*$/);
});

test('it should generate a different filename if specified', async () => {
    await require('esbuild').build(buildOptions({filename: 'example.json'}));

    expect(fs.existsSync('test/output/example.json')).toBe(true);
    expect(fs.existsSync(OUTPUT_MANIFEST)).toBe(false);
});

test('it should throw an error if building without an outdir or outfile', async () => {
    expect.assertions(2);

    try {
        await require('esbuild').build(buildOptions({}, {outdir: undefined, outfile: undefined}));
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/outdir/);
    }
});

test('it should throw an error with esbuild write=false option', async () => {
    expect.assertions(2);

    try {
        await require('esbuild').build(buildOptions({}, {write: false}));
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toMatch(/write=false option/);
    }
})
