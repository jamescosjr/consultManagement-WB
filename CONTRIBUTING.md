# Contributing

Obrigado por contribuir! Siga estas orientações para facilitar revisão e integração.

Processo
- Fork → branch nomeada com escopo: `feat/<descrição>`, `fix/<descrição>`, `chore/<descrição>`.
- Abra PR com descrição clara: objetivo, alterações principais, como testar.

Antes de abrir PR
- [ ] Rode `npm install` e `npm test` localmente.
- [ ] Garanta que novos códigos sigam `CODE_STYLE.md`.
- [ ] Atualize `API_REFERENCE.md` se houver mudanças de contrato.

Critérios de aceitação
- Testes automatizados para novas features/bugs críticos.
- Linters e formatação consistentes.
- Documentação atualizada quando necessário.

Commits
- Mensagens curtas e convencionais: `feat: add login`, `fix: correct patient validation`.

Revisão
- Responda comentários do revisor e atualize o PR.
- Squash commits quando pedido para manter histórico limpo.

Contato
- Abra uma issue para discussões maiores antes de implementar mudanças significativas.
