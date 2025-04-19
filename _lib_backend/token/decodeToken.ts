import "dotenv/config"
import jwt from "jsonwebtoken";
export const decodeToken = async (reqHeaderAuthorization:string | undefined) => {
    try {
        
        if (!reqHeaderAuthorization || !reqHeaderAuthorization.startsWith("Bearer ")){
            throw new Error("Invalid Authorization");
        }

        const token = reqHeaderAuthorization.split(" ")[1];

        if (!token) {
            throw new Error("Token is missing");
        }

        const decodedToken = jwt.decode(token) as {id:string} | null;

        if (!decodedToken){
            throw new Error("Failed to decode the token");
        }

        return decodedToken.id;

    } catch(error){
        return {error: error instanceof Error ? error.message : "Unknown error while decoding token"}
    }
}