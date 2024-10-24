docker build -t hangman-app .

cd word-api

docker build -t random-word-api .

docker compose up -d
