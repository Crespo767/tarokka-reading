# A velha tenda de Madame Eva — 2.4.0

## Referência lida

Fonte local fornecida pelo usuário: `Curse of Strahd.md (referência local)`, área **G. Tser Pool Encampment**, a partir da linha 1791, especialmente **Madam Eva's Tent**, linha 1822.

O acampamento fica junto à Poça de Tser. A descrição apresenta uma tenda maior, de forma abatida, iluminada por dentro. No interior, chamas mágicas produzem um brilho avermelhado; há uma mesa baixa coberta de veludo preto e uma figura curvada. O texto também menciona uma bola de cristal e o baralho gasto de Eva.

Lona remendada, chão de terra, tapete esgarçado, bagagem, baú e barril são decisões de cenografia para concretizar o pedido de um acampamento medieval velho. Não são uma transcrição de um inventário de adereços do livro. A bola de cristal continua ausente da visão do jogador por solicitação expressa anterior.

## Reconstrução

- Paredes curvas e cobertura inclinada formam um volume de tenda, com entrada aberta e abas amarradas. Mastros e cordas sustentam visualmente a lona. O fundo de cortinas foi retirado.
- O chão é terra compactada com palha e um tapete velho. Baú, sacos e barril ficam nas laterais.
- A mesa baixa possui quatro pés abertos, encaixes e travessas. Carvalho áspero substitui a moldura polida e o latão; a toalha preta fica plana dentro do tampo, expondo a borda e a lateral de madeira, sem saia pendurada.
- Duas lamparinas de ferro, suspensas por correntes e com chama animada por shader e luz oscilante, substituem os braseiros da versão 2.3. A chama e a luz ficam estáveis com movimento reduzido. Esta escolha segue o pedido do usuário, em lugar das chamas mágicas da descrição do livro.
- Uma única pilha visível e um único corpo de colisão atendem a todas as cinco cartas, inclusive nas animações de recolhimento. As regras preservam três cartas comuns e duas altas.
- A câmera deixa os pés e o chão visíveis. Os novos testes projetam os pontos da mesa em janelas altas e largas para evitar que o enquadramento volte a esconder o apoio.
- Madame Eva usa uma nova pose sentada em cadeira velha, baseada na arte existente. Continua sendo uma personagem em 2,5D, sem esqueleto ou animação corporal tridimensional.
- A física das cartas foi mantida; o chão e os quatro pés também têm colisão. O módulo continua sem áudio e sem os painéis removidos da visão do jogador.
- Uma tela temporária de carregamento impede que os jogadores vejam os materiais ainda pretos ou as cartas sem imagem enquanto as texturas carregam.

## Verificação

Os 23 testes passaram, incluindo tecido plano, pilha única com colisão e atualização da chama/luz com respeito a movimento reduzido. A prévia foi conferida nas janelas alta e larga. Em sessão isolada, o mestre revelou as cinco cartas, com as mesmas cartas e profecias públicas no jogador e os segredos restritos ao mestre; depois, a nova leitura recolheu as cinco cartas à pilha e limpou a mesa de ambos os clientes. O console do jogador ficou sem erros ou avisos. A imagem atual da visão do jogador está em `docs/previews/tarokka-tent-v2.4.png`. A execução dentro do núcleo real do Foundry permanece pendente.

## Recursos finais

Todos foram criados com a ferramenta integrada `image_gen`, sem fallback CLI. O original de Madame Eva e os materiais anteriores foram preservados.

Na versão 2.9.0, essas fontes foram arquivadas em `backups/asset-sources/` e convertidas para WebP. As cartas e a personagem usam codificação sem perdas; os materiais são reduzidos à resolução que a cena já utilizava. Não foi gerada nova arte nessa otimização.

| Arquivo no projeto | Uso |
| --- | --- |
| `tarokka-reading/assets/madam-eva-seated.webp` | Madame Eva sentada, com transparência |
| `tarokka-reading/assets/materials/tent-canvas.webp` | Lona da cobertura e paredes |
| `tarokka-reading/assets/materials/packed-earth.webp` | Chão de terra |
| `tarokka-reading/assets/materials/aged-oak.webp` | Mesa, pés, mastros e móveis |
| `tarokka-reading/assets/materials/threadbare-rug.webp` | Tapete gasto com bordas transparentes |

### Prompts finais

**Madame Eva sentada — referência/edit target: `madam-eva-cutout.png`.**

> Use case: identity-preserve / pose edit. Edit target: supplied Madam Eva fantasy illustration. Make a full-body transparent-background game character sprite of THIS EXACT same very old hunched fortune teller, now clearly SEATED on a simple battered rustic low wooden chair, facing camera, stooping forward with age. Preserve exact deeply wrinkled narrow elderly face, crooked knowing grin, long nose, metallic coin headband, hood, hanging necklaces and weathered rust-brown robes. Identity is the top priority. Her body must be seated: pelvis on a low seat, knees bent at 90 degrees, feet and the worn hem of her skirt rest on ground. Chair back and all four short wooden legs visible at the edges. Her torso is bent forward attentively toward a low table that will be placed in front of her later. Both elbows low, hands near lap/table height, one hand holding one small tarokka card close to her chest, the other wrinkled hand resting gently on a knee. Do not raise arms theatrically. No table, no crystal ball, no scenery in the image. Painterly dark medieval gothic horror book illustration, muted faded ochre, browns and burnt russet, small warm reddish candle highlights on one side, deep soft shadows; reduce the original excessive fiery orange glow. She must be sinister, very aged and grave, not glamorous, not young, no glowing eyes. Include entire chair, seated body and feet with transparent margin. Actual alpha transparency; no floor, no halo, no text or UI.

**Lona.**

> Use case: stylized-concept. Asset type: seamless diffuse material texture, not a scene. Flat orthographic scan of very old weather-beaten medieval tent canvas, tightly woven coarse heavy linen and hemp, faded smoky ochre and umber, dirt and rain stains, irregular fraying fibers, a few unobtrusive patches crudely sewn with thread, subtle old faded rust red dye remnants. Restrained brown earthy palette, no rich purple, no theatrical pleats, no satin, no curtains. Perfectly uniform soft illumination, absolutely no cast shadows, no light source, no perspective, no objects, no words. Fine hand-painted realistic gothic fantasy game material in an old tabletop horror-book illustration style. Square edge-to-edge tileable texture, 1024x1024.

**Terra.**

> Use case: stylized-concept. Asset type: tileable terrain diffuse texture. Flat overhead scan of old muddy compacted earth underneath a medieval travelers' tent: dark desaturated gray-brown packed soil, irregular dry cracks, trampled dirt, scattered tiny dead straw fibers, grit, small pebbles, a few darker damp spots. Organic and uneven but flat enough to walk on. Photographic-level detail with painterly gothic horror fantasy material finish, no vegetation clumps, no grass field, no floorboards, no paving, no objects, no text. Fully even diffuse neutral lighting, no shadows, no perspective. Square seamless edge-to-edge 1024x1024 terrain material.

**Carvalho.**

> Use case: stylized-concept. Asset type: seamless diffuse wood texture. Flat directly overhead scan of very old rough-sawn oak planks from a humble medieval camp table. Gray-brown aged wood, deeply visible grain, rough worn edges between boards, shallow splits, old dark iron nail heads, knife scratches, dirt embedded in pores, matte weathered untreated surface. Very restrained desaturated earthy brown palette. Not polished, not varnished, no gold, no fine furniture, no decorative engraving. Fine painterly realistic gothic horror fantasy material. Even diffuse illumination, no directional shadows, no perspective, no objects, no labels. Square tileable edge-to-edge 1024x1024 texture.

**Tapete.**

> Use case: background-extraction / game prop material. A top-down orthographic cutout of one extremely old rectangular handwoven wool travel rug from a humble medieval gothic fantasy camp. Actual alpha-transparent background outside the rug, no floor. Landscape aspect ratio about 7:5. Very dark desaturated brown, charcoal, faded oxblood and dirty beige geometric motifs, small irregular diamond shapes, barely visible faded borders. Rug must look 100 years old: extensive worn thin threads, mud rubbed in, irregular frayed edges, a few small holes showing transparency, broken short fringe, patches of threadbare weave. Small folds at two corners but mostly flat. No bright reds, no shiny fabric, no luxurious clean Persian carpet, no text, no other objects, no perspective, no cast shadow, uniform diffuse lighting. Painterly realistic material to be used on a 3D ground mesh inside an old gothic horror tent.
