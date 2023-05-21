FROM alpine:latest AS generator

# Install OpenSSL
RUN apk update && \
  apk add --no-cache openssl && \
  rm -rf "/var/cache/apk/*"

# Create and set mount volume
WORKDIR /nginx/ssl
# VOLUME  /nginx/ssl

COPY generate_key.sh /nginx/ssl/generate_key.sh

RUN chmod +x /nginx/ssl/generate_key.sh
RUN ./generate_key.sh

FROM nginx:stable-alpine

WORKDIR /etc/nginx/

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf
COPY ssl/ssl-param.conf /etc/nginx/ssl/ssl-param.conf
COPY --from=generator /nginx/ssl/* /etc/nginx/ssl/

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
