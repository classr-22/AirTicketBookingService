const express = require('express');
const bodyparser = require('body-parser');

const {PORT} = require('./config/server-config');
const db = require('./models/index');
const apiRoutes = require('./routes/index');

const app = express();

const setupAndStartServer = () => {

    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({extended:true}));

    app.use('/api',apiRoutes);

    app.listen(PORT,()=>{
        console.log(`server is running at port : ${PORT}`);
    
        if(process.env.DB_SYNC){
            db.sequelize.sync({alter: true});
        }

        
    });
}

setupAndStartServer();