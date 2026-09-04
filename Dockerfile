# Usa o Nginx leve (versão Alpine) como servidor base
FROM nginx:alpine

# Remove a página padrão do Nginx (opcional)
RUN rm -rf /usr/share/nginx/html/*

# Copia o nosso arquivo HTML para a pasta padrão que o Nginx usa para exibir o site
COPY index.html /usr/share/nginx/html/index.html

# Expõe a porta 80, que será capturada pelo Easypanel
EXPOSE 80

# Inicia o servidor web
CMD ["nginx", "-g", "daemon off;"]
