import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { Product, ProductRepository } from "/opt/nodejs/productsLayer";
import { DynamoDB } from "aws-sdk"

const productsDdb = process.env.PRODUCTS_DDB!
const ddbClient = new DynamoDB.DocumentClient()

const productRepository = new ProductRepository(ddbClient, productsDdb)

export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    
    const lambdaRequestId = context.awsRequestId
    const apiRequestId = event.requestContext.requestId

    console.log(`API Request ID: ${apiRequestId} - Lambda Request ID: ${lambdaRequestId}`)

    const method = event.httpMethod
    if (event.resource === "/products"){

        const productRequest = JSON.parse(event.body!) as Product
        const productCreated = await productRepository.create(productRequest)
        
        return {
            statusCode: 201,
            body: JSON.stringify(productCreated)
        }
    }
    else if (event.resource === "/products/{id}"){
        const productId = event.pathParameters!.id as string
        var logText = `/products/${productId}`

        if (method == "PUT") {
            console.log(`PUT ${logText}`)

            try{
                const productRequest = JSON.parse(event.body!) as Product
                const productCUpdated = await productRepository.updateProduct(productId, productRequest)

                return {
                    statusCode: 200,
                    body: JSON.stringify(productCUpdated)
                }
            }
            catch (ConditionalCheckFailedExpression){
                return{
                    statusCode: 404,
                    body: 'Product not found'
                }
            }
        }
        else if (method == "DELETE") {
            console.log(`DELETE ${logText}`)

            try{
                const productDeleted = await productRepository.deleteProduct(productId)                      
                return {
                    statusCode: 200,
                    body: JSON.stringify(productDeleted)
                }
            }
            catch (error){
                return{
                    statusCode: 404,
                    body: (<Error> error).message
                }
            }
        }
    }

    return {
        statusCode: 400,
        body: "Bad Request"
    }
}