import Fastify from "fastify";
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

import { poolRoutes } from "./routes/pool";
import { userRoutes } from "./routes/user";
import { guessRoutes } from "./routes/guess";
import { authRoutes } from "./routes/auth";
import { gamesRoutes } from "./routes/game";

async function bootstrap() {
  const fastify = Fastify({})

  await fastify.register(cors, {
    origin: true,
  })

  await fastify.register(jwt, {
    secret: `${process.env.JWT_SECRET}`,
  })

  await fastify.register(poolRoutes)
  await fastify.register(authRoutes)
  await fastify.register(gamesRoutes)
  await fastify.register(userRoutes)
  await fastify.register(guessRoutes)

  await fastify.listen({ port: 3333, host: "0.0.0.0" })
}

bootstrap()