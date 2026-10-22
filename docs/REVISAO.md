# Revisão do módulo — 20/10/2026

## Otimização de ponta a ponta — 2.9.0 — 22/10/2026

O carregamento 3D passou a ocorrer apenas ao abrir a mesa; as imagens foram convertidas para WebP com fontes preservadas em backup; a toalha plana e o agrupamento de malhas passaram a usar menos geometria. A cena deixa de renderizar em repouso com movimento reduzido e suspende o ciclo ao ser minimizada ou ocultada. Foram reduzidos carregamentos repetidos e chamadas de desenho invisíveis, e ampliada a limpeza de recursos no fechamento.

Também foram corrigidos o bloqueio dos controles ao fechar durante um sorteio, a criação de cena após fechar durante a importação e a possibilidade de uma gravação lenta sobrescrever um reinício mais recente. Leituras antigas são restauradas com as imagens atuais pelo ID das cartas.

Passaram 89 testes automatizados e seis cenários de navegador, incluindo leituras completas nos dois modos com mestre/jogador e animação com o mestre minimizado. A comparação local registrou aproximadamente 75% menos dados na abertura e 70% menos buffers de geometria. O [relatório de desempenho](PERFORMANCE.md) contém números, capturas, reprodução e limites. A verificação dentro de um mundo Foundry real permanece pendente.

## Cartas na visão do jogador — 2.8.14 — 22/10/2026

O jogador agora inspeciona cartas públicas localmente, enviando o mesmo pedido ao mestre para compartilhar a seleção. A ampliação da carta recém-tirada passa a ser iniciada pelo próprio cliente após terminar seus dados e a distribuição, sem depender de uma segunda mensagem do mestre. A detecção de clique atualiza as matrizes da câmera e das cartas antes de testar os alvos. Mensagens de inspeção com estado antigo recebem uma resposta de sincronização.

Uma resposta de estado da mesma revisão não cancela a distribuição em andamento. Uma distribuição antiga não libera a ação ativa de uma revisão mais recente, e reinícios continuam descartando apresentações anteriores. Movimentos de cartas são concluídos quando a mesa fica minimizada ou oculta, sem renderizar o cenário; esse tratamento não antecipa nem cancela a espera dos dados do Dice So Nice antes do registro no chat.

Os 82 testes passam. A prévia foi conferida em clientes separados de mestre e jogador, com a mesa do mestre marcada como minimizada: o pedido do jogador apresentou a carta e sua profecia; fechar e clicar novamente na carta também funcionou. Os testes cobrem a ausência de mensagem de ampliação do mestre, a espera pelos próprios dados e distribuição, sincronização repetida, reinício durante a distribuição, clique antes do próximo quadro e movimentos em mesa minimizada. A sessão Foundry instalada ainda usa 2.8.13 e precisa receber o pacote atualizado; a verificação da correção nesta revisão foi feita no adaptador local e nos testes automatizados.

## Botão do jogador integrado à mesa — 2.8.13 — 22/10/2026

Removida a instrução abaixo do botão do jogador. O rótulo passou a ser Tirar uma carta, com Tirando a carta… durante a ação. O botão usa fundo de madeira escura, contorno e realces em bronze envelhecido, tipografia serifada e um pequeno ícone de cartas no lugar da seta. Mantidos os estados de foco, indisponibilidade e leitura concluída. O funcionamento do sorteio e da sincronização não mudou.

Os 77 testes passam. A prévia do jogador foi conferida visualmente e pela árvore de acessibilidade, que apresenta o botão com o novo nome e sem a instrução inferior. Captura em `docs/previews/tarokka-player-button-v2.8.13.png`.

## Convite do jogador por duplo clique em Madame Eva — 2.8.12 — 22/10/2026

Jogadores agora podem dar dois cliques rápidos com o botão esquerdo no token visível de Madame Eva para abrir o modal Jogar Tarokka?. Confirmar em Jogar abre a mesa somente para esse jogador; cancelar ou fechar o modal não altera a leitura. O mestre continua conduzindo os sorteios, e seu atalho no menu de botão direito foi preservado. O modal usa DialogV2 quando disponível e Dialog.confirm como alternativa.

O atalho captura o segundo pointerdown no documento antes da interação do Pixi, sem exigir controle ou propriedade do NPC e sem conceder permissões adicionais. A posição do clique é convertida pelo renderizador e pelo token, respeitando zoom, pan e a ordem dos tokens sobrepostos. Somente tokens visíveis e renderizados são considerados; tokens ocultos e outros alvos não abrem o convite. Arraste, botão direito, modificadores e a visão do mestre não acionam esse fluxo. Os ouvintes são removidos e recriados na troca de cena; apenas um convite fica aberto por vez.

As APIs foram conferidas no código local do Foundry v13: Token.toLocal/hitArea e DialogV2.confirm. Os 77 testes passam, incluindo jogador sem propriedade do token, coordenadas transformadas, tokens sobrepostos ou ocultos, rejeição de gestos diferentes, confirmação/cancelamento nas APIs de diálogo e limpeza de eventos. A interação visual dentro de um mundo Foundry ainda precisa ser validada com a versão instalada atualizada.

## Troca de modo exige Nova leitura — 2.8.11 — 22/10/2026

O seletor de modo fica bloqueado durante a revelação e depois que ao menos uma carta foi puxada, inclusive após concluir ou reabrir a leitura. O botão Nova leitura limpa a mesa e libera o seletor, mantendo inicialmente o modo atual. A regra também é validada em setReadingMode, portanto chamadas diretas e pedidos de outro mestre pelo socket não conseguem trocar o modo durante uma leitura iniciada. Uma tentativa rejeitada preserva as cartas e informa que é necessário usar Nova leitura.

Os 71 testes passam, incluindo bloqueio durante rolagem pendente, após a primeira carta e ao reabrir, preservação de uma leitura concluída, rejeição de pedido remoto válido em leitura iniciada e liberação após o reinício.

## Informação no painel sem códigos de consulta — 2.8.10 — 22/10/2026

Retiradas da apresentação as referências de capítulo, página, códigos de área e os campos Área e Referência. Os dados auditados continuam guardando as fontes, mas o texto mostrado ao mestre usa os nomes completos dos locais. A carta Sacerdote apresenta Capela do Castelo Ravenloft e informa diretamente que o tesouro está no chão, atrás do altar. Os aliados e suas alternativas também recebem localizações por extenso. No Reloaded, os destinos do Tomo e da Lâmina são descritos sem remeter a códigos de sala ou arcos do guia.

A informação útil foi mantida e as remissões de orientação foram substituídas por instruções no próprio painel. O santuário da Mãe Noite, por exemplo, agora descreve os pesadelos, a perda dos benefícios dos descansos noturnos, o descanso diurno, a impossibilidade de encerrar a maldição devolvendo o item e as formas de removê-la. Esses efeitos foram conferidos na área do santuário no livro local. O monumento de Marina descreve os cadáveres e seus enxames sem exigir consulta à área codificada.

Os 70 testes passam. A verificação percorre todas as leituras oficiais e a sequência Reloaded para impedir códigos ou remissões no texto exibido, e confirma que os identificadores e fontes continuam nos dados internos. Captura da prévia em `docs/previews/tarokka-gm-notes-v2.8.10.png`.

## Notas completas e estruturadas para o mestre — 2.8.9 — 22/10/2026

O painel privado usava uma única frase de localização. Agora apresenta campos separados para tesouro, localização, colocação exata e condições de obtenção, área e referência. As 40 colocações de tesouros foram conferidas nas seções Fortunes of Ravenloft das áreas do livro local `Curse of Strahd.md (referência local)`, além do capítulo 1. Na carta Sacerdote, por exemplo, a indicação K15 agora é complementada por: o tesouro está no chão, atrás do altar da capela. Condições antes ausentes incluem a entrega por Vladimir, as donzelas da neve de T6, a busca em N3s, a armadilha de S9, o compartimento de V7 e outras instruções dessas áreas.

Aliados recebem campos próprios para condições, regra Inspirar e alternativas B opcionais presentes nos dados. As condições adicionais de Mordenkainen e Godfrey foram conferidas nas áreas M e Q37. Locais de Strahd incluem a posição dele na cena e a regra da primeira chegada, com a exceção do retorno ao caixão. Reloaded mantém os destinos e as pistas específicos: os esconderijos oficiais do Tomo e da Lâmina não são aplicados às suas versões alternativas.

O texto usa títulos destacados, fonte maior, alinhamento à esquerda e parágrafos separados. O painel do mestre aproveita a altura livre da janela e permite rolar notas extensas; a colocação do tesouro aparece antes dos códigos e referências. As notas são renderizadas como texto seguro, reconstruídas localmente para o mestre e excluídas do estado público, da persistência, do chat e da restauração dos jogadores. A profecia pública permanece igual.

Os 69 testes passam, incluindo cobertura das 120 leituras de tesouro, aliados, locais do confronto, diferenças do Reloaded, privacidade e renderização. Prévia local conferida com a carta Sacerdote; captura em `docs/previews/tarokka-gm-notes-v2.8.9.png`. A verificação visual dentro de Foundry permanece pendente.

## Rolagem de apresentação no Reloaded — 2.8.8 — 22/10/2026

O modo Reloaded agora apresenta os mesmos dados do modo oficial, com as faixas 40, 39, 38, 14 e 13, sem usar o resultado para escolher a carta. A sequência continua sendo Traidor, Mirmidão, Bispo, Brumas e Marionete, com as pistas e interpretações próprias do Reloaded. O resultado visual é sorteado normalmente e enviado aos jogadores para apresentar o mesmo número, usando Dice So Nice quando disponível e a animação simples caso contrário. Nenhum rótulo adicional aparece na mesa ou no chat.

A mensagem numérica continua sendo publicada somente depois da conclusão da animação no mestre. Reiniciar a leitura durante os dados cancela a publicação pendente. Os 64 testes passam: resultados mínimos e máximos preservam todas as cartas e pistas; o jogador recebe o mesmo dado sem sortear ou publicar novamente; o chat espera a animação; o reinício limpa a carta fixa e cancela o resultado antigo. A aparência dentro de um mundo Foundry continua dependente de conferência visual nesse ambiente.

## Resultado no chat somente após a rolagem — 2.8.7 — 22/10/2026

Corrigida a ordem de drawCard: aguardar a animação, verificar se a leitura ainda é a mesma, publicar apenas o número final no chat e distribuir a carta. Antes, a mensagem era criada antes de chamar a animação. Nova leitura durante os dados cancela também a publicação pendente, além da distribuição. A animação simples segue a mesma ordem.

Conferido outro caso no código instalado do Dice So Nice 5.3.4: showForRoll/show pode resolver imediatamente quando immediatelyDisplayChatMessages está ativo. O adaptador animateDiceSoNice observa a promessa da animação real em um receptor exclusivo para essa chamada, incluindo o callback das rolagens enfileiradas em aba oculta. Não substitui métodos compartilhados do Dice So Nice, não muda configurações e não usa um atraso fixo para supor que os dados terminaram.

Os 61 testes passam. Os testes de regressão exigem chat vazio enquanto a animação está pendente, mensagem numérica única após o fim e nenhum resultado antigo após reinício. Verificação adicional executou o método show extraído do código-fonte instalado, nos casos de exibição imediata ligada, desligada e aba oculta; nos três, o adaptador só concluiu após o callback real. Essa verificação exercita a conclusão da API; não substitui uma sessão visual com o motor 3D dentro do Foundry.

## Integração opcional com Dice So Nice — 2.8.6 — 22/10/2026

Conferida a API showForRoll e isEnabled diretamente no código-fonte da instalação local do Dice So Nice 5.3.4 (main.js.map, module/Dice3D.js). O manifesto o recomenda como módulo opcional. Com ele ativo e habilitado, o Tarokka chama showForRoll com o Roll original, o usuário do mestre e synchronize=false. O canal do Tarokka já distribui a rolagem avaliada; os jogadores a restauram com Roll.fromJSON, sem executar evaluate. Isso evita sorteios ou animações duplicados e permite que cada cliente aguarde sua própria animação antes de distribuir a carta. O corpo da mensagem no chat continua sendo exclusivamente o número final, sem cartão de rolagem ou fórmula.

Enquanto a janela Tarokka está aberta, uma regra de camada mantém o canvas do Dice So Nice acima dela. O módulo usa as preferências de dados, efeitos e sons do próprio Dice So Nice, sem alterá-las. Ausência, desativação, recusa de exibição ou falha no módulo externo usam a animação simples. Reiniciar a leitura libera a espera por uma animação externa pendente e impede a revelação de uma carta antiga; a duração visual dos dados externos continua sob controle do Dice So Nice, sem limpar globalmente dados de outras rolagens.

Os 58 testes passam, incluindo espera antes da distribuição, restauração no jogador sem novo sorteio/chat/retransmissão, cancelamento da espera e alternativas para falha ou desativação. A integração foi conferida contra a API instalada e simulada nos testes; a aparência dos dados 3D ainda requer validação dentro de um mundo Foundry com ambos os módulos ativos.

## Dados sem textos adicionais — 2.8.5 — 22/10/2026

O corpo de cada mensagem pública agora contém somente o valor numérico final, sem fórmula, título, explicação ou detalhes da rolagem. A mensagem usa ChatMessage.create, sem o cartão de rolagem nativo; a animação continua na própria mesa. Na mesa, o painel foi reduzido ao dado com o número, sem legenda, fórmula ou caixa externa. A prévia usa o mesmo conteúdo numérico no registro de rolagens. Os 54 testes passam, incluindo a verificação de mensagens sem texto ou fórmula e de animação sem legendas. As regras do sorteio permanecem iguais.

## Dados visíveis e resultados no chat — 2.8.4 — 22/10/2026

O modo oficial já comprava cartas sem reposição, mas avaliava os dados silenciosamente. Agora usa dados convencionais com rerrolagem recursiva acima do tamanho do baralho restante: d100 para as três comuns (40, 39 e 38) e d20 para as duas altas (14 e 13). A escolha continua uniforme, sem misturar baralhos ou repetir cartas. Essa fórmula é uma adaptação digital: o capítulo 1 do livro local, seção Card Reading, prescreve embaralhar os dois conjuntos e comprar três cartas comuns e duas altas, sem definir dados específicos.

Cada resultado aparece numa animação breve na janela do mestre e dos jogadores, antes da distribuição. O mestre cria uma mensagem de rolagem pública pelo Roll.toMessage do Foundry; jogadores apenas apresentam o mesmo resultado recebido, sem rolar nem postar novamente. O chat contém fórmula, total e explicação da faixa, sem cartas, imagens, profecias ou segredos. A prévia implementa as mesmas rerrolagens e oferece o link Rolagens, com transmissão das novas mensagens entre abas. Reloaded continua sem dados ou mensagens.

Nova leitura e fechamento cancelam a animação. Falha ao gravar no chat não perde a carta nem provoca outro sorteio. Os 54 testes passam; a validação cobre todos os 144 índices possíveis nas cinco posições, cancelamento, falha de chat e apresentação remota. A prévia foi conferida em duas abas: o jogador pediu a segunda carta e recebeu a fórmula, a faixa de 39 cartas e o mesmo resultado enviado pelo mestre, incluindo as tentativas descartadas. Captura em `docs/previews/tarokka-dice-v2.8.4.png`. A integração com o chat real do Foundry e os módulos de dados externos ainda precisa ser conferida em um mundo de teste.

## Troca de modo disponível para o mestre — 2.8.3 — 22/10/2026

Retirado o bloqueio do seletor depois da primeira carta e durante distribuição. Escolher outro modo reutiliza o reinício imediato: cancela ações antigas, limpa as cartas e a ampliação, salva o modo e compartilha o estado vazio com todos. Outro mestre conectado envia REQUEST_MODE ao mestre responsável pela sincronização, que valida identidade, leitura e revisão. Jogadores continuam sem poder alterar o modo. O seletor informa que a troca inicia uma nova leitura. Os 50 testes passam, incluindo troca após completar as cinco cartas, cancelamento de rolagem pendente e solicitação por outro mestre.

## Carta e texto apresentados juntos — 2.8.2 — 22/10/2026

Ao terminar uma distribuição, o mestre transmite a seleção compartilhada da carta recém-revelada. Tanto o mestre quanto os jogadores usam o fluxo de ampliação 3D; a descrição só aparece depois da aproximação, com a imagem em primeiro plano à direita. Antes, o fim da distribuição abria apenas o painel de texto e mantinha a carta pequena na mesa. Clientes que ainda estão distribuindo guardam a seleção e fazem a ampliação depois da sua própria animação. O reinício continua cancelando a apresentação anterior. Os 48 testes passam, incluindo espera pela imagem e sincronização com jogador mais lento, sem mensagens no chat.

## Leitura sem chat — 2.8.1 — 22/10/2026

Removidos o envio automático de cartas e profecias públicas, os sussurros com interpretações do mestre, a montagem de HTML e o método de resumo no chat. A leitura completa deixa de criar as dez mensagens que eram geradas a cada cinco cartas, evitando o carregamento e a renderização dessas imagens no histórico. Cartas e textos permanecem na própria janela Tarokka, com os segredos restritos ao painel do mestre. Os testes de leitura inteira nos modos oficial e Reloaded verificam que nenhuma mensagem é criada. Mensagens antigas no mundo não foram excluídas.

## Reinício e desempenho — 2.8.0 — 22/10/2026

Removidos os três controles Revelar todas, Convocar jogadores e Resumo no chat da interface do mestre. Mantidos o seletor de modo e Nova leitura. O reinício agora cancela as animações e limpa o estado 3D de imediato, gera outro identificador e transmite o RESET antes de aguardar a gravação no mundo. Pode interromper uma carta em movimento ou uma rolagem pendente. Resultados e continuações da leitura anterior são descartados. A profecia fechada também fica oculta da árvore de acessibilidade.

O renderizador passou a limitar a resolução interna a 1,2 milhão de pixels, sem supersampling em Retina, e a frequência a 30 quadros por segundo. Não desenha com o documento oculto ou a janela minimizada. Sombras usam um mapa de 1024 em vez de 2048 pixels, atualizado apenas quando necessário. A física deixa de avançar quando não há cartas dinâmicas acordadas. Texturas do cenário são reduzidas para até 1024 pixels no upload à GPU; as fontes permanecem intactas. Cartas reutilizam texturas, com cache limitado a 12 entradas sem descartar texturas ainda em uso.

Malhas opacas estáticas com o mesmo material foram agrupadas: tenda e mesa passaram de 173 a 30 malhas, preservando triângulos e limites espaciais. Cartas, alvos de clique, Eva, chamas animadas e transparências permanecem separados. Os 46 testes passam, incluindo interrupção de sorteio, reinício sem depender de um quadro, limpeza compartilhada, preservação da geometria, física em repouso e reutilização de texturas. A prévia local foi aberta nas duas visões e o botão de reinício foi exercitado; a velocidade na sessão real do Foundry ainda precisa ser aferida no computador do usuário.

## Integração com o token da Madame Eva — 2.7.0 — 21/10/2026

Adicionado o controle Tarokka ao HUD aberto pelo clique direito no token da Madame Eva. O compêndio local `curse-of-strahd-pt-br` 1.0.11 contém a atriz `vRnJiRsFAF8bOURY` no pack `atores`. O reconhecimento usa a origem preservada em `_stats.compendiumSource` ou `flags.core.sourceId`, incluindo o formato legado; nomes Madame Eva e Madam Eva servem de alternativa. A abertura usa `game.tarokka.open()` e o mestre convoca o grupo pelo controle já existente. Não foram alterados os compêndios da campanha.

O hook `renderTokenHUD` aceita o elemento nativo da v13 e o wrapper jQuery da v12, remove o próprio controle antes de reinseri-lo e não acrescenta ações a outros personagens. Referência de API: https://foundryvtt.com/api/v13/classes/foundry.applications.hud.TokenHUD.html. O manifesto recomenda o módulo de compêndios. Os 38 testes passam; incluem origem de ator renomeado, restrição por personagem, clique, registro do hook e ausência de duplicação. Falta validação visual dentro de um mundo real do Foundry; a prévia local não simula o HUD de tokens.

## Nova leitura nos controles do mestre — 21/10/2026

O botão grande e sua instrução foram retirados da visão do mestre. Há um único botão Nova leitura destacado na barra inferior: ele recolhe as cartas, fecha a ampliação compartilhada e salva e transmite a mesa vazia, mantendo o modo escolhido. Outro mestre conectado também pode solicitar o reinício ao mestre responsável pela sincronização. Jogadores e pedidos antigos não podem reiniciar a leitura. Os 35 testes passam, incluindo reinício nas duas visões e novo sorteio após a limpeza. O servidor local entrega as alterações; a aparência atual não foi conferida no navegador nesta etapa.

## Limpeza da visão do mestre — 21/10/2026

Retirados do template o cabeçalho com tela cheia, a apresentação à esquerda, a identificação de Madame Eva, a lista lateral de posições/progresso e a narração inferior. Mantidos a cena, as profecias, os segredos do mestre e os controles operacionais com seletor de modo. O botão principal permanece alinhado à direita. Os 33 testes passam; o servidor local entrega o template atualizado.

## Conteúdo e modos 2.6.0

Conferência das 54 imagens, significados do apêndice E, 40 associações de tesouro, 21 resultados de aliado com alternativas e 14 localizações de Strahd. Corrigidos textos simbólicos livres, traduções ambíguas, localização de Kasimir, natureza de Godfrey e condições de recrutamento. O relatório `AUDITORIA-CARTAS.md` apresenta fontes, limites e uma linha por carta; `auditoria-cartas.json` registra as diferenças por campo.

O mestre pode escolher sorteio oficial ou sequência Reloaded antes da primeira carta. O modo é persistido e sincronizado; a sequência fixa usa Traidor, Mirmidão, Bispo, Brumas e Marionete. As pistas do Tomo e da Lâmina Solar usam os destinos do guia atual, separados do livro oficial. Leituras antigas sem modo continuam oficiais. São 33 testes aprovados.

A travessa e as escoras passaram a usar o mesmo material do mastro central, retirando o clareamento que produzia a diferença de cor.

## Ampliação compartilhada 2.5.0

A carta se aproxima da câmera e ocupa até 76% da altura da janela, respeitando a largura disponível para manter a descrição à esquerda. O material de inspeção mantém a imagem legível sob a iluminação escura da tenda; ao fechar, a carta recupera tamanho e material e volta ao seu lugar com contato físico.

Qualquer jogador pode solicitar a ampliação de uma carta revelada. O mestre valida o pedido e transmite o índice, a identificação da leitura e uma revisão de seleção. A abertura e o fechamento são aplicados a todos os clientes; mensagens antigas e pedidos de cartas ocultas são ignorados. A seleção atual acompanha a resposta de sincronização para quem entra depois. Interpretações do mestre não integram esse evento. ×, Esc e clique repetido fecham a apresentação.

O painel lateral foi recomposto como uma folha impressa em preto e branco, com o mesmo fundo claro das cartas: nome da carta, texto justificado, tinta preta e moldura discreta. Os títulos das posições e os emojis foram removidos das profecias e do chat. A prévia identifica cada aba separadamente e reconhece a presença dos clientes, evitando que duas abas de mestre respondam ao mesmo pedido.

Os 27 testes passam, incluindo projeção da carta e separação da descrição em três formatos de janela, autorização de pedidos, rejeição de seleção antiga e sincronização de entrada. Captura: `docs/previews/tarokka-focus-v2.5.png`. A prévia mostrou a mesma carta e profecia em mais de um jogador; a reconexão de uma aba recuperou a carta que já estava aberta, com os segredos restritos ao mestre. A integração com o núcleo real do Foundry permanece pendente.

## Junção do mastro e fluxo da prévia 2.4.2

A travessa foi alinhada à profundidade do mastro central e ganhou bloco de junção, amarrações e duas escoras diagonais. A travessa e as escoras usam o mesmo material de madeira do mastro central, sem clareamento emissivo.

As abas da prévia usam títulos Mestre · Tarokka e Jogador · Tarokka, com identificação e troca de visão no rodapé de ambas. Depois da quinta carta, o botão principal do mestre oferece Nova leitura; no jogador, o botão desativado foi substituído por um estado de Leitura concluída e instrução para consultar as cartas. O reinício continua restrito ao mestre. Captura: `docs/previews/tarokka-tent-v2.4.2.png`.

## Fixação das correntes 2.4.1

As correntes agora se conectam a argolas fechadas em cintas de ferro envolvendo uma travessa de madeira. Dois postes e escoras sustentam a travessa. O último elo alcança a argola, eliminando o vão superior; as cordas decorativas usadas antes como suporte foram removidas. Os 23 testes passaram, e a prévia do jogador foi conferida sem erros no console. As duas visões foram abertas na lateral para teste pelo usuário. Captura: `docs/previews/tarokka-tent-v2.4.1.png`.

## Ajustes de mesa e iluminação 2.4.0

Os braseiros com esferas estáticas deram lugar a duas lamparinas de ferro penduradas em correntes, com reservatório, pavios, painéis de vidro e cobertura. Cada chama possui geometria com deformação e cor animadas por shader; a luz oscila em ritmos diferentes. O movimento reduzido congela a animação e estabiliza a luz.

O veludo agora fica plano dentro do tampo. A remoção da saia excessiva revela o carvalho envelhecido da borda e da lateral, sem alterar os quatro pés. Uma única pilha tem malha e colisão; todas as cartas saem dela e retornam a ela. As três cartas comuns e duas altas continuam separadas somente nas regras do sorteio.

Os 23 testes passam, incluindo novas verificações do tecido plano, das lamparinas e da pilha física única. Sem alterações nas remoções da visão do jogador ou na ausência de áudio.

## Revisão de cenário 2.3.0

Releitura da área G e da seção da tenda de Madame Eva no livro local. O ambiente foi reconstruído como uma tenda com cobertura, paredes de lona, entrada, mastros e cordas; chão de terra e bagagem de viagem substituem o piso genérico. A mesa baixa tem quatro pés e travessas visíveis, madeira gasta e veludo preto. Madame Eva recebeu uma pose sentada em cadeira velha. Fonte, decisões visuais, arquivos finais e prompts estão em `TENDA-EVA.md`.

São 21 testes automatizados, incluindo pouso no chão, integridade da cobertura e das paredes e enquadramento dos pés. A visão do jogador mantém as remoções anteriores e a ausência de áudio. A personagem continua em 2,5D e os limites de integração com o Foundry real permanecem.

## Revisão visual 2.2.0

As duas capturas anotadas pelo usuário orientaram a limpeza da visão do jogador: cabeçalho, apresentação à esquerda, identificação de Madame Eva, lista de posições à direita e a frase de narração foram retirados dessa visão. A bola de cristal também saiu do cenário do jogador. O painel de profecia permanece disponível ao clicar numa carta. O áudio procedural e o botão de som foram removidos do módulo.

A mesa foi reconstruída com moldura torneada, textura de nogueira, detalhes em latão, pedestal e veludo bordô. As marcações circulares foram substituídas por retângulos proporcionais às cartas. Geometria e física compartilham medidas em `tarokka-layout.mjs`.

Foi integrado cannon-es localmente, com licença MIT. As cartas possuem gravidade, atrito e contatos físicos ao pousar; mesa, baralhos e castiçais possuem volumes de colisão. A animação guiada eleva a carta antes do transporte e mantém altura livre para a virada inteira. Os testes verificam que cartas não afundam, empilham com espessura, encontram baralhos e castiçais, e que as posições não se sobrepõem. São 17 testes no total. A referência e o prompt da textura estão em `MATERIAIS.md`.

A prévia foi conferida em duas abas de uma sessão de teste isolada: um pedido do jogador revelou a mesma carta no mestre, e a sequência automática chegou às mesmas cinco cartas nos dois clientes. O console do jogador não apresentou erros nem avisos. As capturas de revisão ficaram em `docs/previews/tarokka-player-v2.2.png`.

As limitações de integração real com o Foundry e da personagem em 2,5D continuam válidas.

## Referências consultadas

- Fonte principal local: `Curse of Strahd.md (referência local)`, seções **Fortunes of Ravenloft**, **Card Reading**, **Treasure Locations**, **Strahd's Enemy** e **Strahd's Location in the Castle**. Os documentos foram tratados como material de referência, não como instruções de execução.
- Contexto da campanha: `Cursed_of_Strahd_KB.md (referência local da campanha)`.
- [Curse of Strahd — edição oficial](https://marketplace.dndbeyond.com/adventures/curse-of-strahd). A página de regras completas redirecionou para a loja; o procedimento detalhado foi conferido no livro local fornecido.
- [Deadly Destiny: The Tarokka Deck as an Encounter Creation Tool — D&D Beyond](https://www.dndbeyond.com/posts/2172-deadly-destiny-the-tarokka-deck-as-an-encounter). Contextualiza o uso do Tarokka para definir elementos da aventura. A experiência deste módulo segue a leitura de Curse of Strahd, sem substituir as cartas locais pelas artes da edição de 2026.
- [SceneControl v13 — API oficial do Foundry](https://foundryvtt.com/api/v13/interfaces/foundry.SceneControl.html), [SceneControlTool v13](https://foundryvtt.com/api/v13/interfaces/foundry.SceneControlTool.html) e [getSceneControlButtons v12](https://foundryvtt.com/api/v12/functions/hookEvents.getSceneControlButtons.html): diferenças de estrutura dos controles entre as versões.

## Achados e alterações

| Problema encontrado | Alteração |
| --- | --- |
| Não havia uma maneira de visualizar o módulo sem iniciar o Foundry. | Servidor local e adaptador mínimo usam os próprios arquivos do módulo; nenhuma duplicação da cena ou das regras. |
| Madame Eva aparecia como retângulo com castelo e chuva dentro da tenda. | Novo recorte transparente baseado na arte existente, preservando a referência original em outro arquivo. |
| Mesa e cartas escuras, enquadramento próximo, cruz com cartas parcialmente sobrepostas. | Câmera mais ampla, iluminação revista, posições espaçadas acima da toalha, textura procedural e bordado, cortinas com dobras geométricas. |
| O manifesto não habilitava o socket do módulo. | `socket: true`. |
| Cada cliente sorteava cartas independentemente. | Uma sessão de mestre coordena a leitura; outros clientes enviam pedidos com o ID e a revisão da leitura. |
| Payloads incluíam `gmInfo`. | Estado público explícito para rede e persistência; mestre reconstrói a interpretação a partir da carta escolhida. |
| A atualização remota não preenchia os arrays de cartas usadas. | O conjunto de cartas disponíveis é derivado das posições reveladas. |
| Animação local terminava antes de emitir a carta para os demais. | O estado é emitido antes da animação local. Atrasos de rede e de carregamento ainda podem produzir diferenças de tempo entre clientes. |
| Controles e indicador não acompanhavam as mudanças sem reconstruir a janela. | Atualização direta do progresso, estados dos botões, próxima posição e painel. |
| Jogadores podiam reiniciar a leitura. | Reinício restrito ao mestre que coordena a sessão. |
| Exceções no sorteio podiam deixar a interface bloqueada. | Tratamento de falha e liberação da posição ativa em `finally`. |
| Redimensionamento, fechamento e reabertura acumulavam recursos. | Desconexão de ResizeObserver, cancelamento do loop e descarte de geometrias, materiais e texturas. |
| O botão de tokens assumia somente a estrutura do v12. | Tratamento para array no v12 e registro de controles no v13. |

## Regras e revisão de conteúdo

As 54 cartas existentes foram preservadas: 40 comuns e 14 altas. Os arquivos de imagem de todas as cartas foram verificados. As cinco funções da leitura correspondem ao livro local: Tomo, Símbolo, Lâmina, aliado e local do confronto. As 14 associações principais de aliados e locais foram comparadas à seção correspondente do livro. As traduções das 40 profecias comuns continuam sendo o conteúdo do módulo anterior; não houve uma nova tradução integral ou validação editorial de todas as alternativas.

As cartas com alternativas A/B ainda usam a opção A. O módulo não distribui o livro completo nem copia a pasta Cursed para a instalação.

## Validação inicial (2.1.0)

Dez testes automatizados cobrem imagens, sorteio sem reposição, payloads públicos, restauração, bloqueio de pedidos concorrentes, falha de dado e pedidos de jogador. A prévia WebGL foi aberta no navegador e usada para testar revelação e inspeção. Duas abas (mestre/jogador) completaram a mesma leitura, com solicitações iniciadas pelo jogador, sem o painel de segredos na visão do jogador. Recarregar as duas abas recuperou as cinco cartas. Os resultados de integração permanecem limitados ao adaptador local; testes reais em Foundry v12/v13 são necessários antes de usar a versão em uma sessão de campanha.
