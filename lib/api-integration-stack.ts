import cdk = require("@aws-cdk/core");
import Lambda = require("@aws-cdk/aws-lambda");
import ApiGateway = require("@aws-cdk/aws-apigateway");
import path = require("path");

export class ApiIntegrationStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Handlers
    const get_wiki_handler = new Lambda.Function(this, "wikiPageHandler", {
      code: Lambda.Code.asset(path.join(__dirname, "../src")),
      handler: "handler.wikiPageHandler",
      runtime: Lambda.Runtime.NODEJS_12_X,
      memorySize: 1024
    });
    const get_wiki_integration = new ApiGateway.LambdaIntegration(
      get_wiki_handler
    );

    const default_handler = new Lambda.Function(this, "defaultHandler", {
      code: Lambda.Code.asset(path.join(__dirname, "../src")),
      handler: "handler.defaultHandler",
      runtime: Lambda.Runtime.NODEJS_8_10,
      memorySize: 1024
    });

    // API Gateway set-up
    const wiki_page_api = new ApiGateway.LambdaRestApi(this, "wikiPageApi", {
      handler: default_handler,
      proxy: false
    });

    // Routing
    wiki_page_api.root.addMethod("GET", get_wiki_integration);
  }
}
