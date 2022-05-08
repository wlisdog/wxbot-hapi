
export default async (fastify, opts) => {
  fastify.get("/gg", async (request,reply) => {
    reply.code(200).send('Got boos gg')
  })
}