import Fastify from 'fastify';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import fastifyAutoload from '@fastify/autoload';

import Bot from './bot/index.js';
const fastify = Fastify({ logger: true });

// 获取文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 自动注册接口路由
fastify.register(fastifyAutoload, {
  dir: join(__dirname, 'routes'),
});

const start = async () => {
  try {
    await fastify.listen(3000);
    Bot.start();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
