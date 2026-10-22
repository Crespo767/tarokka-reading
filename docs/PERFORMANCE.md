# Revisão de desempenho — 2.9.0 — 22/10/2026

A revisão percorreu inicialização, abertura da mesa, carregamento das imagens, construção do cenário, sorteio, dados, distribuição, inspeção, sincronização, restauração, minimização e fechamento. Foram aplicadas as otimizações abaixo e verificadas as regras e a privacidade existentes.

## Comparação medida

Chrome em modo headless nesta máquina, janela de 1280 × 860, visão do mestre, leitura vazia e preferência de movimento reduzido. Cada execução usou um navegador novo e uma sessão isolada. MB representa 1.000.000 bytes.

| Medida | 2.8.14 | 2.9.0 | Diferença |
| --- | ---: | ---: | ---: |
| Recursos carregados na abertura | 20,98 MB | 5,33 MB | −74,6% |
| Imagens na abertura | 19,78 MB | 4,12 MB | −79,2% |
| Buffers de geometria, incluindo índices | 3,55 MB | 1,08 MB | −69,5% |
| Chamadas de desenho no quadro medido | 68 | 63 | −7,4% |
| Triângulos no quadro medido | 45.506 | 39.480 | −13,2% |
| Texturas presentes na GPU | 14 | 12 | −2 |
| Renderizações em um segundo de repouso, com movimento reduzido | 31 | 0 | Cena sob demanda |

O módulo instalado passou de aproximadamente 66,68 MB para 21,16 MB. O pacote ZIP passou de 64,98 MB para aproximadamente 20,25 MB. As 60 imagens utilizadas pela aplicação passaram de 57,18 MB de fontes para 19,95 MB de arquivos WebP.

Os recursos da abertura são a soma de `decodedBodySize` do Resource Timing; excluem o HTML principal. O servidor local não comprime as respostas. Buffers de geometria não representam toda a memória da GPU. A redução do ciclo em repouso se aplica a movimento reduzido; a cena animada continua limitada a aproximadamente 30 quadros por segundo. Não foi inferido ganho percentual de FPS nem de tempo de carregamento a partir de uma única amostra. `sampleEndMs` nos registros inclui a janela de observação de um segundo.

Registros: [antes](performance-before.json), [depois](performance-after.json). Capturas: [mesa anterior](previews/performance-before.png), [mesa otimizada](previews/performance-after.png), [inspeção do jogador](previews/performance-player.png).

## Alterações

- O controlador da aplicação deixou de importar o renderizador diretamente. Three.js, cannon-es e a construção da tenda são importados somente quando a mesa é aberta. Fechar durante essa importação cancela a criação da cena.
- As cartas e o verso usam WebP sem perdas, mantendo suas dimensões. A personagem usa WebP sem perdas após redução para a resolução que o renderizador já utilizava. Os materiais usam WebP com qualidade 90, também na resolução de execução já existente. Transparências foram preservadas. Todas as 60 imagens foram abertas e verificadas.
- As fontes PNG/JPG e as artes antigas ficam em `backups/asset-sources/`, fora do módulo instalável. `tools/optimize-assets.py` reproduz a conversão a partir dessas fontes. Há também um backup integral da versão 2.8.14.
- A toalha plana preserva seu contorno irregular com 128 triângulos, em vez de 6.144. O agrupamento das malhas estáticas preserva os índices e atributos, sem expandir todos os vértices para triângulos independentes. O descarte das geometrias substituídas usa uma única varredura final e respeita recursos compartilhados.
- A geometria agrupada respeita a transformação da cena, os atributos de cor, camadas, ordem de desenho, objetos ocultos e exclusões. Cartas, objetos transparentes, chamas e alvos interativos continuam separados.
- Os alvos invisíveis de clique deixaram de gerar chamadas de desenho. Movimentos do ponteiro são reunidos por quadro; o clique continua atualizando suas matrizes imediatamente.
- Imagens repetidas compartilham a origem decodificada e o redimensionamento dentro da cena, conservando texturas independentes quando os materiais precisam de coordenadas diferentes. Velas e lamparinas compartilham uma textura de brilho. Sincronizações enquanto uma carta carrega não acumulam callbacks duplicados.
- Com movimento reduzido, novos quadros são solicitados apenas quando há uma mudança. Ocultar a aba ou minimizar a mesa suspende o ciclo; retornar redesenha a cena. A conclusão das animações de cartas ocultas continua liberando o coordenador. A espera real do Dice So Nice foi preservada.
- Redimensionamentos com as mesmas medidas não recriam o buffer de desenho. O fechamento remove os observadores e eventos, cancela animações, esvazia os caches e libera os mapas de sombra e o contexto WebGL. O descarte pode ser chamado mais de uma vez.
- Fechar durante um sorteio libera os controles e ignora a rolagem antiga. As gravações de estado são ordenadas para impedir que uma gravação lenta de carta sobrescreva uma Nova leitura mais recente; a limpeza e a transmissão do reinício continuam imediatas.
- Leituras salvas com caminhos PNG antigos são reconstruídas pelo ID da carta e passam a usar os arquivos WebP locais.

## Validação

`npm run verify` concluiu **89 testes automatizados e seis cenários de navegador**. Os testes de regras e integração isolada incluem sorteio sem reposição, conteúdo das 54 cartas, dados, Dice So Nice, mensagens antigas, pedidos simultâneos, permissões e ausência de informações reservadas nos estados públicos.

No navegador, os cenários verificam:

1. Iniciar o módulo e criar seu controlador sem carregar as bibliotecas 3D.
2. Completar as cinco cartas nos modos Oficial e Reloaded entre mestre e jogador, consultar a profecia clicando na carta 3D, fechar, recarregar, restaurar a seleção e reiniciar.
3. Parar o desenho em repouso com movimento reduzido, respeitar o orçamento de carregamento, pausar ao minimizar, retomar e redimensionar.
4. Reiniciar durante a animação, fechar, reabrir e verificar a liberação de texturas, imagens e corpos físicos.
5. Completar uma animação com o mestre minimizado, preservando a apresentação e a profecia no jogador.
6. Fechar enquanto o renderizador ainda é importado, sem criar uma cena órfã, e abrir novamente.

As visões de mestre e jogador foram monitoradas para exceções, erros de console e respostas HTTP com erro. As capturas da mesa anterior e da otimizada foram inspecionadas; a aparência geral e a amostragem de cores do cenário foram mantidas. O ZIP tem sua integridade verificada pelo gerador.

## Limites e reprodução

Não havia servidor Foundry ativo nas portas locais verificadas. Os cenários de navegador usam o adaptador local, com os próprios scripts, imagens, template e estilos do módulo. A execução desta versão dentro de um mundo Foundry v12/v13, com sockets reais e Dice So Nice instalado, permanece pendente; os testes desse contrato usam simulações. A revisão não altera o alvo de compatibilidade do manifesto.

Para repetir a verificação: `npm install`, seguido de `npm run verify`, com Chrome instalado. Para medir, mantenha `npm run preview` aberto e execute `npm run measure -- current`. Para gerar o pacote, use `npm run build` com Python disponível. Pillow só é necessário para regenerar as imagens a partir das fontes.
