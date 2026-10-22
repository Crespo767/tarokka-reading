# Auditoria das 54 cartas Tarokka

Revisão de 20/10/2026. Este documento contém informações reservadas ao mestre.

## Resultado

Conferidos os nomes e números das 54 imagens locais, os 54 significados simbólicos do apêndice E, as 40 associações de tesouro usadas nas três primeiras posições, os 21 resultados de aliado (14 principais e sete alternativas B) e os 14 resultados de localização de Strahd. São 75 resultados narrativos distintos; contando as três posições dos tesouros, 155 combinações de posição e leitura.

As associações principais de cartas com tesouros e salas já seguiam o capítulo 1. A revisão substituiu textos simbólicos livres por traduções do significado do apêndice E, corrigiu ambiguidades de tradução, completou as áreas e acrescentou condições de recrutamento ausentes. Os identificadores e as imagens foram preservados.

## Fontes e método

- Livro fornecido: `Curse of Strahd.md (referência local)`, capítulo 1, **Treasure Locations**, **Strahd’s Enemy**, **Strahd’s Location in the Castle**, pp. 12–18; apêndice E, pp. 243–244. Áreas específicas foram conferidas no corpo do livro.
- PDF em português fornecido: `1 - D&D 5E - Maldição de Strahd.pdf (referência local)`. É uma digitalização sem camada de texto; as páginas 13 e 244 foram renderizadas e consultadas para conferir terminologia. A comparação completa foi feita com o texto inglês do livro. Os textos do módulo são traduções revisadas, sem alegação de transcrição literal de uma edição brasileira.
- Reloaded local: `Curse-of-Strahd-Reloaded-PTBR (referência local)`, Arco C, C4f; Arco H, H8–H9; Arco S, S6c.
- [Reloaded atual — Arco C, C4f](https://github.com/DragnaCarta/Curse-of-Strahd-Reloaded/blob/main/Act%20I%20-%20Into%20the%20Mists/Arc%20C%20-%20Into%20the%20Valley.md), conferido no original inglês do autor em 20/10/2026. Os Arcos H e S atuais também foram consultados para confirmar os destinos das pistas.
- Não foram usados como referência de regra posts de terceiros, versões antigas do GM Binder nem o artigo sobre uso genérico do Tarokka para encontros.

Os resumos simbólicos descrevem o significado da carta, não literalmente sua ilustração. Traduções de nomes já em uso foram mantidas quando eram equivalentes válidos ao nome inglês impresso na imagem. O registro antes/depois de cada campo está em `auditoria-cartas.json`. A versão anterior dos dados está em `backups/content-review-2026-10-20/cards-before.json`.

## Correções de conteúdo

- Kasimir fica no acampamento fora de Vallaki (N9a), não na cidade.
- O Despedaçado aponta para a tumba de um único homem, Sergei (K85).
- O Espadachim descreve um guerreiro temível: refinamento do sentido de *deadly*, antes traduzido como “mortal”.
- A pista do Curandeiro descreve o espelho d’água de Krezk, não um lago de montanha.
- O sorriso de aniagem do espantalho substitui a tradução literal “sorriso de saco”.
- Godfrey é um revenant. A expressão poética “como um fantasma” na profecia permanece de acordo com o livro.
- Brumas, na quinta posição, permite escolher um local dentro do Castelo Ravenloft ou refazer apenas essa posição após pelo menos três dias.
- Condições de recrutamento de Donavich/Doru, Kasimir/Patrina, Ismark/Ireena, Davian/Urwin, Clovin/Abade/viola, Stella e outros foram acrescentadas à interpretação privada. A traição de Arrigal e a duração especial de Sir Klutz também foram registradas.
- O retrato de Tatyana em K37, a pista de Lazlo Ulrich em U2 e a observação de Eva sobre seu próprio acampamento foram incluídos nas notas do mestre.

A quinta carta indica o local onde os personagens encontram Strahd em sua primeira chegada, salvo se ele tiver sido forçado de volta ao caixão; não significa que permaneça imóvel ali durante toda a aventura.

## Os dois modos de leitura

| Posição | Carta no Reloaded | Livro oficial | Reloaded atual |
| --- | --- | --- | --- |
| Tomo | 9 de Glifos — Traidor | N4o, quarto principal de Wachterhaus | Leo Dilisnya; ritual de restauração de Stella no Plano Etéreo, N4t, Arco H H8–H9. A profecia também muda. |
| Símbolo Sagrado | 5 de Espadas — Mirmidão | Z7, santuário da Mãe Noite | A mesma pista, conforme a remissão do Arco C ao livro. |
| Lâmina Solar | 8 de Glifos — Bispo | X40, tesouraria selada | Semiplano dentro da prisão de Vampyr, acessível por X42. Patrina e a reativação da arma seguem o Arco S. A profecia muda e remete à casa do dragão caído. |
| Aliado | Brumas | Ezmerelda d’Avenir | A mesma pista, conforme a remissão do Arco C ao livro. |
| Strahd | Marionete | K60, pico da torre norte | O Arco C atual remete à leitura oficial, K60; não substituir pelo Coração da Tristeza de versões antigas. |

O seletor do mestre oferece **Oficial — sorteio** e **Reloaded — predeterminada**. Só pode ser alterado com a mesa vazia; **Nova leitura** recolhe as cartas e permite mudar o modo. O modo é salvo com a leitura e sincronizado. O sorteio oficial permanece sem reposição; o Reloaded usa a sequência fixa, sem rolar dados. Leituras antigas sem modo são tratadas como oficiais.

A posição da leitura continua oculta no painel de profecia e não há emojis. Pistas e interpretações seguem cada modo; não se mistura a pista oficial de Traidor/Bispo com seus destinos no Reloaded. As interpretações concretas continuam reservadas ao mestre.

O livro permite escolher A ou B em sete cartas de aliado. As duas alternativas foram revisadas e permanecem nos dados; esta versão continua utilizando A por padrão. O seletor de modo não é um editor de alternativas A/B nem de sequências personalizadas.

No livro oficial, o aliado destinado recebe a ação **Inspirar**: enquanto Strahd estiver à vista, concede inspiração a um personagem jogador que possa ver. Essa regra deve ser aplicada pelo mestre no sistema de combate, não pelo módulo de leitura.

## Verificação

33 testes automatizados aprovados, incluindo as 40 associações de tesouro e 14 localizações de Strahd, a sequência Reloaded, separação entre modos, restauração e exclusão dos segredos do mestre do estado público. A execução no núcleo real do Foundry continua pendente.

## Conferência carta a carta

| ID | Carta | Resultado oficial conferido | Significado e imagem |
| --- | --- | --- | --- |
| swords-1 | Vingador (Avenger) | Q36 | Apêndice E; imagem conferida |
| swords-2 | Paladino (Paladin) | K85 | Apêndice E; imagem conferida |
| swords-3 | Soldado (Soldier) | T6 | Apêndice E; imagem conferida |
| swords-4 | Mercenário (Mercenary) | K84/31 | Apêndice E; imagem conferida |
| swords-5 | Mirmidão (Myrmidon) | Z7 | Apêndice E; imagem conferida |
| swords-6 | Berserker (Berserker) | K84/38 | Apêndice E; imagem conferida |
| swords-7 | O Encapuzado (Hooded One) | X5a | Apêndice E; imagem conferida |
| swords-8 | Ditador (Dictator) | K25 | Apêndice E; imagem conferida |
| swords-9 | Torturador (Torturer) | N3s | Apêndice E; imagem conferida |
| swords-10 | Guerreiro (Warrior) | K86 | Apêndice E; imagem conferida |
| stars-1 | Transmutador (Transmuter) | K60 | Apêndice E; imagem conferida |
| stars-2 | Adivinho (Diviner) | G | Apêndice E; imagem conferida |
| stars-3 | Encantador (Enchanter) | U5 | Apêndice E; imagem conferida |
| stars-4 | Abjurador (Abjurer) | Q53 | Apêndice E; imagem conferida |
| stars-5 | Elementalista (Elementalist) | X20 | Apêndice E; imagem conferida |
| stars-6 | Evocador (Evoker) | K84/37 | Apêndice E; imagem conferida |
| stars-7 | Ilusionista (Illusionist) | N5 | Apêndice E; imagem conferida |
| stars-8 | Necromante (Necromancer) | K37 | Apêndice E; imagem conferida |
| stars-9 | Conjurador (Conjurer) | U3 | Apêndice E; imagem conferida |
| stars-10 | Mago (Wizard) | V7 | Apêndice E; imagem conferida |
| coins-1 | Espadachim (Swashbuckler) | K84/7 | Apêndice E; imagem conferida |
| coins-2 | Filantropo (Philanthropist) | S23 | Apêndice E; imagem conferida |
| coins-3 | Comerciante (Trader) | W10 | Apêndice E; imagem conferida |
| coins-4 | Mercador (Merchant) | K63 | Apêndice E; imagem conferida |
| coins-5 | Membro da Guilda (Guild Member) | K84/5 | Apêndice E; imagem conferida |
| coins-6 | Mendigo (Beggar) | N9a | Apêndice E; imagem conferida |
| coins-7 | Ladrão (Thief) | F | Apêndice E; imagem conferida |
| coins-8 | Coletor de Impostos (Tax Collector) | N9i | Apêndice E; imagem conferida |
| coins-9 | Avarento (Miser) | K41 | Apêndice E; imagem conferida |
| coins-10 | Ladino (Rogue) | N2q | Apêndice E; imagem conferida |
| glyphs-1 | Monge (Monk) | S13 | Apêndice E; imagem conferida |
| glyphs-2 | Missionário (Missionary) | S9 | Apêndice E; imagem conferida |
| glyphs-3 | Curandeiro (Healer) | S4 | Apêndice E; imagem conferida |
| glyphs-4 | Pastor (Shepherd) | K88 | Apêndice E; imagem conferida |
| glyphs-5 | Druida (Druid) | Y4 | Apêndice E; imagem conferida |
| glyphs-6 | Anarquista (Anarchist) | K67 | Apêndice E; imagem conferida |
| glyphs-7 | Charlatão (Charlatan) | O4 | Apêndice E; imagem conferida |
| glyphs-8 | Bispo (Bishop) | X40 | Apêndice E; imagem conferida |
| glyphs-9 | Traidor (Traitor) | N4o | Apêndice E; imagem conferida |
| glyphs-10 | Sacerdote (Priest) | K15 | Apêndice E; imagem conferida |
| high-1 | Artefato (Artifact) | Aliado: N2; Strahd: K15 | Apêndice E; imagem conferida |
| high-2 | Besta (Beast) | Aliado: Z7; Strahd: K25 | Apêndice E; imagem conferida |
| high-3 | O Despedaçado (Broken One) | Aliado: M; Strahd: K85 | Apêndice E; imagem conferida |
| high-4 | Lorde das Trevas (Darklord) | Aliado: Nenhuma; Strahd: K86 | Apêndice E; imagem conferida |
| high-5 | Masmorra (Donjon) | Aliado: N3t; Strahd: K67 | Apêndice E; imagem conferida |
| high-6 | Vidente (Seer) | Aliado: N9a; Strahd: K37 | Apêndice E; imagem conferida |
| high-7 | Fantasma (Ghost) | Aliado: Q37; Strahd: K88 | Apêndice E; imagem conferida |
| high-8 | Executor (Executioner) | Aliado: E2; Strahd: K6 | Apêndice E; imagem conferida |
| high-9 | Cavaleiro (Horseman) | Aliado: N4o; Strahd: K86 | Apêndice E; imagem conferida |
| high-10 | Inocente (Innocent) | Aliado: E1; Strahd: K85 | Apêndice E; imagem conferida |
| high-11 | Marionete (Marionette) | Aliado: K59; Strahd: K60 | Apêndice E; imagem conferida |
| high-12 | Brumas (Mists) | Aliado: S19; Strahd: Variável | Apêndice E; imagem conferida |
| high-13 | Corvo (Raven) | Aliado: W/N2; Strahd: K88 | Apêndice E; imagem conferida |
| high-14 | Tentador (Tempter) | Aliado: L; Strahd: K41 | Apêndice E; imagem conferida |
