import crypto from 'crypto';
import fetch from 'node-fetch';
import { exec as _exec } from 'child_process';
import { promisify } from 'util';


import { getOptions, interpolateName } from 'loader-utils';
import validateOptions from 'schema-utils';

import { upload } from 'now-storage';

const exec = promisify(_exec);

const FILE_URL = 'https://api.zeit.co/v2/now/files';
const DEPLOY_URL = 'https://api.zeit.co/v2/now/deployments';

const schema = {
  type: "object",
  properties: {
    apiKey: {
      type: "string"
    },
    alias: {
      type: "string" // TODO: use the alias argument to alias the deployment
    },
    name: {},
    regExp: {},
    context: {
      "type": "string"
    }
  },
  required: [
    "apiKey" // TODO: fetch API Key from fs if not provided as an option
  ],
  "additionalProperties": false
}

export default function(content){
  const options = getOptions(this) || {};
  
  validateOptions(schema, options, 'now-loader');
  const callback = this.async();
  
  const context = options.context || this.rootContext || (this.options && this.options.context);
  let apiKey = options.apiKey;
  if(!apiKey) {
    // TODO: fetch API Key from fs if not provided as an option
  }
  const name = interpolateName(this, options.name, {
    context,
    content,
    regExp: options.regExp,
  });

  if(/(now.json|package.json|Dockerfile)/.test(this.resourcePath)) {
    // We're dealing with a full deployment
    const deploymentRoot = this.resourcePath.split('/').slice(0, -1).join('/') + '/';
    this.addContextDependency(deploymentRoot);

    console.log(`Deploying ${deploymentRoot}`);

    exec(`now "${deploymentRoot}"`)
      .then(({stdout, stderr}) => {
        console.log(stdout, stderr)
        if(stdout) {
          console.log(`Deployed to ${stdout}`);
          callback(null, `module.exports = "${stdout}"`)
        } else {
          throw Error(stderr)
        }
      })
      .catch(err => callback(err))
  } else {
    // We're only dealing with a single static file deployment
    upload(options.apiKey, {
      name,
      content
    })
      .then(({url}) => `module.exports = "https://${url}"`)
      .then((result => callback(null, result)))
      .catch(err => callback(err))
  }
}

export const raw = true;