//ts-jest配置: https://kulshekhar.github.io/ts-jest/user/config/
//jest配置文档: https://jestjs.io/docs/zh-Hans/getting-started.html
//jest使用文档: https://jestjs.io/docs/zh-Hans/api#describename-fn
const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  preset: 'ts-jest', // 配置基础预设值（ 指向npm模块， 该模块的根目录下有jest-preset.json 或 jest-preset.js 文件）
  rootDir: './', // 必须是包含jest.config.js 或package.json文件的根目录（代表根目录，下面<rootDir>/就是使用以当前的根目录来搜索）
  roots: ['<rootDir>/'],
  transform: {
    ...tsjPreset.transform,
  },
  testRegex: '(/__tests__/.*\\.(test|spec))\\.[tj]sx?$', // 查找测试文件
  testEnvironment: 'jsdom',
  /**
   * 测试代码覆盖率
   * % stmts是语句覆盖率（statement coverage）：每个语句是否都执行了
   * % Branch分支覆盖率（branch coverage）：条件语句是否都执行了
   * % Funcs函数覆盖率（function coverage）：函数是否全都调用了
   * % Lines行覆盖率（line coverage）：未执行的代码行数
   */
  collectCoverage: true, // 是否搜集测试时的覆盖率信息
  collectCoverageFrom: [
    // 应收集覆盖率信息的一组文件
    'src/**',
  ],
  coveragePathIgnorePatterns: [
    // 排除哪些目录或文件跳过覆盖率信息
    'node_modules',
    '__test__',
    'src/index.ts',
    'src/outside.ts',
    'src/types',
  ],
  coverageThreshold: {
    // 最小覆盖率指标
    global: {
      // 默认全局覆盖率指标
      branches: 80,
      functions: 95,
      lines: 90,
      statements: 90,
    },
  },
  setupFiles: ['jest-canvas-mock'],
  setupFilesAfterEnv: ['./jest.globalsetup.js'],
  moduleFileExtensions: [
    // 查找扩展名
    'tsx',
    'ts',
    'js',
  ],
  moduleNameMapper: {
    // 模块映射，相当于webpack中的alias别名
  },
  modulePathIgnorePatterns: [
    // 防止意外忽略不同环境中可能具有不同根目录的所有文件
  ],
}
