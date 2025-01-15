FROM node:20
RUN npm install -g pnpm@9.15.3
RUN npm install -g @ionic/cli@7.2.0
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm run build-plugin
RUN pnpm run build
