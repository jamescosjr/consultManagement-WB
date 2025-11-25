# Pull Request

## Descrição
<!-- Descreva as mudanças feitas neste PR -->

## Tipo de Mudança
<!-- Marque com um 'x' as opções aplicáveis -->

- [ ] 🐛 Bug fix (correção de problema)
- [ ] ✨ New feature (nova funcionalidade)
- [ ] 💥 Breaking change (mudança que quebra compatibilidade)
- [ ] 📝 Documentation update (atualização de documentação)
- [ ] ♻️ Refactoring (refatoração de código)
- [ ] ✅ Tests (adição ou correção de testes)
- [ ] 🎨 Style (formatação, estilo)

## Mudanças Específicas
<!-- Liste as principais mudanças -->

- 
- 
- 

## Checklist

### Arquitetura e Código
- [ ] Segui as regras do [AGENT.md](../AGENT.md)
- [ ] Segui as convenções do [CODING_CONVENTIONS.md](../CODING_CONVENTIONS.md)
- [ ] Respeitei as restrições do [RESTRICTIONS.md](../RESTRICTIONS.md)
- [ ] Não violei a separação de camadas (Application/Domain/Infrastructure)
- [ ] Usei repositories em vez de acessar schemas diretamente nos services

### Validação e Erros
- [ ] Adicionei validações apropriadas
- [ ] Usei classes de erro corretas (AppError, NotFoundError, ValidationError)
- [ ] Todos os erros são tratados adequadamente com try/catch
- [ ] Erros são passados para o middleware de erro com `next(error)`

### Segurança e Autenticação
- [ ] Rotas sensíveis estão protegidas com `ensureAuthenticated`
- [ ] Rotas restritas usam `ensureRoles` apropriadamente
- [ ] Não exponho informações sensíveis (passwordHash, etc.)
- [ ] Validei integridade referencial (doctor/patient existem antes de criar consult)

### Testes
- [ ] Adicionei testes para novas funcionalidades
- [ ] Todos os testes estão passando (`npm test`)
- [ ] Coverage está >= 80%
- [ ] Testes incluem success e error cases
- [ ] Testes limpam o banco após execução

### Código Limpo
- [ ] Removi todos os `console.log` de debug
- [ ] Removi código comentado
- [ ] Sem variáveis não utilizadas
- [ ] Imports organizados corretamente
- [ ] ESLint sem erros

### Documentação
- [ ] Atualizei [API_REFERENCE.md](../API_REFERENCE.md) se necessário
- [ ] Atualizei README.md se necessário
- [ ] Adicionei comentários JSDoc para funções públicas
- [ ] Atualizei CHANGELOG (se houver)

### Commits
- [ ] Usei conventional commits (feat:, fix:, docs:, etc.)
- [ ] Mensagens de commit são descritivas
- [ ] Commits são atômicos e focados

## Testes Realizados
<!-- Descreva os testes que você executou -->

```bash
npm test
# Cole aqui a saída relevante
```

## Screenshots (se aplicável)
<!-- Adicione screenshots se relevante -->

## Relacionado a
<!-- Issues relacionadas -->

Closes #
Relates to #

## Observações Adicionais
<!-- Qualquer informação adicional relevante -->

---

## Checklist do Revisor

- [ ] Código segue arquitetura do projeto
- [ ] Testes são adequados e passam
- [ ] Documentação está atualizada
- [ ] Não há problemas de segurança
- [ ] Performance é adequada
- [ ] Código está limpo e legível
