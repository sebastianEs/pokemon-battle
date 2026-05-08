import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import Pokemon from '../models/pokemon.model'
import { battle } from '../battle/battleEngine'
import { PokemonNotFound, InvalidTeamError } from '../errors'

const battleSchema = z.object({
  teamA: z.array(z.string()).min(1).max(6),
  teamB: z.array(z.string()).min(1).max(6),
  errors: z.array(z.string()).optional(),
})

export const battleRoutes = async ( app: FastifyInstance ): Promise<void> => {
    app.post( "/battle", async ( request, reply ) => {
        const result = battleSchema.safeParse(request.body)
        if (!result.success) {
            throw new InvalidTeamError(result.error.issues[0].message)
        }
    const { teamA: teamANames, teamB: teamBNames } = result.data

        if (teamANames.length !== teamBNames.length) {
            throw new InvalidTeamError("Both teams must have the same number of Pokemon")
        }

        const [ teamA, teamB ] = await Promise.all([
            Pokemon.find({ name: { $in: teamANames } }),
            Pokemon.find({ name: { $in: teamBNames } }),
        ])

        const battleResult = battle(teamA, teamB)
        return reply.send( battleResult );
    } );
};

export const fetchTeam = async (names: string[]) => {
    return Promise.all(names.map(async (name) => {
        const pokemon = await Pokemon.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
        })
        if (!pokemon) throw new PokemonNotFound(`Pokemon not found: ${name}`)
        return pokemon
    }))
}

