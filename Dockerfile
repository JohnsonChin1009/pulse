FROM node:18

WORKDIR /usr/src/app

# Copy only package.json first
COPY package*.json ./

# Install deps inside Linux (not from Windows host)
RUN npm install

# Now copy source code
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
