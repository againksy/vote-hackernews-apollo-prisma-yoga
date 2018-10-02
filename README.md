# React-create-app-prisma-apollo-yoga-docker

### Prepare
 
This will create prisma+postgresql containers, prisma on 0.0.0.0:4467:
  ```sh
  cd ./server/database && docker-compose up -d

  cd .. && prisma deploy
  ```


npm i in project root and in ./server dir

for production build run from root:
  ```sh
  REACT_APP_SERVER_URI=$_domain_or_api_ npm run build
  ```

  and start server/index.js with pm2(for example)


for dev start:
  npm start in ./server
  npm start in ./
   navigate to http://localhost:3000/
