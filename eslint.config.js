import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals'; // 导入 globals 包

export default [
  // eslint.configs.recommended, // 可以保留全局推荐规则，或根据需要调整
  {
    files: ['**/*.ts', '**/*.js'], // 将规则应用于 TS 和 JS 文件
    languageOptions: {
      globals: {
        // 添加 globals 配置
        ...globals.node, // 引入 Node.js 的标准全局变量 (包括 console, process 等)
      },
      parser: tseslintParser, // TypeScript 解析器也能解析 JavaScript
      parserOptions: {
        // project: './tsconfig.json', // 对 JS 文件应用 project 可能需要额外配置，可以考虑移除或分块配置
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
    },
    rules: {
      ...eslint.configs.recommended.rules, // 应用推荐的 JS 规则
      ...tseslint.configs.recommended.rules, // 应用推荐的 TS 规则
      ...eslintConfigPrettier.rules, // 应用 Prettier 规则
      // 你的特定规则覆盖:
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': 'error',
      // 设置了 globals.node 后，通常不需要再禁用 no-undef
    },
  },
  // 如果需要为 JS 文件设置更特定的规则或不同的解析器选项，可以添加单独的配置块
  // {
  //   files: ['packages/create-nestx/src/**/*.js'], // 更精确地定位 JS 文件
  //   languageOptions: {
  //     globals: { ...globals.node },
  //     sourceType: 'module',
  //     // parser: /* 可以指定不同的 JS 解析器 */,
  //   },
  //   rules: {
  //     // JS 特有的规则
  //   }
  // }
];
