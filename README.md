# grupoStars
Teste Prático


# Observações

O projeto consiste no cadastro de empresas e seus colaboradores com os campos sugeridos no teste.

No projeto me imaginei dentro do Grupo Stars, e que a equipe me deixou responsável pelo projeto para a nossa empresa.

Fiz um sistema de login onde com qualquer login que você fizer terá acesso as mesmas informações, podendo cadastrar uma nova, e editar ou excluir as existentes.
Pensei que mais de uma pessoa poderia ficar responsável por esse cadastro ou edição, por isso fiz dessa maneira.

Uma ideia legal que tive seria que você precisaria de um Token dado pelo Grupo Stars para poder se cadastrar na aplicação assim só os membros do grupo poderiam se cadastrar e acesar á vontade as informações.
Mas com isso ficaria mais dificil o acesso ao teste o que acho que não seria produtivo, mas deixei isso como margem para uma ideia.

Levei em conta que não podem existir duas empresas com o mesmo: nome, código, cnpj ou email.
Para os colaboradores não podem existir dois colaboradores com o mesmo: código, cnpj ou email.

Outra coisa que coloquei é que não é possível cadasatrar o mesmo colaborador em duas empresas distintas.

Tentei deixar de forma mais completa, deixando com mais páginas, podendo reduzir o número de páginas e informações de acordo com o gosto da equipe.

Fiz com que caso você apague a empresa irá apagar também os colaboradores para que não ocupem espaço no banco de dados levando em conta que sem a empresa você não teria acesso aos colaboradores antes vinculados a ela.

Não deixei uma opção "apagar todas as empresas" pois acho isso muito perigoso, uma vez que isso feito apagaria também todos os colaboradores cadastrados.



# MongoDB

1 - Crie uma conta no MongoDB pelo link:
    https://www.mongodb.com/cloud/atlas

2 - Você pode utilizar uma versão gratuita e escolher o provedor e região de sua preferência

3 - Na finalização da criação da conta você irá criar um cluster (Você pode personalizar o nome do Cluster se você desejar)
    
2 - Com o Cluster criado vá na seção Security e seleciona "Database Access" depois selecione "MongoDB Users" e logo em seguida pressione "+ ADD NEW USER"

4 - Crie um usuário e senha (Não se esqueça dessas informações), em User Privileges selecione a opção "Atlas admin" e logo em seguida pressione "Add User"

5 - Em seguida vá na seção Security e seleciona "Network Access" depois selecione "IP Whitelist" e logo em seguida pressione "+ ADD IP ADRESS"

6 - Agora selecione a opção "ALLOW ACCESS FROM ANYWHERE", você pode colocar uma descrição em Comment se desejar e depois pressioanr "confirm"

7 - Feito isso vá na seção "Clusters" e no cluster criado pressione "CONNECT" após isso selecione "Connect Your Application"

8 - Agora em "Connection String Only" você pode copiar sua URL de conexão, você irá copiar ela alterando a parte "<password>" para a senha que você criou

9 - Com isso você irá utilizar sua URL para conectar o projeto com a base de dados no Mongo

    
    
    
# Vinculando ao Mongo

1 - Crie um arquivo com o nome .env na raiz do projeto

2 - Após criado arquivo escreva

3 - CONNECTIONSTRING=<SUA URL DE CONEXÃO>

4 - Após ter coloca sua url de conexão no local informado já estara vincualdo ao Mongo
    
5 - Você pode acessar e ver os dados enviado indo no seu clusters e depois Collections. 

    
    
# Instalar Projeto
    
1 - Baixe/clone o repositório
    
2 - Baixe e instale o NodeJS na sua máquina
    
3 - Instale o node no projeto abrindo o terminal e executando o comando:

    npm init -y
    npm i

4 - Inicie a aplicação abrindo o terminal e executando o comando: 
    
    npm start

5 - Acesse http://localhost:3000/

6 - Assim você poderá ver a aplicação
