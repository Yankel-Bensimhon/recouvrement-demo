# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install app dependencies
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Define environment variable if needed (though docker-compose is better for this)
# ENV NODE_ENV production

# Run the app when the container launches
CMD [ "npm", "run", "dev" ]
# For production, you might use: CMD [ "npm", "start" ]
