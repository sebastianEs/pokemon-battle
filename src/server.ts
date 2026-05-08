import fastify from "fastify";
import mongoose from "mongoose";

const app = fastify( { logger: true } );

app.get( "/", async () => { return { message: "Pokemon Battle API", version: "1.0.0" }; } );

app.get( "/health", async () =>{ return { status: "OK" }; } );

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