import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

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
        commonjs()
    ]
};