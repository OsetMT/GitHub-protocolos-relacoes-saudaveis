# Protocolos para Relações Saudáveis

Versão simplificada para teste no navegador, com identidade visual aprovada.

## Como abrir

1. Extraia a pasta `protocolos-relacoes-saudaveis`.
2. Abra a pasta no Visual Studio Code.
3. Abra `index.html` com a extensão **Live Server**.
4. O navegador abrirá o menu principal do aplicativo.

> Use um servidor local (como Live Server). Abrir o arquivo diretamente como `file://` pode impedir o carregamento de `data.json`.

## Navegação

- O menu principal apresenta as opções: Apresentação, seis protocolos, Considerações finais e Legislação e referências.
- Ao escolher uma opção, o aplicativo mostra somente a primeira tela/etapa daquele conteúdo.
- **Avançar** abre a próxima etapa; não há uma lista de todas as etapas aberta na tela.
- **Voltar** retorna à etapa anterior.
- **Menu inicial** retorna ao menu central a qualquer momento.
- A Apresentação também é percorrida uma seção por vez.
- Ao concluir um protocolo, é possível seguir para o próximo.

## Arquivos principais

- `index.html`: estrutura da aplicação.
- `styles.css`: identidade visual e layout responsivo.
- `app.js`: navegação sequencial entre telas e etapas.
- `data.json`: conteúdo organizado a partir da publicação SEDUC/MT.
- `assets/`: imagens de abertura, ícone e logo.

## Observação

Esta é uma versão web de teste. Antes da publicação, recomenda-se validar o conteúdo com a equipe responsável e preparar os recursos nativos do Android (ícone adaptativo e tela splash) no projeto Capacitor.
