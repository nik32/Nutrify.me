# Nutrify.me
To run the app demo - 
1. Make a config folder, with a keys.js file containing your mongoURL in following format -  
   module.exports = {  
      mongoURL: //YOur mongoURL  
   }
2. download the code from the repositries and type the following commands in the root folder -
   a. npm install
   b. node app.js

# Intro
This a backend focused web app which tracks the daily calorie intake of a user. It allows full CURD operations with following features - authentication, create meal record, read meal record according to date, edit meal record, delete meal record. The app also provides an admin module - which also has all the operations allowed for a normal user but there are additional features like - see all users on the site with teir details and allowing to edit and remove them from the app. Admin can also see the meals of each user. App uses SSR (through ejs templating) for a basic front-end.
