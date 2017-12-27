# lifx-api-endpoint
[node server](https://nodejs.org/api/net.html#net_class_net_server) running in docker to execute commands on local lan connected [lifx bulbs](https://www.lifx.com/products/lifx-plus) used with [ha-bridge](https://github.com/aptalca/docker-ha-bridge) for alexa integration to avoid cloud bullshit

lifx api @ [npmjs](https://www.npmjs.com/package/node-lifx) &#124; [github](https://github.com/MariusRumpf/node-lifx)  
demo usage script @ /app/send_cmd inside container  

## Environment Variables

### Required

* BULB_IPS
  * comma separated list of lifx lights ip's
* LISTEN_PORT
  * port the node server will use to listen for connections

### Optional

* LISTEN_HOST
  * the host/ip to listen for connections on
* BROADCAST_NETWORK
  * Network address the lifx api sends out udp broadcasts on
* LIFX_DEBUG
  * enable debug mode on the lifx api library

## Example usage
```
# Run the container

docker run -d --net=host --name lifx-api-endpoint \
  --log-driver json-file 0-log-opt max-size=10m \
  -e LISTEN_PORT='9010' \
  -e BROADCAST_NETWORK='192.168.55.0' \
  -e BULB_IPS='192.168.55.10,192.168.55.11' \
    snipzwolf/lifx-api-endpoint;

# Sending commands

docker exec -it lifx-api-endpoint /bin/bash /app/send_cmd off;
docker exec -it lifx-api-endpoint /bin/bash /app/send_cmd scene,bright;
```
