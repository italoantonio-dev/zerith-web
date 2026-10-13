# Validação — blog e CMS

- Build de produção e TypeScript concluídos.
- 43 verificações integradas passaram em PostgreSQL temporário: primeiro acesso, MFA, páginas do painel, upload, rascunhos/prévias/imagens privados, publicação, filtros, home, Markdown seguro, slug, concorrência, origem e revogação de sessões.
- Blog e login conferidos visualmente no navegador local.
- Banco de trabalho preservado sem administrador e sem artigos de teste. O proprietário escolhe sua senha e configura o autenticador no primeiro acesso.
- Nenhuma nota Lighthouse ou certificação de acessibilidade atribuída. Nenhuma publicação na internet.

Os testes CMS usam a compilação .next. Rode build antes de repetir após alterações.
