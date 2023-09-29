import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from "@rollup/plugin-terser";
import del from 'rollup-plugin-delete';
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
        typescript({ exclude: ['**/*.test.ts']}),
        resolve(),
        commonjs(),
        terser(),
        del({ targets: 'dist/*.test.d.ts'}),
    ]
};