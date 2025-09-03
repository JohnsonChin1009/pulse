## Setting up AWS Credentials Locally

1. Go to IAM
2. Create a new IAM user "pulse-assignment"
3. Give Programmatic Access
4. Attach Following Policies (`AmazonRDSFullAccess`, `AmazonDynamoDBFullAccess`)
5. Download Access Key and Secret Key
6. Configure locally using aws configure
7. Can double check using

```bash
aws sts get-caller-identity
```
