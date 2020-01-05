FROM arm32v7/node:12.14-alpine

ENV DEBCONF_NONINTERACTIVE_SEEN="true" \
    DEBIAN_FRONTEND="noninteractive"

RUN apk add --purge --no-cache -qf netcat;

ENV LISTEN_HOST="127.0.0.1" \
    LIFX_DEBUG="false" \
    LIFX_CLIENT_PORT="56700"

WORKDIR /app
RUN npm init -y && npm install node-lifx
ADD src/* ./

CMD /usr/local/bin/node server.js
