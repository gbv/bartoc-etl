# Dockerfile - sviluppo per app ETL Bartoc

# Base image con Node.js
FROM node:23-alpine

# Imposta la working directory
WORKDIR /usr/src/app

# Copia i file di configurazione e dipendenze
COPY package*.json tsconfig.json ./
COPY nodemon.json ./

# Installa le dipendenze (inclusi devDependencies)
RUN npm ci

# Copia tutto il codice sorgente
COPY . .

# Espone la porta dell'app
EXPOSE 3000

# Comando di default: avvia in modalità sviluppo con nodemon
CMD ["npm", "run" , "dev"]
