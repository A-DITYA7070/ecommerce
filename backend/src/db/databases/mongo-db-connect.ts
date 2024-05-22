import mongoose from "mongoose";

/**
 * Function to connect to mongo-db database.
 * @returns nill
 */
export const connectToMongoDB = () => {
    
    const dbUri = process.env.DB_URI;

    if (!dbUri) {
        console.error("DB_URI environment variable is not defined.");
        return;
    }

    mongoose.connect(dbUri, {
        dbName: "Ecommerce24",
    }).then((c) => {
        console.log(`DB -- MONGODB--  connected to ${c.connection.host}`);
    }).catch((err) => {
        console.log(`Error connecting to DB: ${err}`);
    });
};
