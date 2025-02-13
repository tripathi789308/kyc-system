FROM node:18-alpine

WORKDIR /app

COPY . .
RUN npm install
RUN npm install -g typescript ts-node

# Pass env vars to docker images
RUN echo ${DATABASE_URL} ${PORT}
ENV DATABASE_URL=${DATABASE_URL}
ENV PORT=${PORT}
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}
RUN rm -rf node_modules/.prisma
RUN rm -rf prisma/generated
RUN npm install -g prisma
RUN npx prisma generate
RUN npm run build

EXPOSE 3001

CMD [ "npm", "start" ]