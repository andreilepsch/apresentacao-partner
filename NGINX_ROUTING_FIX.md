
# Correção para Erro 404 em Rotas (SPA - Single Page Application)

O erro 404 ocorre porque o servidor Nginx está tentando encontrar um arquivo físico chamado "auth" na pasta do site, mas essa rota é virtual (gerenciada pelo React).

Para corrigir, você precisa adicionar a diretiva `try_files` na configuração do seu bloco `server` no Nginx.

## Configuração Necessária

Localize o arquivo de configuração do seu site no Nginx (geralmente em `/etc/nginx/sites-available/seu-site` ou no painel da sua hospedagem) e modifique o bloco `location /`:

```nginx
server {
    # ... outras configurações ...
    
    root /caminho/para/seu/projeto/dist; # ou onde estiverem os arquivos estáticos
    index index.html;

    location / {
        # Esta linha é a mágica:
        # 1. Tenta acessar o arquivo solicitado ($uri)
        # 2. Tenta acessar como diretório ($uri/)
        # 3. Se não encontrar, redireciona para o index.html (para o React gerenciar a rota)
        try_files $uri $uri/ /index.html;
    }

    # ... restante da configuração ...
}
```

## Passo a Passo

1. Abra o arquivo de configuração do Nginx no servidor.
2. Encontre o bloco `location /`.
3. Adicione ou modifique a linha `try_files` conforme acima.
4. Reinicie o Nginx: `sudo service nginx restart` ou `sudo systemctl restart nginx`.
