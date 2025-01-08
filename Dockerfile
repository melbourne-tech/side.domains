# syntax=docker/dockerfile:1

FROM node:20-alpine AS base

# --- Dependencies ---
FROM base AS deps
RUN apk add --no-cache libc6-compat git

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# --- Builder ---
FROM base AS builder

WORKDIR /app

ARG SUPABASE_SERVICE_KEY
ARG RESEND_API_KEY
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_ROOT_DOMAIN
ARG NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_FATHOM_SITE_ID

ENV NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1 \
  SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY \
  RESEND_API_KEY=$RESEND_API_KEY \
  NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
  NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
  NEXT_PUBLIC_ROOT_DOMAIN=$NEXT_PUBLIC_ROOT_DOMAIN \
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY \
  NEXT_PUBLIC_FATHOM_SITE_ID=$NEXT_PUBLIC_FATHOM_SITE_ID

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- Production ---
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production \
  NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache curl
RUN addgroup nodejs
RUN adduser -SDH nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]