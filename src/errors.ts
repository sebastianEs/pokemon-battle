export class PokemonNotFound extends Error {
    statusCode = 404;

    constructor(message: string) {
        super(message);
        this.name = "PokemonNotFound";
    }
}

export class InvalidTeamError extends Error {
    statusCode = 400;

    constructor(message: string) {
        super(message);
        this.name = "InvalidTeamError";
    }
}