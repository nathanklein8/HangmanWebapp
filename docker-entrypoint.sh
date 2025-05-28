#!/bin/sh
set -e

echo "Running entrypoint script for ENV=$ENV..."

# Extract hostname from DATABASE_URL
host=$(echo $DATABASE_URL | sed -E 's|.*@([^:/]+).*|\1|')
port=5432

echo "Waiting for Postgres at $host:$port..."

while ! nc -z $host $port; do
  echo "Waiting..."
  sleep 2
done

echo "Postgres is up - continuing..."

if [ "$ENV" = "prod" ]; then
  echo "Applying Prisma migrations..."
  npx prisma migrate deploy
elif [ "$ENV" = "test" ]; then
  echo "Pushing schema and seeding test database..."
  npx prisma db push
  npm run prisma:seed
else
  echo "Unknown ENV: $ENV. Skipping DB migration/seed."
fi

exec "$@"
