#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { ApiIntegrationStack } from '../lib/api-integration-stack';

const app = new cdk.App();
new ApiIntegrationStack(app, 'ApiIntegrationStack');
