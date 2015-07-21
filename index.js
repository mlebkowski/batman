var AWS = require('aws-sdk');
var app = require('express')();
var bodyParser = require('body-parser')

app.use(bodyParser.json()); 
app.set('port', (process.env.PORT || 5000))

AWS.config.update({
	region: "us-east-1",
	accessKeyId: process.env.ACCESS_KEY,
	secretAccessKey: process.env.ACCESS_SECRET
});

var opsWorks = new AWS.OpsWorks();
var DeploymentService = require('./lib/deployment_service');

var stackId = process.env.STACK_ID;
var appId = process.env.APP_ID;
var instanceIds = (process.env.INSTANCE_IDS+"").split(",");

var deploymentService = new DeploymentService(stackId, appId, instanceIds);

var url = 'https://console.aws.amazon.com/opsworks/home?region=eu-west-1#/stack/'+ stackId +'/deployments/';


// listen on messages:
app.post('/', function(request, response) {
	if (request.token != process.env.SLACK_TOKEN) {
		return ;
	}

	if (deploymentService.isWaiting) {
		response.json({"text": "One at a time, still waiting for the last one to finish!"});
		return ;
	}
	
	deploymentService.deploy(opsWorks, function deployResponse(deploymentId) {
		response.json({"text": "Deployment started: " + url + deploymentId});
	});
});
  
app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})
    
