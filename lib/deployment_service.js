module.exports = (function DeploymentServiceModule() {

    function DeploymentService(stackId, appId, instanceIds) {
        this.stackId = stackId;
        this.appId = appId;
        this.instanceIds = instanceIds;
        this.isWaiting = false;
        this.clearWaitingTimeout = null;
    }

    DeploymentService.prototype.deploy = function(opsWorks, cb) {
      var self = this;
      var deployParams = {
            Command: {
                Name: 'deploy'
            },
            StackId: self.stackId,
            AppId: self.appId,
            InstanceIds: this.instanceIds
        };
        opsWorks.createDeployment(deployParams, function(err, data){
            if(err){
                throw err;
            }
            else{
            	cb(data.DeploymentId);
                console.log("Deployment Id: " + data.DeploymentId);
                self.wait(data.DeploymentId, opsWorks);
                self.clearWaitingTimeout = setTimeout(function () { self.isWaiting = false; }, 1000 * 60 * 10);
            }
        });
    };

    DeploymentService.prototype.wait = function(deploymentId, opsWorks) {
        var self = this;
        this.isWaiting = true;
        opsWorks.describeDeployments({DeploymentIds: [deploymentId]}, function(err, data) {
            if(err || data.Deployments[0].Status.toLowerCase() === 'running') {
            	err && console.log(err);
            	
                setTimeout(function(){
                    self.wait(deploymentId, opsWorks);
                }, 30000);
                
                return ;
            }
            
            this.isWaiting = false;
            clearTimeout(self.clearWaitingTimeout);
            console.log('Deployment Finished.  Status: ' + data.Deployments[0].Status);
        });
    };

    return DeploymentService;
})();
