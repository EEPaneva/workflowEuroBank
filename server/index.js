const express=require('express');
const https = require('https');
const fs = require('fs');
const app=express();
const cors=require('cors');
const mongoose=require('mongoose');
const verifyToken=require('./middlewares/jwt');
const routesConfig=require('./routes');
const corsOptions =require('./middlewares/cors');
const cron = require('node-cron');
const { replaceIapplyTable } = require('./importExternalFiles/csvImports');
const Role = require('./models/Role');
const { createRole } = require('./services/workflowServices');
const { createUser } = require('./services/adminServices');
const winstonExpress=require('express-winston');
const logger = require('./logger/logger');
const WinstonLog = require('./models/WinstonLog');

const CONNECTION_STRING='mongodb://localhost:27217,localhost:27218,localhost:27219/eurobankApp2?replicaSet=myReplicaSet1'

const credentials = {
  key: fs.readFileSync('/home/nikolay/localhost.key'),
  cert: fs.readFileSync('/home/nikolay/localhost.crt'),
  // Add CA certificate if available (optional)
  // ca: fs.readFileSync('/path/to/your/ca.pem')
};

start();

async function start(){

    try {
        await  mongoose.connect(CONNECTION_STRING,{
            useUnifiedTopology:true,
            useNewUrlParser:true
        });
        console.log('Database connected')
    } catch (error) {
        console.error(error.message);
        process.exit(1)
    }
    cron.schedule('02 12 * * *', async () => {
        console.log('Running replaceIapplyTable() function...');
        try {
          await replaceIapplyTable();
          console.log('IApply table replaced successfully!');
        } catch (error) {
          console.log(error.message);
        }
      }, {
        scheduled: true,
        timezone: 'Europe/Sofia' // Replace with your timezone
      });
      
   /*   app.use((req, res, next) => {
        debug('Incoming request with CORS headers:', req.headers);
        next();
    });*/
    app.use(express.json());
    app.use((req, res, next) => {
      const forwardedFor = req.headers['x-forwarded-for'];
      const realIp = req.headers['x-real-ip'];
    
      // Try to get the real client IP address
      const clientIp = forwardedFor || realIp || req.socket.remoteAddress;
      const sensitiveFields = ['password'];

      // Create a shallow copy of the request body
      const filteredBody = { ...req.body };
    
      // Remove sensitive fields from the copy
      sensitiveFields.forEach(field => {
        if (filteredBody[field]) {
          delete filteredBody[field];
        }
      });
      


    app.use(winstonExpress.logger({
      winstonInstance:logger,
      statusLevels:true
    }))


    logger.info({
      message: 'Incoming Request',
      method: req.method,
      url: req.url,
      ip: clientIp,
      headers: req.headers,
      query: req.query,
      body: filteredBody
    });
  
    next(); // Pass control to the next middleware
  });

    app.use(cors(corsOptions));
    app.use(verifyToken());
    
    routesConfig(app);
    
    const server = https.createServer(credentials, app);

    const PORT = 3030;

    server.listen(PORT, () => console.log(`Server listens on port ${PORT}!`));

    if (!(await Role.findOne({}))) {
      let adminRole = await createRole({ roleType: 'HO', roleName: 'Admin' });
      let adminUser = await createUser({ email: 'rkostyaneva@postbank.bg', branchNumber: 101, branchName: 'Admin', userStatus: 'Active', role: adminRole.id });
      let workflowRole = await createRole({ roleType: 'HO', roleName: 'Workflow' });
      let workflowUser = await createUser({ email: 'ihristozova@postbank.bg', branchNumber: 101, branchName: 'Workflow', userStatus: 'Active', role: workflowRole.id });
    } else {
        let a=await WinstonLog.find({});
        console.log()
    }

    /*app.listen(3030,()=>console.log('Server listens on port 3030!'));
    if(!await Role.findOne({})){
      let adminRole=await createRole({roleType:'HO',roleName:'Admin'});
      let adminUser=await createUser({email:'rkostyaneva@postbank.bg',branchNumber:101,branchName:'Admin',userStatus:'Active',role:adminRole.id});
      let workflowRole=await createRole({roleType:'HO',roleName:'Workflow'});
      let workflowUserss=await createUser({email:'ihristozova@postbank.bg',branchNumber:101,branchName:'Workflow',userStatus:'Active',role:workflowRole.id});
    }else{
      
    }*/
    //script();

}


