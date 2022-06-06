# esbuild-mix-manifest-plugin

[![Tests](https://github.com/stefanzweifel/esbuild-mix-manifest-plugin/actions/workflows/run-tests.yml/badge.svg)](https://github.com/stefanzweifel/esbuild-mix-manifest-plugin/actions/workflows/run-tests.yml)

An [esbuild](https://esbuild.github.io/) plugin to generate a `mix-manifest.json` compatible with [Laravel Mix](https://laravel.com/docs/master/mix#versioning-and-cache-busting).

## Installation

You can install the plugin via npm or yarn:

```bash
npm install @stefanzweifel/esbuild-mix-manifest-plugin --save-dev
yarn add @stefanzweifel/esbuild-mix-manifest-plugin --dev
```

## Usage

Load the `mixManifestPlugin` in your `esbuild.js`, `build.js` (or whatever you call it) and pass it to the `plugins` option of `esbuild.build()`.

You MUST set the `outdir` and `outbase` config values accordingly.
`metafile` MUST be set to true, for the plugin to work.

```js
// build.js
const esbuild = require('esbuild')
const mixManifestPlugin = require('@stefanzweifel/esbuild-mix-manifest-plugin')

esbuild.build({
    // Define entrypoints to be bundled.
    entryPoints: {
        'css/main': 'resources/css/main.css',
        'js/main': 'resources/js/main.js',
    },

    // Define output directory and output base.
    // The JS and CSS file above will be place in 
    // `source/assets/build/css/main.css`
    // `source/assets/build/js/main.js`
    outdir: 'source/assets/build',
    outbase: 'source/assets/build',

    // Required for the plugin to work
    metafile: true,

    plugins: [
        mixManifestPlugin({
            // Options
            filename: 'mix-manifest.json'
        }),
    ],
});
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [Stefan Zweifel](https://github.com/stefanzweifel)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
