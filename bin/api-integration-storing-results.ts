#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { ApiIntegrationStoringResultsStack } from '../lib/api-integration-storing-results-stack';

const app = new cdk.App();
new ApiIntegrationStoringResultsStack(app, 'ApiIntegrationStoringResultsStack');
