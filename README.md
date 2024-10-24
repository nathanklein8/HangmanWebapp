# Hangman WebApp

<a href="https://app.nklein.xyz/">Live Deployment</a>

Next JS React App created using shadcn/ui components

## Docker Deployment

### Run Script <br>
run `start.sh` shell script. Requires docker compose.

**or**

### Build and run manually:

1. Build Application image: <br>
  `docker build -t hangman-app .`

2. Build word API image: <br>
  `cd word-api && docker build -t random-word-api .`

3. Run containers: <br>
  `docker run -d -p 3001:8080 --name random-word-api random-word-api` <br>
  `docker run -d -p 3000:3000 --name hangman-app hangman-app` <br>

## Usage

http://localhost:3000
