const express = require('express')

const app=express()
const port = process.env.PORT || 3000;
const sn=require('servicenow-rest-api');
const ServiceNow=new sn('dev60105','admin','XkAb39OonqOB');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/',(request,response) =>{
	res.status(200).send('Server is working')
})

app.post('/chatbot',(req,res) =>{
 let callerid = req.body.queryResult.parameters.callerid;

ServiceNow.Authenticate();
const fields=[
    'number',
    'short_description',
    'priority'
];
const filters=[
    'caller_idLIKE'+callerid
];

ServiceNow.getTableData(fields,filters,'incident',function(result){
var msg=[];
for(var i in result){
msg.push(result[i].number)
}

 return res.json({
                fulfillmentMessages: [
      {
        "payload": {
          "richContent": [
            [
              {
                "type": "description",
                "title": "The tickets for caller are: "+msg.toString(),
                "text": [
                  "Please select the next action from the below options"
                ]
              },
              {
                "type": "chips",
                "options": [
                  {
                    "text": "Get details for a incident",
                    "link": ""
                  },
                  {
                    "link": "",
                    "text": "Create ticket"
                  },
                  {
                    "link": "",
                    "text": "Update ticket"
                  },
                  {
                    "text": "Delete ticket",
                    "link": ""
                  }
                ]
              }
            ]
          ]
        }
      }
    ],
                source: 'chatbot'
            })
});
});

app.listen(port, () => { console.log(`Server running on port number: ${port}`) })
