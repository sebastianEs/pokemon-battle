# Pokémon Battle API

Simulates battles between two Pokémon teams using type effectiveness, weight, and rarity.

## Getting Started

```bash
git clone https://github.com/sebastianEs/pokemon-battle
cd pokemon-battle
docker compose up --build
```

## Run a Battle

```bash
curl -X POST http://localhost:3000/api/v1/battle \
  -H "Content-Type: application/json" \
  -d '{"teamA": ["Pikachu", "Charizard", "Mewtwo"], "teamB": ["Bulbasaur", "Blastoise", "Dragonite"]}'
```

**Response**
```json
{
  "winner": "teamA",
  "teamAScore": 2,
  "teamBScore": 1,
  "log": [
    {
      "round": 1,
      "attackerName": "Pikachu",
      "defenderName": "Bulbasaur",
      "attackerTypes": ["Electric"],
      "defenderTypes": ["Grass", "Poison"],
      "typeMultiplier": 1,
      "damageDealt": 312,
      "defenderRemainingHp": 0,
      "roundWinner": "Bulbasaur"
    }
  ]
}
```

Pokémon names are case-insensitive. Teams must be equal size (1–6 Pokémon).

## Battle System

- **HP** = weight × 10
- **Turn order** = lighter Pokémon attacks first
- **Type bonus** = 2× damage if attacker's type matches defender's weakness
- **Legendary bonus** = 2× attack for Pokémon with spawn_chance of 0 (Mewtwo, Mew, legendary birds)

## Given More Time

- Unit tests for battle logic with Jest
- NestJS migration
- Rate limiting and input sanitization