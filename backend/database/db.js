import mongoose from "mongoose";
console.log(process.env.MONGO_URI)
const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        }).then(() =>
            console.log('MongoDB Connected...')
            ).catch(err =>
                console.log(err)
            );
}

export default connectDB;