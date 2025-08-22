1. PostgreSQL Database: [uses aws -> .env] - hosted [Database Name: pulse]
` Require [DB_NAME, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_ENDPOINT, DATABASE_URL] `
` Getting through AWS RDS SECTION `

-- Add More If Exist --

- Oauth -> Save OAuth Info
- User -> Save User Info
- Leaderboard -> Save User Score According to Quest Completed & Rankings.
- Pet -> Save User Pet Info
- Quest -> Save Quest Info
- Quest Completion -> Quest Completed Record by Each User [User & Practitioner]
- Achievement -> Achievement Acquire Once A Quest is Completed
- Forum -> Save Forum Topics
- Forum Post -> Save Forum Posts
- Forum Comment -> Save Forum Comments

2. DynamoDB Database: [uses localhost -> .env] [DynamoDB Name - On AWS Creation: pulse] # Self-Host in Development
Note: LiveChat Function Usage Only.
` Require [AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_DYNAMODB_ENDPOINT] `
` Getting through AWS DYNAMODB SECTION `

*These are Table Names - NO DATABASE NAME*
- ChatSession -> Save Chat Record Created By Users
- ChatMessage -> Save Chat Messages according to Chat Record

3. S3 Buckets: [uses personal aws account -> .env] [Bucket Name: pulse] 
Note: require access key & secret rotation - 4 hours # Self-Host in Development

` Require [AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_LOGIN_SESSION_TOKEN AWS_S3_BUCKET_NAME] `
` Getting through LEARNER LAB INFO SECTION `
Note: Document Saving [profile picture, live chat, practitioner verification, achievement image]

Current Format:
- /profile/userId/xxx... [profile picture]
- /chat/chatmessageId/xxx... [chat message attachment]
- /practitioner/practitionerId/xxx... [practitioner verification docs]
- /achievement/achievementId/xxx... [achievement pictures]
