import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'src/main.js',
  output: {
    file: 'bin/index.mjs', // 注意：ESM 文件通常使用 .mjs 扩展名
    format: 'es',
  },
  plugins: [
    nodeResolve({
      preferBuiltins: true, // Changed to true to properly handle built-ins
      exportConditions: ['node'], // Add node export conditions
    }),
    commonjs({
      ignoreDynamicRequires: true,
      requireReturnsDefault: 'auto',
    }),
    json(),
  ],
  external: [
    // Node.js built-ins
    'path',
    'fs',
    'fs/promises',
    'child_process',
    'os',
    'util',
    // External dependencies
    'inquirer',
    'fs-extra',
    'chalk',
    // Add any other dependencies used in your code
  ],
};
