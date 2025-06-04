# Use an official Nginx image as a parent image
FROM nginx:alpine

# Set the working directory in the container
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy static assets from the current directory to the Nginx directory
COPY ./index.html ./
COPY ./style.css ./
COPY ./main.js ./
COPY ./ui.js ./
COPY ./scoring.js ./
COPY ./feedback.js ./
# Add any other static assets like images if they exist

# Expose port 80 to the outside world
EXPOSE 80

# Command to run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
