# Zerith — site, blog e administração

Next.js, React, TypeScript, PostgreSQL, Drizzle e Better Auth. Direção visual: Núcleo de Precisão.

## Acesso local

- Site: http://127.0.0.1:3000
- Blog: http://127.0.0.1:3000/blog
- Primeiro acesso: http://127.0.0.1:3000/admin/configurar
- Painel: http://127.0.0.1:3000/admin

O código de primeiro acesso está em `.setup/primeiro-acesso.txt`. Expira em 24 horas e funciona uma vez. Escolha sua senha na página, entre com italoafelisbino@gmail.com e conecte seu aplicativo autenticador. Guarde os códigos de recuperação. Nenhuma senha de proprietário foi definida pelo assistente. Para renovar um código expirado, execute `npm run admin:setup`; o comando não reabre cadastro depois que o administrador existe.

## Reiniciar

Na pasta deste projeto, execute `npm run local:db` em um terminal e `npm start` em outro. Mantenha ambos abertos. Depois de editar código, pare a aplicação, execute `npm run build` e reinicie. Para desenvolvimento, use `npm run dev` com o banco ativo.

Em outra instalação Windows com Node 24: `npm ci`, `npm run local:setup`, `npm run local:db`; em outro terminal: `npm run db:migrate`, `npm run admin:setup`, `npm run build`, `npm start`.

O banco persistente fica em `%LOCALAPPDATA%\ZerithWeb\postgres`, fora do OneDrive, e escuta apenas em 127.0.0.1:55432 com SCRAM. As credenciais ficam em `%LOCALAPPDATA%\ZerithWeb\postgres-local.json`. Preserve esses arquivos e `.env.local` em local seguro. Nunca publique segredos ou a pasta `.setup`.

## Recursos

- Site institucional responsivo, soluções, produtos/Fleet, sobre, contato e privacidade.
- Blog com busca, categorias, tags, paginação, artigo, autoria, SEO e atualização automática dos últimos artigos na home.
- Editor Markdown, prévia, biblioteca/capa, SEO, rascunhos, publicação, despublicação e arquivo reversível.
- Controle de versão contra sobrescrita por outra aba.
- Imagens JPG/PNG/WebP de até 5 MB e 24 megapixels, verificadas e reprocessadas sem metadados. Imagens de rascunhos exigem acesso administrativo.
- Cadastro fechado, senha de pelo menos 12 caracteres, MFA obrigatório, códigos de recuperação, sessões revogáveis, troca de senha e auditoria.
- Autorização e prova MFA por sessão em todas as operações CMS; cookies HTTPOnly, verificação de origem, limites de autenticação e revogação consultada no banco.
- Markdown sem HTML executável, imagens remotas ou links de script.

Blog inicialmente vazio, sem conteúdo fictício. Contato prepara e-mail para o aplicativo do visitante; não envia por SMTP nem armazena o formulário.

## Testes

Execute `npm run typecheck`, `npm run build`, `npm run test:cms`. Com o site ativo na porta 3000, execute `npm run test:smoke`.

O teste CMS cria um banco temporário separado e inicia a aplicação na porta 3001. Testa 43 condições de autenticação, publicação, privacidade e controle de acesso; remove o banco ao terminar. Exige PostgreSQL local ativo, porta 3001 livre e compilação atual. Não cria dados no banco de trabalho.

## Limites e publicação

Entrega local: não houve deploy, push ou alteração de DNS. Para produção, definir hospedagem PostgreSQL, HTTPS, URL/segredo exclusivos, backup com restauração testada, retenção e monitoramento. Preserve o segredo Better Auth, usado na proteção do MFA. Use pg_dump ou backups da hospedagem; copiar o diretório do banco ativo não é backup consistente.

Não há recuperação de senha por e-mail, gestão de equipe, comentários ou newsletter. Guarde sua senha e os códigos de recuperação MFA. Indexação segue desabilitada. Monograma e ilustrações são conceituais; vídeo Higgsfield não integra esta entrega. A integração ao repositório oficial permanece uma etapa própria.

Se o Node precisar da autoridade certificadora do Windows, use `$env:NODE_USE_SYSTEM_CA='1'` no terminal. Nunca desative a validação TLS.
