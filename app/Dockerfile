FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9000
CMD ["npx", "webpack", "serve", "--host", "0.0.0.0"]
