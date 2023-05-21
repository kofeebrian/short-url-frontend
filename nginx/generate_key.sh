#!/bin/sh

# Generate Key
openssl  req -x509  -nodes -days 365 -subj "/C=CA/ST=QC/L=Montreal/O=Company, Inc./CN=mydomain.com" -addext "subjectAltName=DNS:mydomain.com" -newkey rsa:2048 -keyout /nginx/ssl/nginx-selfsigned.key -out /nginx/ssl/nginx-selfsigned.crt

# Generate DHParam
# !!!TAKE A LONG TIME!!!
openssl dhparam -out /nginx/ssl/dhparam.pem 2048