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
ADD src/* ./

CMD /usr/local/bin/node server.js
