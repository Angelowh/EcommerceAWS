import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as cdk from "aws-cdk-lib"

import { Construct } from "constructs"
import { SourceMap } from "module"

export class ProductsAppStack extends cdk.Stack{
    readonly productsFetchHandler: lambdaNodeJS.NodejsFunction

    constructor(scope: Construct, id: string, props?: cdk.StackProps){
        super(scope, id, props)

        this.productsFetchHandler = new lambdaNodeJS.NodejsFunction(this, 
            "ProductsFetchFunction", {
                runtime: lambda.Runtime.NODEJS_20_X,
                memorySize: 512, // MB
                functionName: "ProductsFetchFunction",
                entry: "lambda/products/ProductsFetchFunction.ts",
                handler: "handler", // name method
                timeout: cdk.Duration.seconds(5),
                bundling:{
                    minify: true,
                    sourceMap: false
                },
            })
    }
}