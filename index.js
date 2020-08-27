//code for performing actions based on different agents
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
 const intent = req.body.queryResult.intent.displayName;

if(intent=="getdetails"){
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

	if(result == ''){
		var msg= "Sorry, there are no available incidents for this caller"
	}

	else{
		var msg=[];
		for(var i in result){
		msg.push(result[i].number)
	}
	msg = "The tickets for this caller are: "+msg.toString()
	}
	 return res.json({
	                fulfillmentMessages: [
	      {
	        "payload": {
	          "richContent": [
	            [
	              {
	                "type": "description",
	                "title": msg,
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
}

else{
	return res.json({
            fulfillmentText: "Sorry, I cannot help with that.",
            source: 'chatbot'
        })
}

});

app.listen(port, () => { console.log(`Server running on port number: ${port}`) })
