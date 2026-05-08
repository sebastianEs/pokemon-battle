import mongoose, { Schema, Document } from "mongoose";

export interface IPokemon extends Document {
    id: number
    num: string
    name: string
    types: string[]
    weaknesses: string[]
    weight: number
    height: number
    multipliers: number[]
    spawnChance: number
}

const PokemonSchema: Schema = new Schema( {
    id:          { type: Number, required: true },
    num:         { type: String, required: true },
    name:        { type: String, required: true },
    types:       { type: [String], required: true },
    weaknesses:  { type: [String], required: true },
    weight:      { type: Number, required: true },
    height:      { type: Number, required: true },
    multipliers: { type: [Number], default: [] },
    spawnChance: { type: Number, required: true },
} );

PokemonSchema.index({ name: 1 }, { collation: { locale: 'en', strength: 2 } })

export default mongoose.model<IPokemon>( "Pokemon", PokemonSchema );