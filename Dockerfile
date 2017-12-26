FROM node:7.7.3

ENV DEBCONF_NONINTERACTIVE_SEEN="true" \
    DEBIAN_FRONTEND="noninteractive"

RUN apt-get -qq update && \
    apt-get -qqy install netcat && \
    apt-get -qqy autoremove && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN npm init -y && npm install node-lifx
ADD src/server.js ./
ADD src/flame_* ./

ENV BULB_IPS="127.0.0.1,127.0.0.2"

VOLUME ["/var/log"]

EXPOSE 9000
CMD /usr/local/bin/node server.js
