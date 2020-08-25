const express = require('express')
//const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');

const app=express()
const port = process.env.PORT || 3000;
const sn=require('servicenow-rest-api');
const ServiceNow=new sn('dev60105','admin','XkAb39OonqOB');
const ABOUT = "getdetails";

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/',(request,response) =>{
	res.status(200).send('Server is working')
})

app.post('/chatbot',(request,response) =>{
 const agent = new WebhookClient({ request, response });
 let callerid = request.body.queryResult.parameters.callerid;
function aboutHandler(agent){
ServiceNow.Authenticate();
const fields=[
    'number',
    'short_description',
    'priority'
];
const filters=[
    'caller_idLIKE'+callerid
];

ServiceNow.getTableData(fields,filters,'incident',function(res){
    return res
}).then((result)=>{
	result.data.map(wordObj => {
		agent.add(wordObj.number);
	});
			});
}
let intentMap = new Map();
  intentMap.set(ABOUT, aboutHandler);
  agent.handleRequest(intentMap);
});

app.listen(port, () => { console.log(`Server running on port number: ${port}`) })
