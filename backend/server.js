const app = require("./app");
const cloudinary = require("cloudinary");

const connectDatabase = require("./config/database")

// hendeling uncatch exception
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to uncatch exception`);
    
    server.close(()=>{
        process.exit(1);
    });
});


if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({path:"backend/config/config.env"});
}
// connect t the databse
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is working on local host http://localhost:${process.env.PORT}`);
});

// unhandeled promise rejection
process.on('unhandledRejection', err =>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandeled promise rejection`);
    
    server.close(()=>{
        process.exit(1);
    });
});
