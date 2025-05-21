# Hangman WebApp

Deployed live <a href="https://app.nklein.xyz/">here</a>

Stack:
* Next.JS
* Prisma
* PostgreSQL

Uses some shadcn/ui components

## To Build:

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
