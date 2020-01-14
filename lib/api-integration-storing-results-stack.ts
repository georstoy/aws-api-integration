require("dotenv").config();
import cdk = require("@aws-cdk/core");
import Docdb = require("@aws-cdk/aws-docdb");
import Ec2 = require("@aws-cdk/aws-ec2");
import Lambda = require("@aws-cdk/aws-lambda");
import ApiGateway = require("@aws-cdk/aws-apigateway");
import path = require("path");
import { IVpc } from "@aws-cdk/aws-ec2";

export class ApiIntegrationStoringResultsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpcCidr = "10.0.0.0/21";
    const port = 27017;

    /**
     * Network
     */
    const vpc: IVpc = new Ec2.Vpc(this, "wiki-vpc", {
      cidr: vpcCidr,
      subnetConfiguration: [
        {
          subnetType: Ec2.SubnetType.PRIVATE,
          cidrMask: 24,
          name: "WikiPrivateSubnet1"
        },
        {
          subnetType: Ec2.SubnetType.PRIVATE,
          cidrMask: 24,
          name: "WikiPrivateSubnet2"
        },
        {
          subnetType: Ec2.SubnetType.PUBLIC,
          cidrMask: 28,
          name: "WikiPublicSubnet1"
        }
      ]
    });

    const sg = new Ec2.SecurityGroup(this, "wiki-sg", {
      vpc,
      securityGroupName: "wiki-sg"
    });

    const subnetGroup = new Docdb.CfnDBSubnetGroup(this, "wiki-subnet-group", {
      subnetIds: vpc.privateSubnets.map(x => x.subnetId),
      dbSubnetGroupName: "wiki-subnet-group",
      dbSubnetGroupDescription: "Subnet Group for DocDB Wiki results storage"
    });

    /**
     * Storage
     */
    const masterUsername = process.env.DB_MASTER_USER || "wikiroot";
    const masterUserPassword = process.env.DB_MASTER_USER_PASSWORD || "wikisupersecret";

    const dbCluster = new Docdb.CfnDBCluster(this, "wiki-db-cluster", {
      storageEncrypted: true,
      availabilityZones: vpc.availabilityZones.splice(3),
      dbClusterIdentifier: "wiki-docdb-cluster",
      masterUsername,
      masterUserPassword,
      vpcSecurityGroupIds: [sg.securityGroupName],
      dbSubnetGroupName: subnetGroup.dbSubnetGroupName,
      port
    });
    dbCluster.addDependsOn(subnetGroup);

    const dbInstance = new Docdb.CfnDBInstance(this, "db-instance", {
      dbClusterIdentifier: dbCluster.ref,
      autoMinorVersionUpgrade: true,
      dbInstanceClass: "db.r5.large",
      dbInstanceIdentifier: "staging"
    });
    dbInstance.addDependsOn(dbCluster);

    sg.addIngressRule(Ec2.Peer.ipv4(vpcCidr), Ec2.Port.tcp(port));

    const DB_URL = `mongodb://${dbCluster.masterUsername}:${dbCluster.masterUserPassword}@${dbCluster.attrEndpoint}:${dbCluster.attrPort}`;
    const DB_NAME = dbInstance.dbInstanceIdentifier as string;

    /**
     * REST
     */
    // Handlers
    const get_wiki_handler = new Lambda.Function(this, "wikiPageHandler", {
      code: new Lambda.AssetCode("src"),
      handler: "handler.wikiPageHandler",
      runtime: Lambda.Runtime.NODEJS_12_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
    //  vpc,
    //  securityGroup: sg,
    //  functionName: "wikiPageHandler",
      environment: {
        DB_URL,
        DB_NAME
      }
    });
    const get_wiki_integration = new ApiGateway.LambdaIntegration(
      get_wiki_handler
    );

    const default_handler = new Lambda.Function(this, "defaultHandler", {
      code: new Lambda.AssetCode("src"),
      handler: "handler.defaultHandler",
      runtime: Lambda.Runtime.NODEJS_12_X,
      memorySize: 1024
    });

    // API Gateway set-up
    const wiki_page_api = new ApiGateway.LambdaRestApi(
      this,
      "wikiPageStoringResultsApi",
      {
        handler: default_handler,
        proxy: false
      }
    );

    // Routing
    wiki_page_api.root.addMethod("GET", get_wiki_integration);

    /**
     * Stack Formation Output
     */
    new cdk.CfnOutput(this, "wiki-db-url", {
      value: DB_URL
    });
  }
}
