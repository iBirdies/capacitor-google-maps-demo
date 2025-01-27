FROM node:20
RUN npm install -g @ionic/cli@7.2.0
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build
