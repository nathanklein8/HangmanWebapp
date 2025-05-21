# Stage 1: Install dependencies
FROM node:18-alpine AS base

FROM base AS deps

# Install OS deps for Prisma
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package files and install deps
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build the app
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Production image
FROM base AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy only necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma/seed.js ./prisma/seed.js

USER nextjs

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

EXPOSE 3000

CMD HOSTNAME="0.0.0.0" node server.js