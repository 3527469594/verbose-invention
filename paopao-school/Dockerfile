# 构建阶段
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY server ./server
COPY server/config ./config  # 修正配置文件路径
RUN npm install
RUN apk add --no-cache ca-certificates && update-ca-certificates

# 生产阶段
FROM node:16-alpine
RUN apk add --no-cache ca-certificates && update-ca-certificates
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server ./server
COPY --from=builder /app/config ./config  # 保持路径一致性

COPY . .

CMD ["npm", "start"]
COPY --from=builder /app/config ./config