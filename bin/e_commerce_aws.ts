#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { ECommerceApiStack } from '../lib/ecommerceAPI-stack';
import { ProductsAppLayerStack } from '../lib/productsAppLayers-stack';
import { EventsDdbStack } from '../lib/eventsDdb-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: "825765426391",
  region: "us-east-1"
}

const tags = {
  cost: "ECommerce",
  team: "SiecolaCode"
}

const productsAppLayerStack = new ProductsAppLayerStack(app, "ProductsAppLayers", {
  tags: tags,
  env: env
})

const eventsDbdStack = new EventsDdbStack(app, "EventsDdb", {
  tags: tags,
  env: env
})

const productsAppStack = new ProductsAppStack(app, "ProductsApp", {
  eventsDbd: eventsDbdStack.table,
  tags: tags,
  env: env
})
productsAppStack.addDependency(productsAppLayerStack)
productsAppStack.addDependency(eventsDbdStack)

const eCommerceApiStack = new ECommerceApiStack(app, "ECommerceApi", {
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
  tags: tags,
  env: env
})
eCommerceApiStack.addDependency(productsAppStack)