FROM node:19.6.1-alpine

WORKDIR /app/BackEnd

COPY package*.json ./
COPY server.js ./
COPY ./base_datos/ ./
COPY ./base_datos/linux/ ./
COPY ./base_datos/w10/ ./
COPY . .

RUN npm install ./
RUN apk add mongodb-tools

# Agregar la ruta de instalación de MongoDB al PATH
ENV PATH="${PATH}:/usr/bin"

EXPOSE 4000

CMD ["npm","start"]