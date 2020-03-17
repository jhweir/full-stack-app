# Sequelize commands

`npm install --save sequelize-cli`

`npx sequelize-cli init`

`npx sequelize-cli db:migrate`
`npx sequelize-cli db:migrate:undo:all`

`npx sequelize-cli db:seed:all` 
`npx sequelize-cli db:seed:undo` 
`npx sequelize-cli db:seed:undo:all`

## Generate Models
‘id’, ‘createdAt’, and ‘updatedAt’ attributes generated automatically by Sequelize.

TODO: Describe the purpose of each table, inlcude link to table map on Draw.io

### Holon
`npx sequelize-cli model:generate --name Holon --attributes handle:string,name:string,description:string,flagImagePath:string,coverImagePath:string`

### HolonHolon
`npx sequelize-cli model:generate --name HolonHolon --attributes relationship:string,state:string,holonAId:integer,holonBId:integer`

### HolonUser
`npx sequelize-cli model:generate --name HolonUser --attributes holonId:integer,userId:integer`

### HolonPost
`npx sequelize-cli model:generate --name HolonPost --attributes holonId:integer,postId:integer`

### User
`npx sequelize-cli model:generate --name User --attributes handle:string,name:string,bio:string,profileImagePath:string,coverImagePath:string`

### Post
`npx sequelize-cli model:generate --name Post --attributes postType:string,privacySetting:string,creator:integer,note:string,title:string,description:string,url:string,imagePath:string`

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

## Generate Seeders
`npx sequelize-cli seed:generate --name demo-holon`
`npx sequelize-cli seed:generate --name demo-user`
