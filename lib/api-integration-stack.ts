import cdk = require("@aws-cdk/core");
import lambda = require("@aws-cdk/aws-lambda");
import apigateway = require("@aws-cdk/aws-apigateway");
import path = require("path");

export class ApiIntegrationStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const wikiPageLambda = new lambda.Function(this, "wikiPageHandler", {
      code: lambda.Code.asset(path.join(__dirname, "../src")),
      handler: "handler.wikiPageHandler",
      runtime: lambda.Runtime.NODEJS_8_10,
      memorySize: 1024
    });

    const wikiPageApi = new apigateway.LambdaRestApi(this, 'WikiPageAPI', {
      handler: wikiPageLambda,
    });
  }
}
