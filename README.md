# 
# Set-up
 * **Requirements**
   * [AWS Account and User](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
   * [Local configuration of AWS Credentials and Region for Development](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html)
   * [npm](https://www.npmjs.com/)
   * [Cloud Development Kit CLI](https://www.npmjs.com/package/aws-cdk)\
    `npm install -g aws-cdk`

 * *Recommended Development Environment (optional)* \
   - [VS Code](https://code.visualstudio.com/) + [AWS Toolkit (VS code extension)](https://aws.amazon.com/visualstudiocode)
   - [AWS CLI](https://aws.amazon.com/cli/) + [Localstack](https://github.com/localstack/localstack) and [awslocal](https://github.com/localstack/awscli-local) for local spin-off *(great for debuging, pre-deploy testing)*
 
 * **Installation**
    ```
        git clone https://github.com/georstoy/aws-api-integration.git && \
        cd ./aws-api-integration && npm install 
    ```
 * **Build** `npm run build` 
  *compiles source files (.ts) in the same directory*
 * **Deployment**
  - 
  - `cdk bootstrap` *assigns S3 bucket where the app*
  *(all stack declarations - aws apigateway, lambda etc.) will be stored*
  - *(optional)* `cdk diff` *list changes to be made*
  - deploy with `cdk deploy`; *(optional)* `--force` flag *skips the interactive console*:\
    Upload the app resources & set them on a stage (URI)
    Go to **AWS Console** => **AWS ApiGateway** => **Stages**
    and select `prod` stage to see your app deployment URI

# API Usage
 Send a GET request to 

# How It's made
`mkdir api-integration`
`cd api-integration`
`cdk init app --language=typescript`
```
    npm install \
        @aws-cdk/aws-apigateway \
        @aws-cdk/aws-lambda     \
        @types/aws-lambda       \
        @aws-cdk/aws-logs       \
        @aws-cdk/aws-logs-destinations \
    --save
```
 * **Stack definition** in `/lib/api-integration-stack.ts`
   * [AWS ApiGateway](https://docs.aws.amazon.com/cdk/api/latest/python/aws_cdk.aws_apigateway.README.html)
   * 

# Debug
 * **Basic local testing using AWS Serverless Application Model (SAM) *(development)***
    - [install AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
    - compile (synthesize) the aws-cdk app to [AWS CloudFormation](https://aws.amazon.com/cloudformation/) file with `cdk synth --no-staging > template.yml`
    - find the Lambda function declaration you need (e.g. `wikiPageHandlerFF0F0999`)
    - call the Lambda localy with `sam local invoke wikiPageHandlerFF0F0999 --no-event`

# Testing
 * [Jest](https://jestjs.io/)