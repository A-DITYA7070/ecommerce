import mongoose from "mongoose";

export const connectDB = () => {
    const dbUri = process.env.DB_URI;

    if (!dbUri) {
        console.error("DB_URI environment variable is not defined.");
        return;
    }

    mongoose.connect(dbUri, {
        dbName: "Ecommerce24",
    }).then((c) => {
        console.log(`DB connected to ${c.connection.host}`);
    }).catch((err) => {
        console.log(`Error connecting to DB: ${err}`);
    });
};
