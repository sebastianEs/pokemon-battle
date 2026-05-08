import fastify from "fastify";
import mongoose from "mongoose";
import { battleRoutes } from './routes/battle'
import { PokemonNotFound, InvalidTeamError } from './errors';

const app = fastify( { logger: true } );

app.setErrorHandler((error, _request, reply) => {
  if (
    error instanceof PokemonNotFound ||
    error instanceof InvalidTeamError
  ) {
    return reply.code(error.statusCode).send({
      error: error.name,
      message: error.message,
    })
  }
app.log.error(error)
  return reply.code(500).send({
    error: 'InternalServerError',
    message: 'Something went wrong',
  })
})

app.get( "/health", async () =>{ return { status: "OK" }; } );
app.register( battleRoutes, { prefix: "/api/v1" } );

const start = async () => {
    try {
        await mongoose.connect( process.env.MONGO_URI || "mongodb://localhost:27017/mydb" );
        app.log.info( "Connected to MongoDB" );
        await app.listen( { port: Number( process.env.PORT ) || 3000, host: "0.0.0.0" } );
    } catch ( err ) {
        app.log.error( err );
        process.exit( 1 );
    }
};

start();