MIGRATIONS - Uso recomendado (Kuvia Backend)

Objetivo
- Não usar `sequelize.sync({ alter: true })` em produção.
- Controlar mudanças de esquema com migrações versionadas (reversíveis).
- Fazer backup antes de aplicar migrações em produção.

Opções comuns
1) Usar `sequelize-cli` (fácil, integrado ao Sequelize)
   - Instalar localmente:
     ```bash
     cd kuvia-backend
     npm install --save-dev sequelize-cli
     npx sequelize init
     ```
   - Criar migration:
     ```bash
     npx sequelize migration:generate --name add_some_column
     ```
   - Editar o arquivo gerado em `migrations/` (up/down).
   - Aplicar migrações:
     ```bash
     npx sequelize db:migrate --env production
     ```
   - Reverter última migração:
     ```bash
     npx sequelize db:migrate:undo --env production
     ```

2) Usar Umzug (mais flexível): implementar runner customizado e aplicar migrations via script.

Boas práticas
- Fazer dump/backup do banco antes de migrar em produção.
- Testar migrações em staging com dados similares antes do deploy.
- Evitar operações longas dentro de `up` (ex.: `ALTER TABLE` com scans massivos) durante horários de pico.
- Documentar cada migration com comentário explicando motivo e impacto.

Deploy
- Incluir passo de `db:migrate` no pipeline CI/CD após deploy da nova imagem/versão.
- Garantir que apenas a pipeline (não múltiplos processos simultâneos) execute migrações.

Notas
- O projeto agora pula `sequelize.sync()` quando `NODE_ENV=production`. Use as instruções acima para aplicar alterações em produção.
