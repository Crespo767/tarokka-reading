# Mesa e física — versão 2.2.0

A versão 2.3.0 substitui o visual de nogueira polida e veludo bordô pela velha tenda descrita em [TENDA-EVA.md](TENDA-EVA.md). A documentação abaixo registra os recursos da versão anterior; a biblioteca de física permanece a mesma.

Na versão 2.9.0, as fontes PNG/JPG foram preservadas em `backups/asset-sources/`. O módulo instala somente as imagens WebP utilizadas pela cena. Consulte [PERFORMANCE.md](PERFORMANCE.md).

## Material da moldura

Arquivo final: `tarokka-reading/assets/materials/walnut.png`. Criado com a ferramenta integrada `image_gen`, sem fallback CLI, e aplicado à moldura e ao pedestal tridimensionais. A ferramenta produz a textura, não uma fotografia de uma mesa usada no lugar da geometria.

Prompt final:

> Use case: product-mockup. Asset type: seamless PBR base-color texture for an antique dark walnut wood table in a gothic realistic 3D game. Flat orthographic directly overhead scan of dark warm brown walnut hardwood boards, richly detailed elegant fine flowing walnut grain, discreet age scratches, subtle pores, natural color variation. Perfect even diffuse neutral lighting with absolutely no cast shadows, no highlights, no perspective, no objects, no borders, no text. Tileable continuous material edge to edge, square 1024x1024 texture, realistic photograph of actual wood grain. Medium dark brown rather than pure black, restrained and refined, do not add gold or ornament.

O veludo e o bordado usam texturas procedurais no canvas; a borda torneada e os castiçais são geometrias de revolução. A composição usa os mesmos arquivos na prévia e no Foundry.

## Simulação

O renderizador Three.js r128 é distribuído localmente em `tarokka-reading/scripts/lib/three.module.min.js`, acompanhado de sua [licença MIT](../tarokka-reading/scripts/lib/three.LICENSE).

[cannon-es 0.20.0](https://github.com/pmndrs/cannon-es) é distribuído localmente em `tarokka-reading/scripts/lib/cannon-es.js`, com sua [licença MIT](../tarokka-reading/scripts/lib/cannon-es.LICENSE). Não é carregado de CDN. As medições de mesa, cartas e adereços são compartilhadas entre o renderizador e a simulação.

A [documentação oficial](https://github.com/pmndrs/cannon-es/blob/master/getting-started.md) foi usada para conferir corpos rígidos, orientação do cilindro no eixo Y e passos fixos da simulação. O transporte das cartas é cinemático; a gravidade e os contatos físicos atuam no pouso. Objetos do cenário permanecem estáticos e bloqueiam as cartas.

Na visão do jogador não são construídos nem a malha nem os colliders da bola de cristal. No mestre, sua posição lateral não intersecta as cinco cartas.
