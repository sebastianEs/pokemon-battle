import { IPokemon } from "../models/pokemon.model";

const BASE_DAMAGE = 100;
const LEGENDARY_TRESHOLD = 0;
const LEGENDARY_BONUS = 2.0;

const deriveStats = ( pokemon: IPokemon ) => {
    const avgMultiplier = pokemon.multipliers.length > 0 ? pokemon.multipliers.reduce( ( a, b ) => a + b, 0 ) / pokemon.multipliers.length : 1.0;
    const rarityBonus = pokemon.spawnChance < LEGENDARY_TRESHOLD ? LEGENDARY_BONUS : Math.max(1.0, 1 / Math.sqrt(pokemon.spawnChance));

    return {
        attack: Math.round( BASE_DAMAGE * avgMultiplier * rarityBonus ),
        hp: Math.round( BASE_DAMAGE * ( pokemon.weight / 100 ) * rarityBonus ),
    };
};

const getTypeMultiplier = ( attacker: IPokemon, defender: IPokemon ): number => {
    const hasWeakness = attacker.types.some((type) =>
    defender.weaknesses.includes(type)
  )
  return hasWeakness ? 2.0 : 1.0
};

const calcDamage = ( attacker: IPokemon, defender: IPokemon ): number => {
    const stats = deriveStats(attacker)
    const typeMultiplier = getTypeMultiplier(attacker, defender)
    const weightRatio = Math.pow(attacker.weight / defender.weight, 0.3)

    return Math.round(stats.attack * typeMultiplier * weightRatio * BASE_DAMAGE / 50);
}

export interface RoundLog {
  round: number
  attackerName: string
  defenderName: string
  attackerTypes: string[]
  defenderTypes: string[]
  typeMultiplier: number
  damageDealt: number
  defenderRemainingHp: number
  roundWinner: string
}

export interface BattleResult {
    winner: 'teamA' | 'teamB' | 'draw'
    teamAScore: number
    teamBScore: number
    log: RoundLog[]
}

export const battle = ( teamA: IPokemon[], teamB: IPokemon[] ): BattleResult => {
    const log: RoundLog[] = []
  let teamAScore = 0
  let teamBScore = 0

  const rounds = Math.min(teamA.length, teamB.length)

  for (let i = 0; i < rounds; i++) {
    const pokemonA = teamA[i]
    const pokemonB = teamB[i]

    const hpA = deriveStats(pokemonA).hp
    const hpB = deriveStats(pokemonB).hp

    let currentHpA = hpA
    let currentHpB = hpB
    let turn = 0

    const aGoesFirst = pokemonA.weight <= pokemonB.weight

    while (currentHpA > 0 && currentHpB > 0) {
      turn++
      if (turn > 100) break
      if (aGoesFirst) {
        currentHpB -= calcDamage(pokemonA, pokemonB)
        if (currentHpB <= 0) break
        currentHpA -= calcDamage(pokemonB, pokemonA)
      } else {
        currentHpA -= calcDamage(pokemonB, pokemonA)
        if (currentHpA <= 0) break
        currentHpB -= calcDamage(pokemonA, pokemonB)
      }
    }

    const roundWinner = currentHpA > currentHpB ? pokemonA : pokemonB
    currentHpA > currentHpB ? teamAScore++ : teamBScore++

    log.push({
      round: i + 1,
      attackerName: pokemonA.name,
      defenderName: pokemonB.name,
      attackerTypes: pokemonA.types,
      defenderTypes: pokemonB.types,
      typeMultiplier: getTypeMultiplier(pokemonA, pokemonB),
      damageDealt: calcDamage(pokemonA, pokemonB),
      defenderRemainingHp: Math.max(0, currentHpB),
      roundWinner: roundWinner.name,
    })
  }

  const winner =
    teamAScore > teamBScore ? 'teamA' :
    teamBScore > teamAScore ? 'teamB' : 'draw'

  return { winner, teamAScore, teamBScore, log }
}   

    