const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGOURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`);

    }catch{
        console.error(`Error in connection: ${error.message}`);
        process.exit(1);
    }

}

module.exports= connectDB;