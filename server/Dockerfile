FROM node:alpine

COPY ./ /opt/restful-demo/server
WORKDIR /opt/restful-demo/server
RUN npm --registry https://registry.npm.taobao.org install
EXPOSE 10090
CMD ["npm", "run", "start"]
