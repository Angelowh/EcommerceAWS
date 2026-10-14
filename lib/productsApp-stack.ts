import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as cdk from "aws-cdk-lib"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as ssm from "aws-cdk-lib/aws-ssm"

import { Construct } from "constructs"

interface ProductsAppStackProps extends cdk.StackProps {
    eventsDbd: dynamodb.Table
}

export class ProductsAppStack extends cdk.Stack{
    readonly productsFetchHandler: lambdaNodeJS.NodejsFunction
    readonly productsAdminHandler: lambdaNodeJS.NodejsFunction
    readonly productsDdb : dynamodb.Table

    constructor(scope: Construct, id: string, props: ProductsAppStackProps){
        super(scope, id, props)

        this.productsDdb = new dynamodb.Table(this, "ProductsDdb", {
            tableName: "products",
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            partitionKey: {
                name: "id",
                type: dynamodb.AttributeType.STRING
            },
            billingMode: dynamodb.BillingMode.PROVISIONED,
            readCapacity: 1,
            writeCapacity: 1
        })

        const productsLayerArn = ssm.StringParameter.valueForStringParameter(this, "ProductsLayerVersionArn")
        const productsLayer = lambda.LayerVersion.fromLayerVersionArn(this, "ProductsLayerVersionArn", productsLayerArn)

        const productsEventsHandler = new lambdaNodeJS.NodejsFunction(this,
            "ProductsEventsFunction", {
                runtime: lambda.Runtime.NODEJS_20_X,
                memorySize: 128, // MB
                functionName: "ProductsEventsFunction",
                entry: "lambda/products/productEventsFunction.ts",
                handler: "handler", // name method
                timeout: cdk.Duration.seconds(2),
                bundling:{
                    minify: true,
                    sourceMap: false,
                    nodeModules: ['aws-xray-sdk-core']
                },
                environment:{
                    EVENTS_DDB: props.eventsDbd.tableName,
                },
                tracing: lambda.Tracing.ACTIVE,
                insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_119_0
            })
            props.eventsDbd.grantWriteData(productsEventsHandler)
            productsEventsHandler.grantInvoke(this.productsAdminHandler)

        this.productsFetchHandler = new lambdaNodeJS.NodejsFunction(this, 
            "ProductsFetchFunction", {
                runtime: lambda.Runtime.NODEJS_20_X,
                memorySize: 512, // MB
                functionName: "ProductsFetchFunction",
                entry: "lambda/products/productsFetchFunction.ts",
                handler: "handler", // name method
                timeout: cdk.Duration.seconds(5),
                bundling:{
                    minify: true,
                    sourceMap: false,
                    nodeModules: ['aws-xray-sdk-core']
                },
                environment:{
                    PRODUCTS_DDB: this.productsDdb.tableName
                },
                layers: [productsLayer],
                tracing: lambda.Tracing.ACTIVE,
                insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_119_0
            })        
        this.productsDdb.grantReadData(this.productsFetchHandler)

        this.productsAdminHandler = new lambdaNodeJS.NodejsFunction(this, 
            "ProductsAdminFunction", {
                runtime: lambda.Runtime.NODEJS_20_X,
                memorySize: 512, // MB
                functionName: "ProductsAdminFunction",
                entry: "lambda/products/productsAdminFunction.ts",
                handler: "handler", // name method
                timeout: cdk.Duration.seconds(5),
                bundling:{
                    minify: true,
                    sourceMap: false,
                    nodeModules: ['aws-xray-sdk-core']
                },
                environment:{
                    PRODUCTS_DDB: this.productsDdb.tableName,
                    PRODUCTS_EVENTS_FUNCTION_NAME: productsEventsHandler.functionName
                },
                layers: [productsLayer],
                tracing: lambda.Tracing.ACTIVE,
                insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_119_0
            })
        this.productsDdb.grantWriteData(this.productsAdminHandler)
    }
}