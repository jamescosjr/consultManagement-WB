# 📖 Documentação do Projeto - Índice

Bem-vindo à documentação completa do **Consult Management API**!

## 🎯 Por Onde Começar?

### Se você é novo no projeto:
1. Leia o [README.md](./README.md) para visão geral
2. Siga o [QUICK_START.md](./QUICK_START.md) para configurar o ambiente
3. Estude o [AGENT.md](./AGENT.md) para entender a arquitetura

### Se você vai contribuir:
1. Leia [AGENT.md](./AGENT.md) - Arquitetura e regras
2. Leia [CODING_CONVENTIONS.md](./CODING_CONVENTIONS.md) - Padrões de código
3. Leia [RESTRICTIONS.md](./RESTRICTIONS.md) - Limitações e restrições
4. Use [QUICK_START.md](./QUICK_START.md) como referência

### Se você precisa usar a API:
1. Consulte [API_REFERENCE.md](./API_REFERENCE.md) - Documentação completa dos endpoints

---

## 📚 Documentação Completa

### 🚀 [README.md](./README.md)
**Visão Geral do Projeto**
- O que é o projeto
- Features principais
- Como instalar e rodar
- Links para outros documentos

**Quando usar**: Primeira leitura, apresentação do projeto

---

### 🤖 [AGENT.md](./AGENT.md)
**Guia Principal de Desenvolvimento**
- Arquitetura completa (3 camadas)
- Princípios de design (DDD, Clean Architecture)
- Padrões de nomenclatura
- Regras de implementação
- Fluxo de dados
- Entidades do sistema
- Como adicionar novas features
- Problemas conhecidos

**Quando usar**: 
- Antes de escrever qualquer código
- Ao adicionar novas features
- Ao fazer mudanças arquiteturais
- Para entender a estrutura do projeto

**Seções importantes**:
- 🏗️ Arquitetura de Camadas
- 📐 Princípios de Arquitetura
- 🔧 Regras de Implementação
- 🔄 Fluxo de Dados
- 🆕 Adicionando Novas Features

---

### ⚡ [QUICK_START.md](./QUICK_START.md)
**Guia Rápido de Início**
- Setup em 5 minutos
- Como criar um novo módulo (passo a passo completo)
- Comandos úteis
- Como debugar
- Estrutura de commits
- Checklist antes de fazer PR
- Dúvidas comuns com soluções

**Quando usar**:
- Primeira vez configurando o projeto
- Criando uma nova entidade
- Resolvendo problemas comuns
- Como referência rápida

**Seções importantes**:
- 🚀 Início Rápido
- 📝 Fluxo de Trabalho Típico (exemplo completo)
- 🐛 Debugging
- ❓ Dúvidas Comuns

---

### 📐 [CODING_CONVENTIONS.md](./CODING_CONVENTIONS.md)
**Convenções de Código**
- Nomenclatura (variáveis, funções, classes, arquivos)
- Estrutura de arquivos
- Ordem de imports
- Padrões de funções (async/await, arrow functions)
- Tratamento de erros
- Comentários e JSDoc
- Formatação (indentação, strings, objetos)
- ESLint
- Checklist antes de commit

**Quando usar**:
- Ao escrever código
- Durante code review
- Para manter consistência
- Antes de fazer commit

**Seções importantes**:
- 🏷️ Nomenclatura
- 📥 Imports e Exports
- ⚙️ Funções e Métodos
- 🚨 Tratamento de Erros
- ✅ Checklist Antes de Commit

---

### 🚫 [RESTRICTIONS.md](./RESTRICTIONS.md)
**Restrições e Limitações**
- O que NÃO fazer em cada camada
- Separação de Read/Write (CQRS)
- Restrições de autenticação/autorização
- Validação obrigatória
- Restrições de dados
- Integridade referencial
- Performance (paginação, .lean())
- Restrições de testes
- Segurança (passwords, JWT)
- Restrições de deploy

**Quando usar**:
- ANTES de implementar qualquer feature
- Durante code review
- Para validar se está seguindo as regras
- Quando tiver dúvidas sobre "posso fazer isso?"

**Seções importantes**:
- 🚫 Restrições Arquiteturais (por camada)
- 🔒 Restrições de Acesso ao BD
- 🔐 Autenticação e Autorização
- 🔄 Integridade Referencial

---

### 🌐 [API_REFERENCE.md](./API_REFERENCE.md)
**Referência Completa da API**
- Todos os endpoints disponíveis
- Request/Response examples
- Códigos de status HTTP
- Headers de autenticação
- Roles e permissões
- Exemplos de erros

**Quando usar**:
- Integração com a API
- Testar endpoints
- Documentar frontend
- Validar responses

**Seções importantes**:
- 🔐 Autenticação
- 👤 Patients (Pacientes)
- 👨‍⚕️ Doctors (Médicos)
- 📅 Consults (Consultas)
- 🔒 Códigos de Status HTTP

---

## 🎨 Templates do GitHub

### [PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md)
Template para Pull Requests com checklist completo

**Inclui**:
- Descrição e tipo de mudança
- Checklist de arquitetura
- Checklist de validação e erros
- Checklist de segurança
- Checklist de testes
- Checklist de código limpo
- Checklist de documentação

### [Bug Report](./.github/ISSUE_TEMPLATE/bug_report.yml)
Template para reportar bugs

### [Feature Request](./.github/ISSUE_TEMPLATE/feature_request.yml)
Template para solicitar novas funcionalidades

---

## 🗺️ Guia de Navegação por Tarefa

### "Quero adicionar uma nova entidade"
1. [QUICK_START.md](./QUICK_START.md) - Seção "Fluxo de Trabalho Típico"
2. [AGENT.md](./AGENT.md) - Seção "Adicionando Novas Features"
3. [CODING_CONVENTIONS.md](./CODING_CONVENTIONS.md) - Para estilo
4. [RESTRICTIONS.md](./RESTRICTIONS.md) - Para validar regras

### "Quero corrigir um bug"
1. [AGENT.md](./AGENT.md) - Entender arquitetura
2. [RESTRICTIONS.md](./RESTRICTIONS.md) - Ver se está violando alguma regra
3. [QUICK_START.md](./QUICK_START.md) - Debugging

### "Quero usar a API"
1. [API_REFERENCE.md](./API_REFERENCE.md) - Referência completa

### "Primeira contribuição"
1. [README.md](./README.md) - Visão geral
2. [QUICK_START.md](./QUICK_START.md) - Setup
3. [AGENT.md](./AGENT.md) - Arquitetura
4. [CODING_CONVENTIONS.md](./CODING_CONVENTIONS.md) - Padrões
5. [PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md) - Antes do PR

### "Fazer code review"
1. [AGENT.md](./AGENT.md) - Arquitetura
2. [RESTRICTIONS.md](./RESTRICTIONS.md) - Validar restrições
3. [CODING_CONVENTIONS.md](./CODING_CONVENTIONS.md) - Validar estilo
4. [PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md) - Checklist

---

## 📊 Estrutura Visual

```
consultManagement-WB/
│
├── README.md                      # 👈 COMECE AQUI
├── DOCS_INDEX.md                  # 👈 VOCÊ ESTÁ AQUI
├── AGENT.md                       # 🤖 Guia Principal
├── QUICK_START.md                 # ⚡ Início Rápido
├── CODING_CONVENTIONS.md          # 📐 Convenções
├── RESTRICTIONS.md                # 🚫 Restrições
├── API_REFERENCE.md               # 🌐 API Docs
│
├── .github/
│   ├── PULL_REQUEST_TEMPLATE.md   # PR Template
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.yml
│       ├── feature_request.yml
│       └── config.yml
│
└── src/
    ├── application/               # Controllers, Routes
    ├── domain/                    # Services, Validations
    └── infrastructure/            # Schemas, Repositories
```

---

## 🔍 Busca Rápida

### Procurando por...

**Como nomear arquivos?**
→ [CODING_CONVENTIONS.md](./CODING_CONVENTIONS.md#estrutura-de-arquivos)

**Como criar um controller?**
→ [AGENT.md](./AGENT.md#1-nomenclatura) e [QUICK_START.md](./QUICK_START.md#passo-5-controller)

**Como tratar erros?**
→ [AGENT.md](./AGENT.md#2-tratamento-de-erros) e [CODING_CONVENTIONS.md](./CODING_CONVENTIONS.md#tratamento-de-erros)

**Posso acessar Schema diretamente no Controller?**
→ NÃO! [RESTRICTIONS.md](./RESTRICTIONS.md#controllers-não-podem)

**Como fazer paginação?**
→ [RESTRICTIONS.md](./RESTRICTIONS.md#1-paginação-obrigatória-em-listagens)

**Como proteger uma rota?**
→ [AGENT.md](./AGENT.md#6-autenticação-e-autorização) e [API_REFERENCE.md](./API_REFERENCE.md#autenticação)

**Qual status HTTP usar?**
→ [AGENT.md](./AGENT.md#3-status-http) e [API_REFERENCE.md](./API_REFERENCE.md#códigos-de-status-http)

**Como escrever testes?**
→ [AGENT.md](./AGENT.md#testes) e [QUICK_START.md](./QUICK_START.md#passo-7-testes)

---

## 💡 Dicas

### Para Desenvolvedores
- Mantenha [AGENT.md](./AGENT.md) aberto enquanto codifica
- Use [QUICK_START.md](./QUICK_START.md) como referência rápida
- Consulte [RESTRICTIONS.md](./RESTRICTIONS.md) quando em dúvida

### Para Code Reviewers
- Use checklist do [PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md)
- Valide contra [RESTRICTIONS.md](./RESTRICTIONS.md)
- Verifique estilo com [CODING_CONVENTIONS.md](./CODING_CONVENTIONS.md)

### Para Usuários da API
- [API_REFERENCE.md](./API_REFERENCE.md) tem tudo que você precisa
- Exemplos completos de request/response

---

## 🆘 Ajuda

### Encontrou um problema na documentação?
Abra uma issue usando o template apropriado em `.github/ISSUE_TEMPLATE/`

### Quer contribuir com a documentação?
1. Leia [AGENT.md](./AGENT.md)
2. Faça suas alterações
3. Use [PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md)

---

**Última atualização**: 25 de novembro de 2025
