import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@gmail.com',
      avatarUrl: 'http://github.com/jhowwn.png'
    }
  }) 

  const pool = await prisma.pool.create({
    data: {
      title: 'Example Pool',
      code: 'BOl123',
      ownerId: user.id,

      parcipants: {
        create: {
          userId: user.id,
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-02T12:00:00.201Z',
      firstTeamCountryCode: 'DE',
      secondTeamCountryCode: 'BR',
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-03T12:00:00.201Z',
      firstTeamCountryCode: 'AR',
      secondTeamCountryCode: 'BR',

      guesses: {
        create: {
          firstTeamPoints: 1,
          secondTeamPoints: 4,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })
}

main()