# Utilisez une image Node.js pour construire l'application
FROM node:14 as build

# Définissez le répertoire de travail
WORKDIR /app

# Copiez le fichier package.json et le fichier package-lock.json
COPY package*.json ./

# Installez les dépendances du serveur Express
RUN npm install

# Copiez les fichiers de l'application Express (serveur) dans l'image
COPY server.js ./
COPY routes/ ./routes/
COPY controllers/ ./controllers/

# Allez dans le répertoire de l'application Angular
WORKDIR /app/angular-app

# Copiez le fichier package.json et le fichier package-lock.json de l'application Angular
COPY angular-app/package*.json ./

# Installez les dépendances de l'application Angular
RUN npm install

# Copiez les fichiers source de l'application Angular
COPY angular-app/ ./

# Compilez l'application Angular en utilisant la commande "ng build"
RUN npm run build

# Définissez l'étape de production
FROM node:14

# Définissez le répertoire de travail
WORKDIR /app

# Copiez le serveur Express et les dépendances depuis l'étape de construction
COPY --from=build /app ./

# Exposez le port sur lequel le serveur Express fonctionne (ajustez si nécessaire)
EXPOSE 3000

# Commande pour démarrer le serveur Express
CMD [ "node", "server.js" ]
