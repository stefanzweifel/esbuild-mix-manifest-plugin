const { readFileSync, writeFileSync } = require('fs');
const path = require('path');
const md5 = require("md5");

let mixManifestPlugin = function(options) {
    return {
        name: 'esbuild-mix-manifest-plugin',
        setup(build) {
            build.onEnd((result) => {
                if (!result.metafile) {
                    return;
                }

                const outputs = result.metafile.outputs;
                if (!outputs) {
                    return;
                }

                const { outdir, outbase } = build.initialOptions;
                const fullOutdir = path.resolve(process.cwd(), outdir);

                const manifest = {};

                for (const outputsKey in outputs) {

                    // Generate Hash based on the content of the file.
                    let content = readFileSync(outputsKey, { encoding: 'utf-8' });
                    let hash = md5(content).substr(0, 20);

                    let filePath = outputsKey;

                    // Remove outdir from filepath
                    let updatedFilePath = filePath.replace(outdir, '', filePath);

                    // Remove outbase from filepath
                    updatedFilePath = filePath.replaceAll(outbase, '', filePath);

                    manifest[updatedFilePath] = updatedFilePath + '?id=' + hash;
                }


                writeFileSync(
                    path.resolve(fullOutdir, options.filename ? options.filename : 'mix-manifest.json'),
                    JSON.stringify((manifest), null, '  '),
                    { encoding: 'utf-8' },
                );
            });

        },
    };
};

module.exports = mixManifestPlugin;
