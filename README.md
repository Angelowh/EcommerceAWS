# Ecommerce AWS
Projeto simples para testar conhecimentos do Curso de AWS Serverless com TypeScript e AWS Development Kit.

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


### 📚 Demais configurações:
- CloudWatch (para gravar logs em LogGroups)
- IAM (Controle de permissões)
---

## 📌 Como executar o projeto?

Pré Requisitos:
- Certifique-se de estar com o CLI configurado corretamente e com as permissões necessárias para sua conta.
- Caso seja necessário, consulte em: [Configuração da AWS CLI](https://docs.aws.amazon.com/pt_br/cli/latest/userguide/getting-started-quickstart.html)
- Instale o Docker Desktop (ou o Docker Engine caso não tenha permissão de instalar na máquina todos os recursos)

1. Dentro da pasta bin, acesso o arquivo "e_commerce_aws.ts";
2. Note que há variáveis para guardar o account e region da conta, preencha com as informações respectivas de sua conta.
3. Feito o passo acima, certifique-se de estar rodando o Docker Desktop (ou o Docker Engine) e rode o comando "cdk deploy --all".
4. O processo demora alguns minutos, mas ao ser concluído com sucesso irá criar todos os elementos necessários.
5. Ao final do processamento, note que será retornado uma URL de Endpoint para acessar as rotas. Copie o valor devolvido.
6. Em seguida, importe os arquivos para testar as rotas no Insomnia.
7. Dentro de Environment, substitua o valor do base-URL com o valor da URL de Endpoint retornada no ponto 5.

Processo finalizado e pronto para teste: ✅

---
## 👨‍💻 Stack
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![AWS](https://custom-icon-badges.demolab.com/badge/AWS-%23FF9900.svg?logo=aws&logoColor=white)](#)
[![AWS Lambda](https://custom-icon-badges.demolab.com/badge/AWS%20Lambda-%23FF9900.svg?logo=aws-lambda&logoColor=white)](#)

