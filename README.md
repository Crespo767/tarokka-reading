# Leitura Tarokka — Madame Eva

Módulo de Foundry VTT com mesa redonda em WebGL, cartas físicas animadas, velas, lamparinas, profecias em português e leitura compartilhada entre mestre e jogadores. A versão **2.9.0** otimiza o carregamento, as imagens, a geometria e o ciclo de renderização. Na prévia medida, a abertura passou de 20,98 MB para 5,33 MB de recursos e os buffers de geometria caíram 70%. Com movimento reduzido, a mesa parada deixa de renderizar; minimizar ou ocultar pausa o ciclo. As bibliotecas 3D só são carregadas ao abrir a mesa.

A revisão também corrige o bloqueio dos controles ao fechar durante um sorteio e cancela a criação da cena se a janela fechar durante o carregamento. A leitura continua oferecendo os modos Oficial e Reloaded, dados 3D, registro numérico no chat, convite pelo token e notas reservadas ao mestre. Consulte [o relatório de desempenho](docs/PERFORMANCE.md) para medições, alterações e limites da validação.

## Abrir a prévia

Na pasta deste projeto, execute `npm run preview` e abra <http://127.0.0.1:4173>. Requer Node.js 20.11 ou superior; não há dependências a instalar.

A prévia carrega os mesmos scripts, template, estilos e imagens do módulo. Você pode revelar as cinco cartas, clicar numa carta já revelada para aproximá-la, ampliá-la e consultar a profecia à sua esquerda. A seleção e o fechamento são compartilhados entre todos os clientes conectados; quem entra depois recebe a carta que estiver aberta. Feche pelo ×, com Esc ou clicando novamente na carta. O mestre reinicia pelo botão **Nova leitura**, que cancela ações pendentes e limpa todas as telas imediatamente. A barra do mestre contém apenas o seletor de modo e esse botão. O módulo não produz som nem música.

O jogador abre e fecha cartas já reveladas sem esperar a resposta do mestre; a seleção também é enviada ao mestre para os demais clientes. Cada cliente amplia a carta recém-tirada assim que termina seus próprios dados e sua distribuição. Uma resposta de sincronização da mesma revisão durante a apresentação não cancela o movimento. Movimentos de cartas em mesas minimizadas ou ocultas são concluídos sem renderização, para que não bloqueiem o coordenador; a espera real dos dados do Dice So Nice antes do chat continua preservada.

O mestre usa **Nova leitura** na barra inferior para recolher as cartas de todas as telas e recomeçar. Ao concluir as cinco cartas, o jogador vê **Leitura concluída** e pode selecionar as cartas para consultar a profecia. Na prévia, os títulos das abas e os links do rodapé identificam Mestre e Jogador.

A visão do jogador contém a cena, o botão **Tirar uma carta**, com acabamento escuro e contorno em bronze, e, ao selecionar uma carta, a sua profecia. O botão não tem instrução adicional abaixo. Cabeçalho, apresentação, identificação de Madame Eva, lista lateral e narração foram retirados das duas visões. O mestre mantém os controles de leitura e o seletor de modo; os controles de desenvolvimento do módulo ficam fora da visão do jogador; o rodapé de troca de visão existe somente na prévia local. A bola de cristal foi retirada da visão do jogador; no mestre, ela fica numa área lateral livre.

Para testar os jogadores, mantenha **uma aba de mestre** aberta e clique em **Abrir visão do jogador** no rodapé. As abas possuem identidades próprias e compartilham a leitura usando BroadcastChannel, inclusive com mais de um mestre aberto; a solicitação do jogador é atendida pela aba do mestre. Isso testa o fluxo local, sem substituir uma sessão real de Foundry. Não oferece acesso remoto para outros computadores. As cartas da prévia ficam salvas no localStorage do navegador e não alteram o mundo do Foundry.

## Usar no Foundry

**Link de instalação (Manifest URL):** [module.json — última versão estável](https://github.com/Crespo767/tarokka-reading/releases/latest/download/module.json)

```text
https://github.com/Crespo767/tarokka-reading/releases/latest/download/module.json
```

1. Na configuração inicial do Foundry, abra **Módulos adicionais → Instalar módulo**, cole o link acima no campo **Manifest URL / URL do manifesto** e clique em **Instalar**, conforme a [documentação do Foundry](https://foundryvtt.com/article/modules/).
2. Abra o mundo e ative este módulo. Para importar o ator, ative também **Curse of Strahd & Ravenloft | Compêndios PT-BR**, importe Madame Eva de **CoS & Ravenloft | Atores**, coloque seu token na cena, clique nele com o botão direito e escolha **Tarokka**.
3. Alternativamente, crie uma macro de script com `game.tarokka.open()`.
4. Para abrir para todos, uma macro pode usar `game.tarokka.openForAll()`.

Para instalação manual, baixe `tarokka-reading-2.9.0.zip` na [release v2.9.0](https://github.com/Crespo767/tarokka-reading/releases/tag/v2.9.0) e extraia a pasta `tarokka-reading` (a que contém `module.json`) em `Data/modules/`. Reinicie o Foundry e ative o módulo no mundo. O ZIP da release contém somente o módulo instalável; o código-fonte do repositório inclui também prévia, testes e documentação. O manifesto declara compatibilidade com Foundry v12/v13; a validação em um mundo real ainda está pendente.

O atalho reconhece a origem do ator `Compendium.curse-of-strahd-pt-br.atores.Actor.vRnJiRsFAF8bOURY`, mesmo após renomeá-lo. Também reconhece atores ou tokens chamados **Madame Eva** ou **Madam Eva**. O mestre usa o menu nativo do token, conforme as permissões do Foundry. Na visão do jogador, dois cliques rápidos com o botão esquerdo no token visível de Madame Eva abrem o modal **Jogar Tarokka?**. Escolha **Jogar** para abrir a mesa ou **Cancelar** para voltar à cena. Esse atalho funciona sem propriedade ou controle do NPC e não concede acesso à ficha nem a tokens ocultos. O atalho abre a mesa apenas para quem o utiliza. A ferramenta **Leitura Tarokka — Madame Eva** nos controles de tokens também continua disponível. A prévia de desenvolvimento na porta 4173 não contém o canvas de tokens do Foundry; esse convite é usado dentro do mundo Foundry.

O mestre conduz os sorteios. Jogadores podem solicitar a próxima carta. O primeiro mestre ativo, ordenado por ID, coordena a leitura para evitar sorteios concorrentes. Qualquer mestre conectado pode solicitar **Nova leitura**, com o reinício validado e compartilhado pelo mestre responsável pela sincronização. A limpeza não espera animações nem gravação no mundo; resultados de sorteios anteriores são ignorados após o reinício.

O mestre escolhe **Modo de leitura** no rodapé:

- **Oficial — sorteio:** três cartas do baralho comum e duas do alto, sem reposição.
- **Reloaded — predeterminada:** Traidor, Mirmidão, Bispo, Brumas e Marionete, com as pistas e interpretações da versão atual do guia de DragnaCarta. As pistas do Tomo e da Lâmina Solar são diferentes das do livro oficial.

A escolha fica salva com a leitura e é sincronizada para os jogadores. O modo só pode ser escolhido com a mesa vazia. Durante a revelação e após puxar a primeira carta, o seletor fica bloqueado, inclusive depois de concluir ou reabrir a leitura. Para escolher outro modo, use **Nova leitura** primeiro. A regra vale para qualquer mestre conectado, com validação também nos pedidos pela rede. O modo Reloaded também apresenta dados, com os mesmos tipos e faixas do modo oficial, mas o número é apenas visual e não altera a sequência predeterminada nem suas pistas. O livro oficial usa baralhos embaralhados, sem uma fórmula de dados obrigatória. Para simular essa compra com probabilidades iguais, o modo oficial usa `1d100rr>40`, `1d100rr>39`, `1d100rr>38`, `1d20rr>14` e `1d20rr>13`: resultados acima do número de cartas disponíveis são rolados novamente, e o total seleciona uma carta da lista restante. Não há reposição nem mistura dos baralhos. Uma animação breve mostra o resultado na janela de cada cliente, antes de distribuir a carta; Nova leitura cancela essa animação. Depois de concluir a animação no cliente do mestre, uma mensagem pública por carta mostra somente o valor numérico final no chat do Foundry, sem fórmula, título ou explicação. A espera acompanha a conclusão real dos dados mesmo com a exibição imediata do Dice So Nice ativada. Nova leitura durante a rolagem cancela a mensagem pendente. Com **Dice So Nice** ativo e habilitado, os dados usam a animação 3D dele sobre a janela Tarokka, com as preferências de aparência, efeitos e sons configuradas nesse módulo. Cada cliente apresenta o mesmo resultado já avaliado, sem novo sorteio, e espera sua animação antes de revelar a carta. Sem ele, ou caso a animação externa não esteja disponível, a mesa mostra o dado simples com o número, sem legendas ou caixa externa. Para usar a integração, ative os dois módulos no mundo e mantenha a exibição dos dados habilitada nas configurações do Dice So Nice. O Tarokka não inclui nem modifica os arquivos do Dice So Nice. Cartas, imagens, profecias e interpretações reservadas continuam fora do chat. Na prévia, o link **Rolagens** abre esse registro e as abas conectadas recebem as novas rolagens.

Na cena, os dois conjuntos usam a mesma pilha visível. As interpretações concretas aparecem apenas no painel do mestre, em campos separados: tesouro ou aliado, localização por extenso, colocação exata e condições. As informações necessárias ficam no próprio painel; capítulos, páginas e códigos de sala permanecem apenas nos dados internos de referência. Para o confronto, as notas também descrevem onde Strahd está e quando a previsão se aplica. Os textos privados usam fonte maior e rolagem para consultas extensas; o canal do módulo contém somente dados públicos e o estado salvo contém as cartas reveladas e suas profecias públicas. O estado é salvo no mundo e recuperado ao reabrir. A janela precisa estar aberta no cliente que conduz a leitura apenas para exibir a animação; pedidos também podem ser processados pela instância em memória.

## Visual e limites desta versão

A mesa, cartas, adereços, luzes e câmera são tridimensionais. A tenda possui cobertura inclinada, paredes curvas de lona remendada, mastros, cordas, chão de terra, tapete gasto e móveis de viagem. A mesa é baixa, de carvalho áspero, com quatro pés abertos e travessas visíveis; o veludo preto repousa plano sobre o tampo, deixando a borda de madeira envelhecida exposta. Duas lamparinas de ferro ficam suspensas por correntes presas a argolas e cintas de ferro em uma travessa de madeira apoiada em dois postes; suas chamas mudam de forma e luminosidade com o tempo. O modo de movimento reduzido mantém essa iluminação estável. Madame Eva aparece sentada em uma cadeira velha. As marcações das cinco posições são retangulares e proporcionais às cartas.

As cartas possuem corpos físicos com gravidade, atrito e colisão, simulados com cannon-es em passos fixos de 1/120 s. A mesa é um cilindro finito; seus quatro pés, o chão, a pilha de cartas e os castiçais são obstáculos estáticos. As dimensões de renderização e colisão vêm do mesmo arquivo de medidas. O transporte e a virada são guiados, com altura livre para a carta inteira; a etapa final do pouso usa a simulação física. A carta inspecionada se aproxima da câmera e ganha tamanho proporcional à janela, com material próprio para leitura nítida. A descrição fica à esquerda, sem cobrir a arte, em um bloco de papel branco e tinta preta, combinando com as cartas, com texto justificado e nome da carta sem emojis; o título da posição da leitura foi retirado das profecias. A seleção compartilhada é conduzida pelo mestre, que valida pedidos dos jogadores e transmite apenas o índice público da carta; o conteúdo reservado continua local. A interação disponível é revelar e inspecionar: não há arraste livre dos adereços nem replicação de uma simulação física arbitrária entre clientes. A leitura compartilhada continua sincronizando cartas e posições do ritual.

Madame Eva é uma ilustração recortada sobre um plano com movimento sutil: uma personagem em **2,5D**, baseada na arte fornecida. Ainda não é um modelo 3D com esqueleto, mãos articuladas ou sincronização labial.

O manifesto mantém o alvo Foundry v12/v13, e a ferramenta de tokens aceita as estruturas de controles das duas versões. A execução dentro de Foundry v12/v13 ainda precisa ser verificada em um mundo de teste; a prévia não inclui o núcleo do Foundry nem seus sockets reais. As leituras em português foram revisadas conforme o livro e, no modo correspondente, o Reloaded; o relatório registra as fontes e as correções. Cartas com alternativas A/B continuam usando a opção A; a seleção da alternativa pelo mestre ainda não tem interface. O áudio deve ser conduzido manualmente fora do módulo, conforme solicitado.

## Verificação e arquivos

- `npm test`: 89 testes de regras, dados, privacidade, sincronização, física, geometria e descarte de recursos.
- `npm run test:e2e`: seis cenários de navegador com Chrome, incluindo leitura completa nos dois modos, mestre e jogador, inspeção por clique na carta, recarga, reinício, minimização e fechamento durante o carregamento. Execute `npm install` antes; o Chrome deve estar instalado. A prévia é iniciada automaticamente se necessário.
- `npm run verify`: executa as duas suítes.
- `npm run build`: gera e verifica `build/tarokka-reading-2.9.0.zip`, copia o manifesto para `build/module.json` e gera `build/SHA256SUMS.txt` (requer Python).
- `npm run measure -- current`: mede a prévia já aberta na porta 4173 e salva números e captura em `docs/`.
- `python tools/optimize-assets.py`: reproduz a conversão das fontes arquivadas, com Pillow; não é necessário para executar ou instalar o módulo.
- `backups/tarokka-before-performance-2.8.14.zip`: módulo completo antes desta revisão; fontes de imagem em `backups/asset-sources/`.
- `backups/tarokka-original-2026-10-20.zip`: cópia anterior às alterações.
- `docs/REVISAO.md`: revisão técnica e referências da pesquisa.
- `docs/AUDITORIA-CARTAS.md`: conferência das 54 cartas, correções e comparação entre livro oficial e Reloaded.
- `docs/auditoria-cartas.json`: registro por carta e por campo, com o conteúdo anterior e revisado.
- `docs/MADAME-EVA.md`: origem da imagem e prompt usado no recorte.
- `docs/MATERIAIS.md`: materiais e licença da biblioteca de física.
- `docs/TENDA-EVA.md`: referência ao livro, decisões visuais e prompts dos cinco novos recursos da tenda.

O servidor de prévia atende somente a interface de loopback e deve ser encerrado com Ctrl+C no terminal em que foi iniciado.

Backups e fontes de imagem arquivadas são arquivos locais, fora do repositório e da release. As ferramentas de revisão histórica e de reconversão de imagens dependem desses arquivos; instalar, testar e empacotar a versão publicada usa os recursos WebP já incluídos.
