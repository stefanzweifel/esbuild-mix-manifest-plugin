import { BuildResult, Plugin, PluginBuild } from 'esbuild';
import path from "path";
import md5 from "md5";
import {readFileSync, writeFileSync} from 'fs';

interface ManifestPluginOptions {
    filename?: string;
}

interface Manifest {
    [key: string]: string,
}

function convertManifestToString(manifest: Manifest): string {
    return JSON.stringify(manifest, null, 4);
}

function writeManifestToFile(fullPath: string, content: string) {
    writeFileSync(fullPath, content);
}

let mixManifestPlugin = function (options: ManifestPluginOptions = {}): Plugin {
    return {
        name: 'esbuild-mix-manifest-plugin',
        setup(build: PluginBuild) {
            build.onEnd((result: BuildResult) => {

                const defaultPluginOptions: ManifestPluginOptions = {
                    filename: 'mix-manifest.json',
                }
                const pluginOptions: ManifestPluginOptions = {...defaultPluginOptions, ...options};

                // Abort if no Metafile is available.
                if (!result.metafile) {
                    throw new Error("[mix-manifest-plugin] Metafile not found. Add `metafile: true` to your esbuild config and try again.");
                }

                const outputs: object = result.metafile.outputs;

                // Abort if no Outputs are found.
                if (!outputs) {
                    throw new Error("[mix-manifest-plugin] Outputs not found. Did you declare files in `entryPoints`?.");
                }

                if (build.initialOptions.outdir === undefined) {
                    throw new Error("[mix-manifest-plugin] You must specify an 'outdir' when generating a manifest file.");
                }

                if (build.initialOptions.outbase === undefined) {
                    throw new Error("[mix-manifest-plugin] You must specify an 'outbase' when generating a manifest file.");
                }

                // With the esbuild write=false option, nothing will be written to disk. We don't support this option yet.
                if (build.initialOptions.write === false) {
                    throw new Error("[mix-manifest-plugin] Plugin does not support write=false option.");
                }

                const {outdir, outbase} = build.initialOptions;
                const fullOutdir: string = path.resolve(process.cwd(), outdir);

                const manifest: Manifest = {};

                for (const outputsKey in outputs) {
                    // Generate Hash based on the content of the file.
                    let content: string = readFileSync(outputsKey, {encoding: 'utf-8'});
                    let hash: string = md5(content).substr(0, 20);

                    let filePath: string = outputsKey;

                    // Remove outdir from filepath
                    let updatedFilePath = filePath.replace(outdir, '');

                    // Remove outbase from filepath
                    updatedFilePath = filePath.replaceAll(outbase, '');

                    manifest[updatedFilePath] = `${updatedFilePath}?id=${hash}`;
                }

                const fullPath: string = path.resolve(fullOutdir, pluginOptions.filename);
                const text: string = convertManifestToString(manifest);

                writeManifestToFile(fullPath, text);
            });
        },
    };
};

module.exports = mixManifestPlugin;

export default mixManifestPlugin;
