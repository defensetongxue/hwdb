import { env } from "node:process";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";

async function verifyJwt(req, rep) {
  try {
    await req.jwtVerify();
  } catch (err) {
    rep.code(400).send(err);
  }
}

export default fp(async function (fastify) {
  fastify.decorate("verifyJwt", verifyJwt);
  fastify.decorate("signJwt", (id, role) => {
    return fastify.jwt.sign({ id, role });
  });
  await fastify.register(fastifyJwt, {
    secret: env.JWT_SECRET ?? "",
  });
});
