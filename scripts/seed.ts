import mongoose from "mongoose";
import Pokemon from '../src/models/pokemon.model'
import data from '../data/dataset.json';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/pokemon'

const parseValue = (str: string): number => {
  return parseFloat(str.split(' ')[0])
}

const seed = async (): Promise<void> => {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB')

  const docs = data.pokemon.map((p) => ({
    updateOne: {
      filter: { id: p.id },
      update: {
        $set: {
          id:          p.id,
          num:         p.num,
          name:        p.name,
          types:       p.type,
          weaknesses:  p.weaknesses ?? [],
          weight:      parseValue(p.weight),
          height:      parseValue(p.height),
          multipliers: p.multipliers ?? [],
          spawnChance: p.spawn_chance,
        }
      },
      upsert: true,
    }
  }))

  const result = await Pokemon.bulkWrite(docs)
  console.log(`Seeded: ${result.upsertedCount} inserted, ${result.modifiedCount} updated`)

  await mongoose.disconnect()
}

seed().catch(err => {
    console.error('Error seeding data:', err)
    process.exit(1)
});
