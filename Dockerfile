# ==========================================
# Stage 1: Build (Compilación de la app)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia de manifiestos y dependencias para aprovechar caché de capas Docker
COPY package.json package-lock.json* ./
RUN npm ci

# Copia de todo el código fuente y build
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Production (Imagen final ligera)
# ==========================================
FROM nginx:alpine

# Copiar la build optimizada de React
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración custom Nginx para SPA (Single Page Application)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Iniciar servidor
CMD ["nginx", "-g", "daemon off;"]