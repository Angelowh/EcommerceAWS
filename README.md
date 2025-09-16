# Ecommerce AWS
Projeto simples para testar conhecimentos do Curso de AWS Serverless com TypeScript e AWS Development Kit.

## Status do projeto
🚧 Em andamento 🚧

## 📚 Objetivo
- Desenvolver uma API simples que tenha as operações de:
   - Cadastrar produtos
   - Atualizar produtos
   - Listagem de produtos
   - Buscar produto por Id
   - Deletar produtos 

## 📌 Fluxo de funcionamento

<img width="1188" height="778" alt="image" src="https://github.com/user-attachments/assets/13b980d7-e86f-4cd7-bb8f-44de40f04b9f" />

Descrição do fluxo:
- Através da API Gateway a request é recebida e validada
- Após isso, a API Gateway identifica o tipo da request e invoca a função Lambda responsável
  - Caso seja uma listagem:
     - Será invocado a função Produtos Fetch. Esta tem apenas permissões de leitura.
  - Caso seja um cadastro, alteração ou deleção:
     - Será invocado a função Produtos Admin. Esta tem permissões de alterações na base de dados.
     - Em seguida também será disparado uma função para gravar eventos ocorridos em uma tabela específica.

## 🛠 Ferramentas:

### 🚧 Product Layer:
- Para limpeza e centralização de código, foi criado uma layer apenas para as operações relaciondas a tabela de Produtos.
- Esta solução foi adotada para reduzir o código das funções de Admin e Fetch. Permitindo implementar apenas o que interessa em cada função.

  <img width="1051" height="408" alt="image" src="https://github.com/user-attachments/assets/5db067b2-e7f1-462b-b8cb-cfa30c632b25" />


### 📑Base de dados:
- Para manter o escopo mais simples do projeto, foi adotado o banco NoSQL DynamoDB.
- Este banco foi adotado para não ter "dor de cabeça" com configurações no modelo relacional.


### 📚 Demais configurações:
- Para logs, foi adotado o CloudWatch para manter toda config dentro da AWS.
- Para controle de permissões, o IAM guarda permissões mais sensíveis ao projeto.

---

## 👨‍💻 Stack
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![AWS](https://custom-icon-badges.demolab.com/badge/AWS-%23FF9900.svg?logo=aws&logoColor=white)](#)
[![AWS Lambda](https://custom-icon-badges.demolab.com/badge/AWS%20Lambda-%23FF9900.svg?logo=aws-lambda&logoColor=white)](#)

