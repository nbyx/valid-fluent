import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from "@rollup/plugin-terser";

export default {
    input: 'src/index.ts', // Entry file
    output: [
        {
            file: 'dist/bundle.cjs.js', // CommonJS bundle
            format: 'cjs'
        },
        {
            file: 'dist/bundle.esm.js', // ES module bundle
            format: 'es'
        }
    ],
    plugins: [
        typescript(),
        resolve(),
        commonjs(),
        terser(),
    ]
};