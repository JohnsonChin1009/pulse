import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamodbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || "local",
  endpoint: process.env.AWS_DYNAMODB_ENDPOINT || "http://localhost:8000",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// document client sdk -> for modifying the dynamodb
const ddbDocClient = DynamoDBDocumentClient.from(dynamodbClient);

export default ddbDocClient;
