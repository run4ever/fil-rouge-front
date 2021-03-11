## prendre le serveur WEB NGINX
FROM nginx:alpine
## copier fichier config de NGINX personnalisé
COPY nginx.conf /etc/nginx/nginx.conf
## copier les fichiers Angular(HTML, CSS et JavaScript) de dist/ vers serveur NGINIX
COPY /dist/Fil-rouge-front /usr/share/nginx/html 