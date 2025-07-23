import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as cdk from "aws-cdk-lib"
import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as cwlogs from "aws-cdk-lib/aws-logs"

import { Construct } from "constructs"

export interface ECommerceApiStackProps extends cdk.StackProps{
    productsFetchHandler: lambdaNodeJS.NodejsFunction
}

export class ECommerceApiStack extends cdk.Stack{
    constructor(scope: Construct, id: string, props: ECommerceApiStackProps){
            super(scope, id, props)

            const logGroup = new cwlogs.LogGroup(this, "ECommerceApiLogs")
            const api = new apigateway.RestApi(this, "ECommerceApi", {
                restApiName: "ECommerceApi",
                cloudWatchRole: true,
                deployOptions: {
                    accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
                    accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
                        httpMethod: true,
                        ip: true, // sensitive
                        protocol: true,
                        requestTime: true,
                        resourcePath: true,
                        responseLength: true,
                        status: true,
                        caller: true,
                        user: true // sensitive
                    })
                }
            })

            const productsFetchIntegration = new apigateway.LambdaIntegration(props.productsFetchHandler)

            // "/prodcuts"
            const productsResource = api.root.addResource("produtcs")
            productsResource.addMethod("GET", productsFetchIntegration)
        }    
}