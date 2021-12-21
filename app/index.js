const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({path:'app/config.env'});

// routes
const authRoutes = require("./routes/authroutes");
const app = express();


app.use(express.json());
app.use(
    cors({
        credentials:true,
      
        optionsSuccessStatus:200,
    })
);

app.get("/", (req, res) => {
    res.status(200).json({
      type: "success",
      message: "server is up and running",
      data: null,
    });
  });

  app.use("/api/auth", authRoutes);



async function main() {
    try{
        await mongoose.connect(process.env.DB,{
            useNewurlParser:true,
           
           
        })
        console.log("database connected")

        app.listen(process.env.PORT,()=>console.log(`server started on port ${process.env.PORT}`));
    }catch(error) {
        console.log(error);
        process.exit(1);
    }
  

}
main();

