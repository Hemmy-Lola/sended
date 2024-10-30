 # Dockerfile_backend
 FROM node:14

 # Create app directory
 WORKDIR /app

 # Install app dependencies
 COPY package*.json ./
 RUN npm install

 # Copy app source code
 COPY . .

 # Expose the port the app runs on
 EXPOSE 3000

 # Command to run the app
 CMD ["node", "app.js"]