# esbuild-mix-manifest-plugin

An [esbuild](https://esbuild.github.io/) plugin to generate a `mix-manifest.json` compatible with [Laravel Mix](https://laravel.com/docs/master/mix#versioning-and-cache-busting).

## Usage

> TBD

```js
esbuild.build({
    // Define entrypoints to be bundled.
    entryPoints: {
        'css/main': 'resources/css/main.css',
    },

    // Define output directory and output base.
    // The CSS file above will be place in 
    // `source/assets/build/css/main.css`
    outdir: 'source/assets/build',
    outbase: 'source/assets/build',

    // Required for the plugin
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
