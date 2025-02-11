FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN yarn install --frozen-lockfile --production=false
RUN yarn add -D typescript ts-node
COPY . .
# Pass env vars to docker images
RUN echo ${DATABASE_URL} ${PORT}
ENV DATABASE_URL=${DATABASE_URL}
ENV PORT=${PORT}
ENV POSTGRES_USER=${POSTGRES_USER}
ENV POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
ENV POSTGRES_DB=${POSTGRES_DB}
RUN rm -rf node_modules/.prisma
RUN rm -rf prisma/generated
RUN yarn global add prisma
RUN npx prisma generate
RUN yarn build

EXPOSE 3001

CMD [ "yarn", "start" ]