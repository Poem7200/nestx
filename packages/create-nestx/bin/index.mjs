#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'fs-extra';
import inquirer from 'inquirer';

// 确保路径正确解析
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const main = async () => {
  try {
    console.log(`\n🚀 欢迎使用 NestX 项目生成器\n`);

    const { templateName, projectName } = await inquirer.prompt([
      {
        name: 'templateName',
        type: 'list',
        message: '请选择一个模板：',
        choices: ['template-typeorm', 'template-prisma', 'template-nestia'],
      },
      {
        name: 'projectName',
        type: 'input',
        message: '请输入项目名称：',
        default: 'my-nest-app',
      },
    ]);

    // Fix the template path to point to root apps directory
    const templateDir = path.resolve(__dirname, '../../../apps', templateName);
    const targetDir = path.resolve(
      import.meta.url ? (await import('node:process')).cwd() : '.',
      projectName,
    );

    // Verify template directory exists
    if (!fs.existsSync(templateDir)) {
      throw new Error(`❌ 模板目录不存在: ${templateDir}\n请确保模板已正确安装`);
    }

    if (fs.existsSync(targetDir)) {
      throw new Error(`❌ 目录 ${projectName} 已存在，请更换名称或清理目录`);
    }

    await fs.copy(templateDir, targetDir);
    await fs.remove(path.join(targetDir, 'pnpm-lock.yaml'));

    console.log(`\n✅ 项目创建成功：${projectName}`);
    console.log(`📁 路径：${targetDir}`);
    console.log(`\n👉 下一步：`);
    console.log(`   cd ${projectName}`);
    console.log(`   pnpm install`);
    console.log(`   pnpm start\n`);
  } catch (error) {
    console.error('发生错误:', error.message);
    process.exit(1);
  }
};

// Wrap the main call in try-catch
try {
  await main();
} catch (error) {
  console.error('发生未捕获错误:', error);
  process.exit(1);
}
