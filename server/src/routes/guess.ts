import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../plugins/authenticate';

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count()

    return { count }
  })

  fastify.post('/pools/:poolId/games/:gameId/guesses', {
    onRequest: [authenticate]
  }, async (req, res) => {
    const createGuessesParams = z.object({
      poolId: z.string(),
      gameId: z.string(),
    })

    const createGuessBody = z.object({
      firstTeamPoints: z.number(),
      secondTeamPoints: z.number()
    })

    const { poolId, gameId } = createGuessesParams.parse(req.params)
    const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(req.body)

    const participant = await prisma.participant.findUnique({
      where: {
        userId_poolId: {
          poolId,
          userId: req.user.sub,
        }
      }
    })

    if (!participant) {
      return res.status(404).send({
        message: "You're not allowed to create a guess inside this pool.",
      })
    }

    const guess = await prisma.guess.findUnique({
      where: {
        parcipantId_gameId: {
          parcipantId: participant.id,
          gameId,
        }
      }
    })

    if (guess) {
      return res.status(404).send({
        message: "You already send a guess for this pool.",
      })
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      }
    })

    if(!game) {
      return res.status(404).send({
        message: "Game not found.",
        })
    }

    if (game.date < new Date()) {
      return res.status(404).send({
        message: "You cannot send guesses after the match",
        })
    }

    await prisma.guess.create({
      data: {
        gameId,
        parcipantId: participant.id,
        firstTeamPoints,
        secondTeamPoints,
      }
    })

    return res.status(201).send()
  })
}