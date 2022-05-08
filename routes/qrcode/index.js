export default async (fastify, opts) => {
  fastify.get('/', async (request, reply) => {
    reply.code(200).send('Got boos');
  });
};
