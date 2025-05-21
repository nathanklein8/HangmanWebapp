# Hangman WebApp

Deployed live <a href="https://app.nklein.xyz/">here</a>

Stack:
* Next.JS
* Prisma
* PostgreSQL

Uses some shadcn/ui components

## To Deploy:


### 1. Clone repo

Clone to a new folder, `hangman/`, in the cwd
```shell
git clone --depth=1 https://github.com/nathanklein8/HangmanWebapp.git ./hangman
```

### 2. Build Docker image

```shell
docker compose -f hangman/deploy-docker-compose.yml build
```


### 3. Set up .env file

Create a file `hangman/hangman.env`

(if you use a different filename, edit deploy-docker-compose.yml).

It should define the following env vars:

```shell
# Shared DB config
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_PORT=5432

# Prisma-compatible DATABASE_URL
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@database:${POSTGRES_PORT}/prod
```


### 4. Start Compose stack

```shell
docker compose -f hangman/deploy-docker-compose.yml up -d
```


### 5. Seeding the database

On a clean start, the db will be empty, to seed it with around 50k words run:

```shell
docker exec app npx prisma migrate dev --name init &&
docker exec app npm run prisma:seed
```
*Note: if you changed the frontend service name (app) in the compose file, change it here too*
