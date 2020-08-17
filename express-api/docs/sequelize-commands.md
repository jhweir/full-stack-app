# Sequelize commands
Install sequelize-cli
`npm install --save sequelize-cli`

Initialise the project
`npx sequelize-cli init`

Migrate all models to tables in the database
`npx sequelize-cli db:migrate`

Remove all migrated tables from the database
`npx sequelize-cli db:migrate:undo:all`

Create new migration skeleton for table changes
`npx sequelize-cli migration:generate --name migration-skeleton2`

Seed all demo content into the database
`npx sequelize-cli db:seed:all`

Remove all seeded demo content from the database
`npx sequelize-cli db:seed:undo:all`

## Generate Models/Tables
‘id’, ‘createdAt’, and ‘updatedAt’ attributes generated automatically by Sequelize.

TODO: Describe the purpose of each table, inlcude link to table map on Draw.io

### Holon
`npx sequelize-cli model:generate --name Holon --attributes handle:string,name:string,description:string,flagImagePath:string,coverImagePath:string`

### VerticalHolonRelationship
Holon A is a direct parent of holon B
`npx sequelize-cli model:generate --name VerticalHolonRelationship --attributes state:string,holonAId:integer,holonBId:integer`

### HolonTag
Posts to holon A appear within holon B
`npx sequelize-cli model:generate --name VerticalHolonRelationship --attributes state:string,holonAId:integer,holonBId:integer`

### HolonUser
`npx sequelize-cli model:generate --name HolonUser --attributes relationship:string,holonId:integer,userId:integer`

### PostHolon
`npx sequelize-cli model:generate --name PostHolon --attributes creator:integer,relationship:string,state:string,postId:integer,holonId:integer`

### User
`npx sequelize-cli model:generate --name User --attributes handle:string,name:string,bio:string,flagImagePath:string,coverImagePath:string`

### Post
`npx sequelize-cli model:generate --name Post --attributes type:string,privacySetting:string,creator:integer,note:string,title:string,description:string,url:string,imagePath:string`

### UserUser
`npx sequelize-cli model:generate --name UserUser --attributes relationship:string,userAId:integer,userBId:integer`

### Comment
`npx sequelize-cli model:generate --name Comment --attributes creator:integer,parentCommentId:integer,postId:integer,text:string`

### Label
`npx sequelize-cli model:generate --name Label --attributes type:string,value:string,holonId:integer,userId:integer,postId:integer,commentId:integer`

### Notification
`npx sequelize-cli model:generate --name Notification --attributes type:string,text:string,holonId:integer,userId:integer,postId:integer,commentId:integer`

### Message
`npx sequelize-cli model:generate --name Message --attributes type:string,state:string,from:integer,to:integer,text:string`

### PollAnswer
`npx sequelize-cli model:generate --name PollAnswer --attributes creator:integer,text:string,postId:integer`

### Session
`npx sequelize-cli model:generate --name Session --attributes sid:integer,expires:date,data:string`

## Generate Seeders
`npx sequelize-cli seed:generate --name demo-holons`
`npx sequelize-cli seed:generate --name demo-holon-tags`
`npx sequelize-cli seed:generate --name demo-vertical-holon-relationships`
`npx sequelize-cli seed:generate --name demo-posts`
`npx sequelize-cli seed:generate --name demo-post-holons`
`npx sequelize-cli seed:generate --name demo-labels`
`npx sequelize-cli seed:generate --name demo-users`
