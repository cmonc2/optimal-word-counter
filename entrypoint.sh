#!/bin/sh
set -e

# Habilitar corepack nativo de Node.js
corepack enable

# Asegurar permisos correctos para el usuario 'node' en la caché compartida y node_modules
mkdir -p /home/node/.pnpm-store /app/node_modules /app/src/client/node_modules
chown -R node:node /home/node/.pnpm-store /app/node_modules /app/src/client/node_modules /home/node 2>/dev/null || true

# Ejecutar los comandos siempre como el usuario 'node'
exec su-exec node "$@"
