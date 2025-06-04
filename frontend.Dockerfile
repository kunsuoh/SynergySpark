# frontend.Dockerfile
FROM nginx:alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY ./frontend/index.html ./
COPY ./frontend/style.css ./
COPY ./frontend/main.js ./
COPY ./frontend/ui.js ./
COPY ./frontend/scoring.js ./
COPY ./frontend/feedback.js ./

# Copy custom Nginx configuration
COPY ./frontend/nginx.conf /etc/nginx/nginx.conf
# Note: This overwrites the default nginx.conf.
# For more complex setups, one might use /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
