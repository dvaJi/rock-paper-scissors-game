# Rock Paper Scissors Game

## Start app using docker compose

Run:

```
docker-compose up
```

Visit: `http://localhost:80/`

## Start app standalone

### Configure Database

Create a Postgresql database.

### API

At `/api` directory, create a `.env` based on `.env.example`
Modify it using the values based on the previous datababase created previously.

### Run API

```
npm install
npm run start:dev
```

## WEB

At `/web` directory, create a `.env` based on `.env.example`.

### Run Web

```
npm install
npm start
```

Visit: `http://localhost:3000/` and `http://localhost:8080/swagger` to visit the api
