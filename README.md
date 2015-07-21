Batman is a #slack to opsworks deployment bot
---------------------------------------------

## Requirements

 * `node with npm`
 * `npm install`
 * `node index.js`

## Env vars:

 * `APP_ID` -- opsworks app id, can be found in app details
 * `STACK_ID` -- opsworks stack id, see above
 * `INSTANCE_IDS` -- comma separated instance ids, see above. Why not all of them? Because screw you, Jesse.
 * `ACCESS_KEY` -- amazon aws access key
 * `ACCESS_SECRET` -- amazon aws access secret
 * `SLACK_TOKEN` -- only respond to requests containing this secret token
