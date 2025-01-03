# Build docker image.
FROM node:20 as node

# Khai báo tham số
ARG workdir=.
ARG VITE_API_URL
ARG VITE_APP_NAME
LABEL description="deploy react app"

# Khai báo workdir trong node.
WORKDIR /app

# Copy project vào trong workdir của node.
COPY ${workdir}/ /app/

# Cài đặt các thư viện node liên quan.
RUN npm install

# Chạy lệnh build.
RUN npm run build


