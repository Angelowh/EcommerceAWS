import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    
    const lambdaRequestId = context.awsRequestId
    const apiRequestId = event.requestContext.requestId

    console.log(`API Request ID: ${apiRequestId} - Lambda Request ID: ${lambdaRequestId}`)

    const method = event.httpMethod
    if (event.resource === "/products"){
        return {
            statusCode: 201,
            body: "POST /products"
        }
    }
    else if (event.resource === "/products/{id}"){
        const productId = event.pathParameters!.id as string
        var logText = `/products/${productId}`

        if (method == "PUT") {
            console.log(`PUT ${logText}`)
            return {
                statusCode: 200,
                body: `PUT ${logText}`
            }
        }
        else if (method == "DELETE") {
            console.log(`DELETE ${logText}`)
            return {
                statusCode: 200,
                body: `DELETE ${logText}`
            }
        }
    }

    return {
        statusCode: 400,
        body: "Bad Request"
    }
}