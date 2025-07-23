#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { ECommerceApiStack } from '../lib/ecommerceAPI-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: "",
  region: ""
}

const tags = {
  cost: "ECommerce",
  team: "SiecolaCode"
}

const productsAppStack = new ProductsAppStack(app, "ProductsAppStack", {
  tags: tags,
  env: env
})

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApiStack", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  tags: tags,
  env: env
})
eCommerceApiStack.addDependency(productsAppStack)