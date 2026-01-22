FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npx prisma generate

EXPOSE 5555

CMD ["npx", "prisma", "studio", "--host", "0.0.0.0"]