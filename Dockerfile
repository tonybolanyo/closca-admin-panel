FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/closca-admin-panel/ /usr/share/nginx/html/
