FROM node:22-alpine

RUN apk add --no-cache git bash su-exec
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

WORKDIR /app

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["sleep", "infinity"]
