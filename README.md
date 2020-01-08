# 
# Set-up
 * **Requirements**
   * [AWS Account and User](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/)
   * [Local configuration of AWS Credentials and Region for Development](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html)
   * [npm](https://www.npmjs.com/)
   * [Cloud Development Kit CLI](https://www.npmjs.com/package/aws-cdk)\
    `npm install -g aws-cdk`
 
 * **Installation**
    `npm run init && npm run deploy`

# API Usage
  Go to **AWS Console** => **AWS ApiGateway** => **Stages**
  and select `prod` stage to see your app deployment URI

  Send a GET request with query parameters:
  - page_tag: the page name
  - language: language identifier (en, it, etc.)

# Clean up
  `cdk destroy`