# Billing System

## Scenario

Build a portion of a billing system for a fictional cloud service provider. You are on the billing team at this company and need to provide a system that allows other teams at the company to track usage for each customer.

To complete this project I used TypeScript, NodeJS, Mongoose, Axios, Mocha and Chai.

## Deliverables

I created a web service, a billing system, for a fictional service provider that allows other teams at the company to track usage for each customer. I also built a client library that implements the available endpoints on the web service.


The web service code is located under `web-service/` while the client library code is located under `client/`.


## Getting started
To install all dependencies run `npm i` at the root of the project


---------------------------------------------


## web service
`cd web-service`


`npm start` # start the app on localhost port 3001.


`npm run test-web-service`


to run tests make sure the server is not running on port 3001 to avoid:  `Uncaught Error: listen EADDRINUSE: address already in use :::3001 errors`






The web service exposes two REST API endpoints


The first endpoint: `POST http://127.0.0.1:3001/api/v1/customers` creates a stand-alone customer.
It takes the name of the customer and returns a customer record.


example request
```bash
curl --location --request POST 'http://127.0.0.1:3001/api/v1/customers' \
--header 'Content-Type: application/json' \
--data-raw '{
   "customer_name": "A test customer name"
}'
```


example response
```json
{
   "customer": {
       "id": "646e719d1dec027240414eb0",
       "name": "A test customer name"
   }
}
```  




The second endpoint: `POST http://127.0.0.1:3001/api/v1/customers/:customer_id/usage` creates a customer usage record for a given customer. It takes `service, units_consumed, and price_per_unit` in the body of the request and returns a usage record that pertains to the given customer id.


example request
```bash
curl --location --request POST 'http://127.0.0.1:3001/api/v1/customers/646e719d1dec027240414eb0/usage' \
--header 'Content-Type: application/json' \
--data-raw '{
   "service": "Database Hosting",
   "units_consumed": 58,
   "price_per_unit": 0.05
}'
```


example response
```json
{
   "usage": {
       "id": "646e747f1dec027240414eb2",
       "customer_id": "646e719d1dec027240414eb0",
       "service": "Database Hosting",
       "units_consumed": 58,
       "price_per_unit": 0.05
   }
}
```


###### TODO:
- add data validations to make sure the correct data types and expected fields are given. Return 422 errors when appropriate.
- verify that the customer by given customer id exists. Raise 404 if no customer exists.
- identify requests by `X-Request-Id` header to prevent over charging customers for the same request due to client retry logic.
- add middleware to handle known and unknown errors and return informative and descriptive error messages back to the client.
- add timestamps to data models. e.g. `created_at, updated_at`, to create invoices for a given start and end date, for example.
- model data using a relational database since the data is highly structured and relational.
- add tests for happy and unhappy paths. Add models tests.
- handle Mongoose errors.


-----------------------------------------------------


## client library
The client library exposes a `Client` class that can be instantiated to create customers and usage by customer. The client library also adds retry logic. 3 retries max, with a retry delay of 1000ms. This can be configured as needed. 


```bash
# to test the client library


cd web-service
npm start
```


in another terminal
```bash
# make sure web-service in running on localhost port 3001
cd client
npm run test-client
```


Below is a code snippet to create a customer and customer usage record using the client library directly.


```typescript
import ClientApi from '../client'; // example


const clientApi = new ClientApi();


const customer = await clientApi.createCustomer('a test customer');


const usageByCustomer = await clientApi.createUsage({
 customer_id: customer.id,
 service: 'Database Hosting',
 units_consumed: 58,
 price_per_unit: 0.05,
});
```
###### TODO:
- configure the client library to take configuration parameters such as timeout, url, and retry configurations, authorization header, logger etc.
- figure out what type of errors we want to retry. For example, timeouts, service unavailable etc.
- design client library as a singleton class to ensure that only one instance of the class exists at any given time. There's no need to have multiple instances of the `Client` class unless we want to have different instances configured differently in our "app".


--------------------------------


## trade-offs
- I decided to use a NoSQL database (Mongoose) since I didn't know the type of problem to solve ahead of time. In NoSQL it is easy to change and add new fields/types without worrying about running migrations and enforcing certain integrity constraints. Thus improving productivity in this kind of exercise.
- I decided to version the REST API using the following namespace. e.g. `/api/v1/`. For this problem I would change it to something like `/api/internal` and not worry too much about versioning. Internal APIs are controlled internally so changes to the API and rollouts are planned and known to internal stakeholders. Versioning in general is a good thing to have even for internal APIs.
- I decided to add retry logic to the client library on a per request basis just to get something working. This could be improved by defining a global and unified configuration so that all client requests behave the same.


## What you would change if you built this for production
- enable CORS domain whitelist/blacklist on web service
- use SQL to model data
- surface errors to something like Sentry
- surface request/response payloads and metadata to something like Logz.io for observability and analytics.
- package client library for distribution. We could use a private registry such as NPM.
- test happy and unhappy paths.
- make sure not to overcharge customers on retried requests.
- add authentication and authorization.
- whitelist allowed usage of `service` types.
- split and structure code more elegantly.


## What parts of the spec were completed, how much time you spent, and any particular problems you ran into


### Web Service


- [x] Your service should implement a single endpoint that accepts POST requests.
- [x] Your service should record usage for a customer's current bill.
- [x] Your service should handle edge cases appropriately and return appropriate HTTP status codes.
- [x] Your service should have at least one test


### client library


- [x] Your library should be a client for the internal web service, implementing (sending requests to) the available - endpoint. Here is the gist with examples of how another team at your company would potentially use your library.
- [] Your library should be designed so the interaction between it and the web service is idempotent. Specifically, if a - client retries the same request, the system shouldn't record duplicate usage (and thus overcharge customers).
- [x] Your library should handle other edge cases appropriately (i.e. raising an exception or retrying requests).
- [x] Your library should have at least one test.


Based on my understanding, to complete the unfinished requirement, I would need to add to the client a request header. e.g. `X-Request-Id`, save the request id on the backend and make sure when the client retries a failed request that it sends the original request id. On the backend I would bypass charging customers for requests with a cached `X-Request-Id`.


Alternatively, the request id could come from the payload that the internal team is submitting for billing. I imagine the internal team has access to customer's usage data and perhaps have a way to identify such usages by some unique id. In this case, I would add a new field `request_id` to the `Usage` model. When a request for usage creation is submitted I can verify that no usage records exists with that same `request_id`. If one exists, I will bypass usage creation all together thus preventing overcharging customers.


Finally, the unfinished requirement is ambiguous. I would need to talk to the internal team to get more clarification on what exactly makes up a usage charge and design/update my solution accordingly.


-----------------------------


Thanks for reviewing and happy coding!
