import type { Question } from '../types/quiz'

export const questionBank: Question[] = [
  {
    id: 1,
    type: 'single',
    category: 'frontend',
    stem: 'Vue 3 中，组合式 API 的入口函数是？',
    options: ['created', 'setup', 'mounted', 'init'],
    correctAnswer: 'setup',
    score: 10,
    analysis: 'Vue 3 的组合式 API 通过 setup 函数作为入口，在组件创建之前执行。'
  },
  {
    id: 2,
    type: 'single',
    category: 'frontend',
    stem: '以下哪个不是 Vue 3 的响应式 API？',
    options: ['ref', 'reactive', 'watch', 'useState'],
    correctAnswer: 'useState',
    score: 10,
    analysis: 'useState 是 React 的 Hook，Vue 3 使用 ref、reactive、watch 等 API。'
  },
  {
    id: 3,
    type: 'single',
    category: 'frontend',
    stem: 'CSS 中 flex: 1 相当于以下哪个组合？',
    options: [
      'flex-grow: 1; flex-shrink: 1; flex-basis: auto',
      'flex-grow: 1; flex-shrink: 1; flex-basis: 0%',
      'flex-grow: 1; flex-shrink: 0; flex-basis: 100%',
      'flex-grow: 0; flex-shrink: 1; flex-basis: auto'
    ],
    correctAnswer: 'flex-grow: 1; flex-shrink: 1; flex-basis: 0%',
    score: 10,
    analysis: 'flex: 1 是 flex-grow: 1; flex-shrink: 1; flex-basis: 0% 的简写。'
  },
  {
    id: 4,
    type: 'single',
    category: 'frontend',
    stem: 'TypeScript 中，以下哪个是正确的类型断言写法？',
    options: ['value as string', '<string>value', 'string(value)', 'A 和 B 都可以'],
    correctAnswer: 'A 和 B 都可以',
    score: 10,
    analysis: 'TypeScript 支持两种类型断言写法：as 语法和尖括号语法（JSX 中只能用 as）。'
  },
  {
    id: 5,
    type: 'single',
    category: 'frontend',
    stem: 'Vite 的开发服务器使用的原生模块系统是？',
    options: ['CommonJS', 'ES Modules', 'AMD', 'UMD'],
    correctAnswer: 'ES Modules',
    score: 10,
    analysis: 'Vite 利用浏览器原生支持的 ES Modules 实现极速的开发体验。'
  },
  {
    id: 6,
    type: 'single',
    category: 'frontend',
    stem: 'JavaScript 中，以下哪个方法会改变原数组？',
    options: ['map', 'filter', 'splice', 'concat'],
    correctAnswer: 'splice',
    score: 10,
    analysis: 'splice 会直接修改原数组，而 map、filter、concat 都返回新数组。'
  },
  {
    id: 7,
    type: 'single',
    category: 'frontend',
    stem: 'CSS 选择器优先级从高到低排列正确的是？',
    options: [
      '!important > 行内样式 > ID > 类 > 标签',
      '行内样式 > !important > ID > 类 > 标签',
      'ID > !important > 行内样式 > 类 > 标签',
      '!important > ID > 行内样式 > 类 > 标签'
    ],
    correctAnswer: '!important > 行内样式 > ID > 类 > 标签',
    score: 10,
    analysis: 'CSS 优先级：!important 最高，然后是行内样式、ID 选择器、类选择器、标签选择器。'
  },
  {
    id: 8,
    type: 'multiple',
    category: 'frontend',
    stem: '以下哪些是 Vue 3 的生命周期钩子？（多选）',
    options: ['onMounted', 'onUnmounted', 'componentDidMount', 'onUpdated'],
    correctAnswer: ['onMounted', 'onUnmounted', 'onUpdated'],
    score: 15,
    analysis: 'onMounted、onUnmounted、onUpdated 是 Vue 3 组合式 API 的生命周期钩子，componentDidMount 是 React 的。'
  },
  {
    id: 9,
    type: 'multiple',
    category: 'frontend',
    stem: '以下哪些是 ES6+ 的新特性？（多选）',
    options: ['箭头函数', 'Promise', 'var 关键字', '解构赋值'],
    correctAnswer: ['箭头函数', 'Promise', '解构赋值'],
    score: 15,
    analysis: '箭头函数、Promise、解构赋值都是 ES6+ 特性，var 在 ES6 之前就存在。'
  },
  {
    id: 10,
    type: 'judge',
    category: 'frontend',
    stem: 'Vue 3 中，ref 创建的响应式数据在模板中使用时需要通过 .value 访问。',
    options: ['正确', '错误'],
    correctAnswer: '错误',
    score: 5,
    analysis: '在模板中使用 ref 时，Vue 会自动解包，不需要 .value，但在 script 中需要。'
  },
  {
    id: 11,
    type: 'judge',
    category: 'frontend',
    stem: 'CSS Grid 布局可以同时控制行和列。',
    options: ['正确', '错误'],
    correctAnswer: '正确',
    score: 5,
    analysis: 'Grid 是二维布局系统，可以同时控制行和列的排列。'
  },
  {
    id: 12,
    type: 'single',
    category: 'backend',
    stem: 'HTTP 状态码 401 表示什么？',
    options: ['请求成功', '未授权', '服务器错误', '资源不存在'],
    correctAnswer: '未授权',
    score: 10,
    analysis: '401 Unauthorized 表示请求需要用户认证。'
  },
  {
    id: 13,
    type: 'single',
    category: 'backend',
    stem: '以下哪个不是 RESTful API 的常用方法？',
    options: ['GET', 'POST', 'PUSH', 'DELETE'],
    correctAnswer: 'PUSH',
    score: 10,
    analysis: 'RESTful 常用方法：GET、POST、PUT、PATCH、DELETE，没有 PUSH。'
  },
  {
    id: 14,
    type: 'single',
    category: 'backend',
    stem: 'JWT 由几部分组成？',
    options: ['1部分', '2部分', '3部分', '4部分'],
    correctAnswer: '3部分',
    score: 10,
    analysis: 'JWT 由 Header、Payload、Signature 三部分组成，用点分隔。'
  },
  {
    id: 15,
    type: 'single',
    category: 'backend',
    stem: '以下哪个不是 Node.js 的核心模块？',
    options: ['fs', 'path', 'requests', 'http'],
    correctAnswer: 'requests',
    score: 10,
    analysis: 'requests 是 Python 的库，Node.js 核心模块有 fs、path、http 等。'
  },
  {
    id: 16,
    type: 'multiple',
    category: 'backend',
    stem: '以下哪些是常见的身份认证方式？（多选）',
    options: ['Session/Cookie', 'JWT', 'OAuth', 'MD5'],
    correctAnswer: ['Session/Cookie', 'JWT', 'OAuth'],
    score: 15,
    analysis: 'Session/Cookie、JWT、OAuth 都是认证方式，MD5 是哈希算法。'
  },
  {
    id: 17,
    type: 'multiple',
    category: 'backend',
    stem: '以下哪些是 HTTP 幂等的方法？（多选）',
    options: ['GET', 'POST', 'PUT', 'DELETE'],
    correctAnswer: ['GET', 'PUT', 'DELETE'],
    score: 15,
    analysis: 'GET、PUT、DELETE 是幂等的，多次调用效果相同；POST 不是幂等的。'
  },
  {
    id: 18,
    type: 'judge',
    category: 'backend',
    stem: 'HTTPS 使用对称加密来加密传输的数据。',
    options: ['正确', '错误'],
    correctAnswer: '正确',
    score: 5,
    analysis: 'HTTPS 使用非对称加密交换密钥，然后使用对称加密加密实际数据传输。'
  },
  {
    id: 19,
    type: 'judge',
    category: 'backend',
    stem: 'GraphQL 必须使用 POST 请求。',
    options: ['正确', '错误'],
    correctAnswer: '错误',
    score: 5,
    analysis: 'GraphQL 可以通过 GET（查询）或 POST 请求发送，查询可以用 GET。'
  },
  {
    id: 20,
    type: 'single',
    category: 'database',
    stem: 'SQL 中，用于去重的关键字是？',
    options: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'SINGLE'],
    correctAnswer: 'DISTINCT',
    score: 10,
    analysis: 'DISTINCT 关键字用于在查询结果中去除重复的记录。'
  },
  {
    id: 21,
    type: 'single',
    category: 'database',
    stem: '以下哪个是 NoSQL 数据库？',
    options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'],
    correctAnswer: 'MongoDB',
    score: 10,
    analysis: 'MongoDB 是文档型 NoSQL 数据库，其他三个都是关系型数据库。'
  },
  {
    id: 22,
    type: 'single',
    category: 'database',
    stem: '数据库索引的主要作用是？',
    options: ['节省存储空间', '提高查询速度', '保证数据完整性', '实现数据加密'],
    correctAnswer: '提高查询速度',
    score: 10,
    analysis: '索引通过建立数据的快速查找结构，大幅提高数据检索的速度。'
  },
  {
    id: 23,
    type: 'multiple',
    category: 'database',
    stem: '以下哪些是数据库事务的 ACID 特性？（多选）',
    options: ['原子性', '一致性', '隔离性', '持久性'],
    correctAnswer: ['原子性', '一致性', '隔离性', '持久性'],
    score: 15,
    analysis: 'ACID 即原子性(Atomicity)、一致性(Consistency)、隔离性(Isolation)、持久性(Durability)。'
  },
  {
    id: 24,
    type: 'judge',
    category: 'database',
    stem: 'Redis 是一种内存数据库，所有数据都存储在内存中。',
    options: ['正确', '错误'],
    correctAnswer: '正确',
    score: 5,
    analysis: 'Redis 是内存数据库，数据主要存储在内存中，但也支持持久化到磁盘。'
  },
  {
    id: 25,
    type: 'single',
    category: 'network',
    stem: 'TCP 三次握手的目的是？',
    options: ['加密数据传输', '建立可靠连接', '压缩传输数据', '路由选择'],
    correctAnswer: '建立可靠连接',
    score: 10,
    analysis: 'TCP 三次握手是为了建立可靠的连接，确保双方都有发送和接收的能力。'
  },
  {
    id: 26,
    type: 'single',
    category: 'network',
    stem: 'DNS 的主要作用是？',
    options: ['数据加密', '域名解析', '负载均衡', '防火墙'],
    correctAnswer: '域名解析',
    score: 10,
    analysis: 'DNS（域名系统）的作用是将域名解析为对应的 IP 地址。'
  },
  {
    id: 27,
    type: 'multiple',
    category: 'network',
    stem: '以下哪些属于应用层协议？（多选）',
    options: ['HTTP', 'FTP', 'TCP', 'DNS'],
    correctAnswer: ['HTTP', 'FTP', 'DNS'],
    score: 15,
    analysis: 'HTTP、FTP、DNS 是应用层协议，TCP 是传输层协议。'
  },
  {
    id: 28,
    type: 'judge',
    category: 'network',
    stem: 'WebSocket 是全双工通信协议。',
    options: ['正确', '错误'],
    correctAnswer: '正确',
    score: 5,
    analysis: 'WebSocket 支持全双工通信，客户端和服务器可以同时发送数据。'
  },
  {
    id: 29,
    type: 'single',
    category: 'algorithm',
    stem: '快速排序的平均时间复杂度是？',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    correctAnswer: 'O(n log n)',
    score: 10,
    analysis: '快速排序的平均时间复杂度是 O(n log n)，最坏情况是 O(n²)。'
  },
  {
    id: 30,
    type: 'single',
    category: 'algorithm',
    stem: '以下哪种数据结构是先进先出（FIFO）？',
    options: ['栈', '队列', '二叉树', '哈希表'],
    correctAnswer: '队列',
    score: 10,
    analysis: '队列是先进先出（FIFO）的数据结构，栈是后进先出（LIFO）。'
  }
]

export default questionBank
