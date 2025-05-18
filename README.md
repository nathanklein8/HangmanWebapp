# Hangman WebApp

Deployed live <a href="https://app.nklein.xyz/">here</a>

Next JS React App

Uses some shadcn/ui components

## To run in a Docker container

1. Clone repo
```shell
git clone https://github.com/nathanklein8/HangmanWebapp.git
```
2. Build docker image
```shell
docker build -t hangman-app HangmanWebapp/
```
3. Start an interative temporary container
```shell
docker run --rm -it -p "3000:3000" --name=hangman hangman-app
```
