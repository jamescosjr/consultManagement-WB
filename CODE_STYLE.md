# Code Style / Guia rápido

Este documento resume as principais convenções adotadas no projeto (baseado em `CODING_CONVENTIONS.md`).

1) Formatação
- Indentação: 4 espaços.
- Linhas em branco para separar blocos lógicos.

2) Nomenclatura
- Variáveis e funções: `camelCase`.
- Constantes globais: `UPPER_CASE`.
- Classes / Schemas: `PascalCase`.
- Arquivos: `kebab.case.js` ou `snake.case.js` (seguir padrões do repositório).

3) Exports / Imports
- Prefira named exports quando possível.
- Use default exports para routers e middlewares quando fizer sentido.
- Sempre incluir extensão `.js` nos imports.
- Ordem de imports: packages externos → domínio → repositories/schemas → configs locais.

4) Async / Erros
- Use `async/await` em serviços e controllers.
- Trate erros com `AppError`/subclasses e repasse para `next(err)` no controller.

5) Tests
- Escreva testes de integração para endpoints críticos (Jest + mongodb-memory-server).
- Testes devem limpar/isolarem estado entre execuções.

6) Observability
- Use os middlewares de `httpLogger`, `metrics` e `tracing` já existentes.

7) Commit messages
- Use convetional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`.

Referência completa e exemplos estão em `CODING_CONVENTIONS.md`.
