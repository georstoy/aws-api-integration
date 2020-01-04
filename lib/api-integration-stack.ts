import cdk = require("@aws-cdk/core");
import lambda = require("@aws-cdk/aws-lambda");
import apigateway = require("@aws-cdk/aws-apigateway");
import path = require("path");
import { wikiPageHandler, defaultHandler } from "../src/handler";

export class ApiIntegrationStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // Handlers
    const get_wiki_handler = new lambda.Function(this, "wikiPageHandler", {
      code: lambda.Code.asset(path.join(__dirname, "../src")),
      handler: "handler.wikiPageHandler",
      runtime: lambda.Runtime.NODEJS_8_10,
      memorySize: 1024
    });
    const get_wiki_integration = new apigateway.LambdaIntegration(
      get_wiki_handler,
      {
        contentHandling: apigateway.ContentHandling.CONVERT_TO_TEXT
      }
    );

    const default_handler = new lambda.Function(this, "defaultHandler", {
      code: lambda.Code.asset(path.join(__dirname, "../src")),
      handler: "handler.defaultHandler",
      runtime: lambda.Runtime.NODEJS_8_10,
      memorySize: 1024
    });
    
    // Routing
    const wiki_page_api = new apigateway.LambdaRestApi(
      this,
      "wikiPageApi",
      {
        handler: default_handler,
        proxy: false
      }
    );

    wiki_page_api.root.addMethod("GET", get_wiki_integration);
  }
}
