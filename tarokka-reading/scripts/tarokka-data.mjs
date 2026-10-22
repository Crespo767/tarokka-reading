/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║           BARALHO TAROKKA — DADOS COMPLETOS (54 Cartas)        ║
 * ║          Módulo Foundry VTT: Leitura Tarokka de Madame Eva     ║
 * ║                    A Maldição de Strahd (CoS)                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Estrutura do Baralho:
 *   - Baralho Comum (40 cartas): 4 naipes × 10 cartas
 *     Naipes: Espadas, Estrelas, Moedas, Glifos
 *     Cartas: 1 a 9 + Mestre (10)
 *   - Baralho Alto (14 cartas): Arquétipos maiores com símbolo de Coroa
 *
 * Leitura de 5 Cartas (A Cruz das Brumas):
 *   Posição 1 (Baralho Comum): O Tomo de Strahd
 *   Posição 2 (Baralho Comum): O Símbolo Sagrado de Ravenkind
 *   Posição 3 (Baralho Comum): A Lâmina Solar (Sunsword)
 *   Posição 4 (Baralho Alto):  O Inimigo de Strahd (Aliado Destinado)
 *   Posição 5 (Baralho Alto):  O Lorde das Trevas (Local no Castelo Ravenloft)
 */

// ─────────────────────────────────────────────────
// NAIPES DO BARALHO COMUM
// ─────────────────────────────────────────────────
export const SUITS = {
  swords: {
    id: 'swords',
    name: 'Espadas',
    nameEn: 'Swords',
    symbol: '⚔️',
    theme: 'Guerreiros — Conflito, violência, força marcial',
    color: '#c0392b'
  },
  stars: {
    id: 'stars',
    name: 'Estrelas',
    nameEn: 'Stars',
    symbol: '⭐',
    theme: 'Magos — O arcano, mistérios, sede de conhecimento',
    color: '#2980b9'
  },
  coins: {
    id: 'coins',
    name: 'Moedas',
    nameEn: 'Coins',
    symbol: '🪙',
    theme: 'Ladinos — Ganância, traição, sobrevivência prática',
    color: '#d4af37'
  },
  glyphs: {
    id: 'glyphs',
    name: 'Glifos',
    nameEn: 'Glyphs',
    symbol: '🔮',
    theme: 'Clérigos — Fé, espiritualidade, força interior',
    color: '#8e44ad'
  }
};

// ─────────────────────────────────────────────────
// BARALHO COMUM — 40 CARTAS
// ─────────────────────────────────────────────────
export const COMMON_DECK = [
  {
    "id": "swords-1",
    "suit": "swords",
    "number": 1,
    "image": "modules/tarokka-reading/assets/cards/common/swords-1.webp",
    "name": "Vingador",
    "nameEn": "Avenger",
    "flavor": "Justiça e vingança por grandes injustiças; a busca para livrar o mundo de um grande mal.",
    "readings": {
      "tome": {
        "prophecy": "O tesouro repousa na casa de um dragão, em mãos outrora limpas e agora corrompidas.",
        "location": "Vladimir Horngaard guarda o tesouro no Salão de Audiências do Dragão, em Argynvostholt (cap. 7, Q36).",
        "area": "Q36",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "O tesouro repousa na casa de um dragão, em mãos outrora limpas e agora corrompidas.",
        "location": "Vladimir Horngaard guarda o tesouro no Salão de Audiências do Dragão, em Argynvostholt (cap. 7, Q36).",
        "area": "Q36",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "O tesouro repousa na casa de um dragão, em mãos outrora limpas e agora corrompidas.",
        "location": "Vladimir Horngaard guarda o tesouro no Salão de Audiências do Dragão, em Argynvostholt (cap. 7, Q36).",
        "area": "Q36",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "swords-2",
    "suit": "swords",
    "number": 2,
    "image": "modules/tarokka-reading/assets/cards/common/swords-2.webp",
    "name": "Paladino",
    "nameEn": "Paladin",
    "flavor": "Guerreiros justos e nobres; honra e integridade guiadas por um código de conduta.",
    "readings": {
      "tome": {
        "prophecy": "Eu vejo um príncipe adormecido, um servo da luz e o irmão das trevas. O tesouro repousa com ele.",
        "location": "Tumba de Sergei, no Castelo Ravenloft (cap. 4, K85).",
        "area": "K85",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Eu vejo um príncipe adormecido, um servo da luz e o irmão das trevas. O tesouro repousa com ele.",
        "location": "Tumba de Sergei, no Castelo Ravenloft (cap. 4, K85).",
        "area": "K85",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Eu vejo um príncipe adormecido, um servo da luz e o irmão das trevas. O tesouro repousa com ele.",
        "location": "Tumba de Sergei, no Castelo Ravenloft (cap. 4, K85).",
        "area": "K85",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "swords-3",
    "suit": "swords",
    "number": 3,
    "image": "modules/tarokka-reading/assets/cards/common/swords-3.webp",
    "name": "Soldado",
    "nameEn": "Soldier",
    "flavor": "Guerra e sacrifício; resistência para suportar grandes provações.",
    "readings": {
      "tome": {
        "prophecy": "Vá para as montanhas. Escale a torre branca guardada por cavaleiros dourados.",
        "location": "Telhado da torre de guarda da Passagem de Tsolenka (cap. 9, T6).",
        "area": "T6",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Vá para as montanhas. Escale a torre branca guardada por cavaleiros dourados.",
        "location": "Telhado da torre de guarda da Passagem de Tsolenka (cap. 9, T6).",
        "area": "T6",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Vá para as montanhas. Escale a torre branca guardada por cavaleiros dourados.",
        "location": "Telhado da torre de guarda da Passagem de Tsolenka (cap. 9, T6).",
        "area": "T6",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "swords-4",
    "suit": "swords",
    "number": 4,
    "image": "modules/tarokka-reading/assets/cards/common/swords-4.webp",
    "name": "Mercenário",
    "nameEn": "Mercenary",
    "flavor": "Força interior e perseverança; aqueles que lutam por poder ou riqueza.",
    "readings": {
      "tome": {
        "prophecy": "A coisa que vocês buscam repousa com os mortos, sob montanhas de moedas de ouro.",
        "location": "Cripta 31 das catacumbas do Castelo Ravenloft (cap. 4, K84).",
        "area": "K84/31",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "A coisa que vocês buscam repousa com os mortos, sob montanhas de moedas de ouro.",
        "location": "Cripta 31 das catacumbas do Castelo Ravenloft (cap. 4, K84).",
        "area": "K84/31",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "A coisa que vocês buscam repousa com os mortos, sob montanhas de moedas de ouro.",
        "location": "Cripta 31 das catacumbas do Castelo Ravenloft (cap. 4, K84).",
        "area": "K84/31",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "swords-5",
    "suit": "swords",
    "number": 5,
    "image": "modules/tarokka-reading/assets/cards/common/swords-5.webp",
    "name": "Mirmidão",
    "nameEn": "Myrmidon",
    "flavor": "Grandes heróis; uma súbita reviravolta do destino; a vitória do mais fraco sobre um inimigo poderoso.",
    "readings": {
      "tome": {
        "prophecy": "Procure por um covil de lobos nas colinas com vista para um lago na montanha. O tesouro pertence à Mãe Noite.",
        "location": "Santuário da Mãe Noite, no Covil dos Lobisomens (cap. 15, Z7).",
        "area": "Z7",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Procure por um covil de lobos nas colinas com vista para um lago na montanha. O tesouro pertence à Mãe Noite.",
        "location": "Santuário da Mãe Noite, no Covil dos Lobisomens (cap. 15, Z7).",
        "area": "Z7",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Procure por um covil de lobos nas colinas com vista para um lago na montanha. O tesouro pertence à Mãe Noite.",
        "location": "Santuário da Mãe Noite, no Covil dos Lobisomens (cap. 15, Z7).",
        "area": "Z7",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "swords-6",
    "suit": "swords",
    "number": 6,
    "image": "modules/tarokka-reading/assets/cards/common/swords-6.webp",
    "name": "Berserker",
    "nameEn": "Berserker",
    "flavor": "A face brutal e bárbara da guerra; sede de sangue; uma natureza bestial.",
    "readings": {
      "tome": {
        "prophecy": "Encontre a cripta do Cão Louco. O tesouro repousa dentro, sob ossos enegrecidos.",
        "location": "Cripta do General Kroval “Cão Louco” Grislek, no Castelo Ravenloft (cap. 4, K84, cripta 38).",
        "area": "K84/38",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Encontre a cripta do Cão Louco. O tesouro repousa dentro, sob ossos enegrecidos.",
        "location": "Cripta do General Kroval “Cão Louco” Grislek, no Castelo Ravenloft (cap. 4, K84, cripta 38).",
        "area": "K84/38",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Encontre a cripta do Cão Louco. O tesouro repousa dentro, sob ossos enegrecidos.",
        "location": "Cripta do General Kroval “Cão Louco” Grislek, no Castelo Ravenloft (cap. 4, K84, cripta 38).",
        "area": "K84/38",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "swords-7",
    "suit": "swords",
    "number": 7,
    "image": "modules/tarokka-reading/assets/cards/common/swords-7.webp",
    "name": "O Encapuzado",
    "nameEn": "Hooded One",
    "flavor": "Fanatismo, intolerância e xenofobia; uma presença misteriosa ou alguém recém-chegado.",
    "readings": {
      "tome": {
        "prophecy": "Eu vejo um deus sem rosto. Ele aguarda vocês no final de uma estrada longa e sinuosa, no fundo das montanhas.",
        "location": "Dentro da cabeça da estátua gigante do Templo de Âmbar (cap. 13, X5a).",
        "area": "X5a",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Eu vejo um deus sem rosto. Ele aguarda vocês no final de uma estrada longa e sinuosa, no fundo das montanhas.",
        "location": "Dentro da cabeça da estátua gigante do Templo de Âmbar (cap. 13, X5a).",
        "area": "X5a",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Eu vejo um deus sem rosto. Ele aguarda vocês no final de uma estrada longa e sinuosa, no fundo das montanhas.",
        "location": "Dentro da cabeça da estátua gigante do Templo de Âmbar (cap. 13, X5a).",
        "area": "X5a",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "swords-8",
    "suit": "swords",
    "number": 8,
    "image": "modules/tarokka-reading/assets/cards/common/swords-8.webp",
    "name": "Ditador",
    "nameEn": "Dictator",
    "flavor": "Os males do governo e da liderança; aqueles que governam pelo medo e pela violência.",
    "readings": {
      "tome": {
        "prophecy": "Eu vejo um trono digno de um rei.",
        "location": "Salão de Audiências do Castelo Ravenloft (cap. 4, K25).",
        "area": "K25",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Eu vejo um trono digno de um rei.",
        "location": "Salão de Audiências do Castelo Ravenloft (cap. 4, K25).",
        "area": "K25",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Eu vejo um trono digno de um rei.",
        "location": "Salão de Audiências do Castelo Ravenloft (cap. 4, K25).",
        "area": "K25",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "swords-9",
    "suit": "swords",
    "number": 9,
    "image": "modules/tarokka-reading/assets/cards/common/swords-9.webp",
    "name": "Torturador",
    "nameEn": "Torturer",
    "flavor": "Sofrimento ou crueldade implacável por vir; maldade ou sadismo irredimíveis.",
    "readings": {
      "tome": {
        "prophecy": "Existe uma cidade onde nem tudo está bem. Lá vocês encontrarão uma casa de corrupção, e dentro, um quarto escuro cheio de fantasmas imóveis.",
        "location": "Depósito do sótão da mansão do burgomestre de Vallaki (cap. 5, N3s), não a oficina de Victor em N3t.",
        "area": "N3s",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Existe uma cidade onde nem tudo está bem. Lá vocês encontrarão uma casa de corrupção, e dentro, um quarto escuro cheio de fantasmas imóveis.",
        "location": "Depósito do sótão da mansão do burgomestre de Vallaki (cap. 5, N3s), não a oficina de Victor em N3t.",
        "area": "N3s",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Existe uma cidade onde nem tudo está bem. Lá vocês encontrarão uma casa de corrupção, e dentro, um quarto escuro cheio de fantasmas imóveis.",
        "location": "Depósito do sótão da mansão do burgomestre de Vallaki (cap. 5, N3s), não a oficina de Victor em N3t.",
        "area": "N3s",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "swords-10",
    "suit": "swords",
    "number": 10,
    "image": "modules/tarokka-reading/assets/cards/common/swords-10.webp",
    "name": "Guerreiro",
    "nameEn": "Warrior",
    "flavor": "Força e violência personificadas; aqueles que usam a força para atingir seus objetivos.",
    "readings": {
      "tome": {
        "prophecy": "Aquilo que vocês buscam repousa no ventre da escuridão, no covil do diabo: o único lugar para o qual ele deve retornar.",
        "location": "Tumba de Strahd, no Castelo Ravenloft (cap. 4, K86).",
        "area": "K86",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Aquilo que vocês buscam repousa no ventre da escuridão, no covil do diabo: o único lugar para o qual ele deve retornar.",
        "location": "Tumba de Strahd, no Castelo Ravenloft (cap. 4, K86).",
        "area": "K86",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Aquilo que vocês buscam repousa no ventre da escuridão, no covil do diabo: o único lugar para o qual ele deve retornar.",
        "location": "Tumba de Strahd, no Castelo Ravenloft (cap. 4, K86).",
        "area": "K86",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "stars-1",
    "suit": "stars",
    "number": 1,
    "image": "modules/tarokka-reading/assets/cards/common/stars-1.webp",
    "name": "Transmutador",
    "nameEn": "Transmuter",
    "flavor": "Uma nova descoberta; acontecimentos inesperados; consequências imprevistas e caos.",
    "readings": {
      "tome": {
        "prophecy": "Vá para um lugar de alturas estonteantes, onde a própria pedra está viva!",
        "location": "Pico da torre norte do Castelo Ravenloft (cap. 4, K60).",
        "area": "K60",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Vá para um lugar de alturas estonteantes, onde a própria pedra está viva!",
        "location": "Pico da torre norte do Castelo Ravenloft (cap. 4, K60).",
        "area": "K60",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Vá para um lugar de alturas estonteantes, onde a própria pedra está viva!",
        "location": "Pico da torre norte do Castelo Ravenloft (cap. 4, K60).",
        "area": "K60",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "stars-2",
    "suit": "stars",
    "number": 2,
    "image": "modules/tarokka-reading/assets/cards/common/stars-2.webp",
    "name": "Adivinho",
    "nameEn": "Diviner",
    "flavor": "Conhecimento temperado pela sabedoria; verdade, honestidade, sábios e profecia.",
    "readings": {
      "tome": {
        "prophecy": "Procure por aquela que tudo vê. O tesouro está escondido em seu acampamento.",
        "location": "Acampamento de Madame Eva na Poça de Tser (cap. 2, G). Se Eva conduz a leitura, acrescenta que o tesouro está debaixo de seu próprio nariz.",
        "area": "G",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Procure por aquela que tudo vê. O tesouro está escondido em seu acampamento.",
        "location": "Acampamento de Madame Eva na Poça de Tser (cap. 2, G). Se Eva conduz a leitura, acrescenta que o tesouro está debaixo de seu próprio nariz.",
        "area": "G",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Procure por aquela que tudo vê. O tesouro está escondido em seu acampamento.",
        "location": "Acampamento de Madame Eva na Poça de Tser (cap. 2, G). Se Eva conduz a leitura, acrescenta que o tesouro está debaixo de seu próprio nariz.",
        "area": "G",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "stars-3",
    "suit": "stars",
    "number": 3,
    "image": "modules/tarokka-reading/assets/cards/common/stars-3.webp",
    "name": "Encantador",
    "nameEn": "Enchanter",
    "flavor": "Conflito interior causado por confusão, medo do fracasso ou informações falsas.",
    "readings": {
      "tome": {
        "prophecy": "Eu vejo uma mulher ajoelhada - uma rosa de grande beleza arrancada cedo demais. O mestre do pântano sabe de quem falo.",
        "location": "Sob o monumento de Marina, em Berez (cap. 10, U5). O “mestre do pântano” é o fantasma do burgomestre Lazlo Ulrich em U2, que pode indicar o monumento.",
        "area": "U5",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Eu vejo uma mulher ajoelhada - uma rosa de grande beleza arrancada cedo demais. O mestre do pântano sabe de quem falo.",
        "location": "Sob o monumento de Marina, em Berez (cap. 10, U5). O “mestre do pântano” é o fantasma do burgomestre Lazlo Ulrich em U2, que pode indicar o monumento.",
        "area": "U5",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Eu vejo uma mulher ajoelhada - uma rosa de grande beleza arrancada cedo demais. O mestre do pântano sabe de quem falo.",
        "location": "Sob o monumento de Marina, em Berez (cap. 10, U5). O “mestre do pântano” é o fantasma do burgomestre Lazlo Ulrich em U2, que pode indicar o monumento.",
        "area": "U5",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "stars-4",
    "suit": "stars",
    "number": 4,
    "image": "modules/tarokka-reading/assets/cards/common/stars-4.webp",
    "name": "Abjurador",
    "nameEn": "Abjurer",
    "flavor": "Lógica e razão; um aviso sobre uma pista ou informação que passou despercebida.",
    "readings": {
      "tome": {
        "prophecy": "Eu vejo uma casa caída guardada por um grande dragão de pedra. Olhe para o pico mais alto.",
        "location": "Farol de Argynvostholt (cap. 7, Q53). O dragão de pedra da pista é a estátua de Q1.",
        "area": "Q53",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Eu vejo uma casa caída guardada por um grande dragão de pedra. Olhe para o pico mais alto.",
        "location": "Farol de Argynvostholt (cap. 7, Q53). O dragão de pedra da pista é a estátua de Q1.",
        "area": "Q53",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Eu vejo uma casa caída guardada por um grande dragão de pedra. Olhe para o pico mais alto.",
        "location": "Farol de Argynvostholt (cap. 7, Q53). O dragão de pedra da pista é a estátua de Q1.",
        "area": "Q53",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "stars-5",
    "suit": "stars",
    "number": 5,
    "image": "modules/tarokka-reading/assets/cards/common/stars-5.webp",
    "name": "Elementalista",
    "nameEn": "Elementalist",
    "flavor": "O triunfo da natureza sobre a civilização; desastres naturais e colheitas abundantes.",
    "readings": {
      "tome": {
        "prophecy": "O tesouro está escondido em um pequeno castelo debaixo de uma montanha, guardado por gigantes de âmbar.",
        "location": "Dentro da maquete do Castelo Ravenloft no Templo de Âmbar (cap. 13, X20).",
        "area": "X20",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "O tesouro está escondido em um pequeno castelo debaixo de uma montanha, guardado por gigantes de âmbar.",
        "location": "Dentro da maquete do Castelo Ravenloft no Templo de Âmbar (cap. 13, X20).",
        "area": "X20",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "O tesouro está escondido em um pequeno castelo debaixo de uma montanha, guardado por gigantes de âmbar.",
        "location": "Dentro da maquete do Castelo Ravenloft no Templo de Âmbar (cap. 13, X20).",
        "area": "X20",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "stars-6",
    "suit": "stars",
    "number": 6,
    "image": "modules/tarokka-reading/assets/cards/common/stars-6.webp",
    "name": "Evocador",
    "nameEn": "Evoker",
    "flavor": "Poder mágico ou sobrenatural incontrolável; magia usada para destruir.",
    "readings": {
      "tome": {
        "prophecy": "Busque a cripta de um mago comum. Seu cajado é a chave.",
        "location": "Cripta de Gralmore Nimblenobs no Castelo Ravenloft (cap. 4, K84, cripta 37).",
        "area": "K84/37",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Busque a cripta de um mago comum. Seu cajado é a chave.",
        "location": "Cripta de Gralmore Nimblenobs no Castelo Ravenloft (cap. 4, K84, cripta 37).",
        "area": "K84/37",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Busque a cripta de um mago comum. Seu cajado é a chave.",
        "location": "Cripta de Gralmore Nimblenobs no Castelo Ravenloft (cap. 4, K84, cripta 37).",
        "area": "K84/37",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "stars-7",
    "suit": "stars",
    "number": 7,
    "image": "modules/tarokka-reading/assets/cards/common/stars-7.webp",
    "name": "Ilusionista",
    "nameEn": "Illusionist",
    "flavor": "Mentiras e engano; grandes conspirações e sociedades secretas; um tolo enganado ou um sabotador.",
    "readings": {
      "tome": {
        "prophecy": "Um homem não é o que parece. Ele vem aqui em uma carroça de carnaval. Dentro repousa o que vocês buscam.",
        "location": "Carroça de Rictavio no pátio de estoque de Vallaki (cap. 5, N5).",
        "area": "N5",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Um homem não é o que parece. Ele vem aqui em uma carroça de carnaval. Dentro repousa o que vocês buscam.",
        "location": "Carroça de Rictavio no pátio de estoque de Vallaki (cap. 5, N5).",
        "area": "N5",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Um homem não é o que parece. Ele vem aqui em uma carroça de carnaval. Dentro repousa o que vocês buscam.",
        "location": "Carroça de Rictavio no pátio de estoque de Vallaki (cap. 5, N5).",
        "area": "N5",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "stars-8",
    "suit": "stars",
    "number": 8,
    "image": "modules/tarokka-reading/assets/cards/common/stars-8.webp",
    "name": "Necromante",
    "nameEn": "Necromancer",
    "flavor": "Acontecimentos antinaturais e obsessões nocivas; aqueles que seguem um caminho de destruição.",
    "readings": {
      "tome": {
        "prophecy": "Uma mulher está pendurada sobre um fogo ardente. Encontre-a, e vocês encontrarão o tesouro.",
        "location": "Escritório do Castelo Ravenloft (cap. 4, K37). A mulher da pista é o retrato de Tatyana sobre a lareira.",
        "area": "K37",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Uma mulher está pendurada sobre um fogo ardente. Encontre-a, e vocês encontrarão o tesouro.",
        "location": "Escritório do Castelo Ravenloft (cap. 4, K37). A mulher da pista é o retrato de Tatyana sobre a lareira.",
        "area": "K37",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Uma mulher está pendurada sobre um fogo ardente. Encontre-a, e vocês encontrarão o tesouro.",
        "location": "Escritório do Castelo Ravenloft (cap. 4, K37). A mulher da pista é o retrato de Tatyana sobre a lareira.",
        "area": "K37",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "stars-9",
    "suit": "stars",
    "number": 9,
    "image": "modules/tarokka-reading/assets/cards/common/stars-9.webp",
    "name": "Conjurador",
    "nameEn": "Conjurer",
    "flavor": "Uma ameaça sobrenatural inesperada que se aproxima; aqueles que se consideram deuses.",
    "readings": {
      "tome": {
        "prophecy": "Eu vejo uma vila morta, afogada por um rio, governada por alguém que trouxe um grande mal ao mundo.",
        "location": "Cabana de Baba Lysaga nas ruínas de Berez (cap. 10, U3).",
        "area": "U3",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Eu vejo uma vila morta, afogada por um rio, governada por alguém que trouxe um grande mal ao mundo.",
        "location": "Cabana de Baba Lysaga nas ruínas de Berez (cap. 10, U3).",
        "area": "U3",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Eu vejo uma vila morta, afogada por um rio, governada por alguém que trouxe um grande mal ao mundo.",
        "location": "Cabana de Baba Lysaga nas ruínas de Berez (cap. 10, U3).",
        "area": "U3",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "stars-10",
    "suit": "stars",
    "number": 10,
    "image": "modules/tarokka-reading/assets/cards/common/stars-10.webp",
    "name": "Mago",
    "nameEn": "Wizard",
    "flavor": "Mistérios, enigmas e o desconhecido; aqueles que anseiam por poder mágico e grande conhecimento.",
    "readings": {
      "tome": {
        "prophecy": "Procure por uma torre de mago em um lago. Deixe que o nome do mago e seu servo guiem vocês até o que buscam.",
        "location": "Quarto andar da Torre de Van Richten (cap. 11, V7).",
        "area": "V7",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Procure por uma torre de mago em um lago. Deixe que o nome do mago e seu servo guiem vocês até o que buscam.",
        "location": "Quarto andar da Torre de Van Richten (cap. 11, V7).",
        "area": "V7",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Procure por uma torre de mago em um lago. Deixe que o nome do mago e seu servo guiem vocês até o que buscam.",
        "location": "Quarto andar da Torre de Van Richten (cap. 11, V7).",
        "area": "V7",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "coins-1",
    "suit": "coins",
    "number": 1,
    "image": "modules/tarokka-reading/assets/cards/common/coins-1.webp",
    "name": "Espadachim",
    "nameEn": "Swashbuckler",
    "flavor": "Aqueles que gostam de dinheiro, mas o dão livremente; ladinos e patifes carismáticos.",
    "readings": {
      "tome": {
        "prophecy": "Eu vejo o esqueleto de um guerreiro temível, deitado sobre um leito de pedra ladeado por gárgulas.",
        "location": "Cripta de Endorovich no Castelo Ravenloft (cap. 4, K84, cripta 7).",
        "area": "K84/7",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Eu vejo o esqueleto de um guerreiro temível, deitado sobre um leito de pedra ladeado por gárgulas.",
        "location": "Cripta de Endorovich no Castelo Ravenloft (cap. 4, K84, cripta 7).",
        "area": "K84/7",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Eu vejo o esqueleto de um guerreiro temível, deitado sobre um leito de pedra ladeado por gárgulas.",
        "location": "Cripta de Endorovich no Castelo Ravenloft (cap. 4, K84, cripta 7).",
        "area": "K84/7",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "coins-2",
    "suit": "coins",
    "number": 2,
    "image": "modules/tarokka-reading/assets/cards/common/coins-2.webp",
    "name": "Filantropo",
    "nameEn": "Philanthropist",
    "flavor": "Caridade e generosidade em grande escala; riqueza usada para combater o mal e a doença.",
    "readings": {
      "tome": {
        "prophecy": "Procure em um lugar onde a doença e a loucura são criadas. Onde crianças outrora choraram, o tesouro repousa em silêncio.",
        "location": "Berçário da Abadia de Santa Markovia (cap. 8, S23).",
        "area": "S23",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Procure em um lugar onde a doença e a loucura são criadas. Onde crianças outrora choraram, o tesouro repousa em silêncio.",
        "location": "Berçário da Abadia de Santa Markovia (cap. 8, S23).",
        "area": "S23",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Procure em um lugar onde a doença e a loucura são criadas. Onde crianças outrora choraram, o tesouro repousa em silêncio.",
        "location": "Berçário da Abadia de Santa Markovia (cap. 8, S23).",
        "area": "S23",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "coins-3",
    "suit": "coins",
    "number": 3,
    "image": "modules/tarokka-reading/assets/cards/common/coins-3.webp",
    "name": "Comerciante",
    "nameEn": "Trader",
    "flavor": "Comércio, contrabando e mercados clandestinos; trocas justas e equilibradas.",
    "readings": {
      "tome": {
        "prophecy": "Olhe para o mago dos vinhos! Em madeira e areia o tesouro se esconde.",
        "location": "Oficina do soprador de vidro na Vinícola Mago dos Vinhos (cap. 12, W10).",
        "area": "W10",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Olhe para o mago dos vinhos! Em madeira e areia o tesouro se esconde.",
        "location": "Oficina do soprador de vidro na Vinícola Mago dos Vinhos (cap. 12, W10).",
        "area": "W10",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Olhe para o mago dos vinhos! Em madeira e areia o tesouro se esconde.",
        "location": "Oficina do soprador de vidro na Vinícola Mago dos Vinhos (cap. 12, W10).",
        "area": "W10",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "coins-4",
    "suit": "coins",
    "number": 4,
    "image": "modules/tarokka-reading/assets/cards/common/coins-4.webp",
    "name": "Mercador",
    "nameEn": "Merchant",
    "flavor": "Uma mercadoria rara ou oportunidade de negócio; transações enganosas ou perigosas.",
    "readings": {
      "tome": {
        "prophecy": "Busque um barril que outrora continha o melhor vinho, do qual nem uma gota resta.",
        "location": "Adega do Castelo Ravenloft (cap. 4, K63).",
        "area": "K63",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Busque um barril que outrora continha o melhor vinho, do qual nem uma gota resta.",
        "location": "Adega do Castelo Ravenloft (cap. 4, K63).",
        "area": "K63",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Busque um barril que outrora continha o melhor vinho, do qual nem uma gota resta.",
        "location": "Adega do Castelo Ravenloft (cap. 4, K63).",
        "area": "K63",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "coins-5",
    "suit": "coins",
    "number": 5,
    "image": "modules/tarokka-reading/assets/cards/common/coins-5.webp",
    "name": "Membro da Guilda",
    "nameEn": "Guild Member",
    "flavor": "Pessoas de ideias semelhantes unidas por um objetivo comum; orgulho no próprio trabalho.",
    "readings": {
      "tome": {
        "prophecy": "Eu vejo um quarto escuro cheio de garrafas. É a tumba de um membro da guilda.",
        "location": "Cripta de Artank Swilovich no Castelo Ravenloft (cap. 4, K84, cripta 5).",
        "area": "K84/5",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Eu vejo um quarto escuro cheio de garrafas. É a tumba de um membro da guilda.",
        "location": "Cripta de Artank Swilovich no Castelo Ravenloft (cap. 4, K84, cripta 5).",
        "area": "K84/5",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Eu vejo um quarto escuro cheio de garrafas. É a tumba de um membro da guilda.",
        "location": "Cripta de Artank Swilovich no Castelo Ravenloft (cap. 4, K84, cripta 5).",
        "area": "K84/5",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "coins-6",
    "suit": "coins",
    "number": 6,
    "image": "modules/tarokka-reading/assets/cards/common/coins-6.webp",
    "name": "Mendigo",
    "nameEn": "Beggar",
    "flavor": "Uma mudança repentina na condição econômica ou na fortuna.",
    "readings": {
      "tome": {
        "prophecy": "Um elfo ferido tem o que vocês buscam. Ele se separará do tesouro para ver seus sonhos sombrios realizados.",
        "location": "Casebre de Kasimir no acampamento Vistani e dos elfos do crepúsculo, fora de Vallaki (cap. 5, N9a), não dentro da cidade.",
        "area": "N9a",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Um elfo ferido tem o que vocês buscam. Ele se separará do tesouro para ver seus sonhos sombrios realizados.",
        "location": "Casebre de Kasimir no acampamento Vistani e dos elfos do crepúsculo, fora de Vallaki (cap. 5, N9a), não dentro da cidade.",
        "area": "N9a",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Um elfo ferido tem o que vocês buscam. Ele se separará do tesouro para ver seus sonhos sombrios realizados.",
        "location": "Casebre de Kasimir no acampamento Vistani e dos elfos do crepúsculo, fora de Vallaki (cap. 5, N9a), não dentro da cidade.",
        "area": "N9a",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "coins-7",
    "suit": "coins",
    "number": 7,
    "image": "modules/tarokka-reading/assets/cards/common/coins-7.webp",
    "name": "Ladrão",
    "nameEn": "Thief",
    "flavor": "Roubo e furto; perda de bens, beleza, inocência, amizade ou reputação.",
    "readings": {
      "tome": {
        "prophecy": "O que vocês buscam repousa na encruzilhada da vida e da morte, entre os mortos enterrados.",
        "location": "Enterrado no cemitério da Encruzilhada do Rio Ivlis (cap. 2, F).",
        "area": "F",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "O que vocês buscam repousa na encruzilhada da vida e da morte, entre os mortos enterrados.",
        "location": "Enterrado no cemitério da Encruzilhada do Rio Ivlis (cap. 2, F).",
        "area": "F",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "O que vocês buscam repousa na encruzilhada da vida e da morte, entre os mortos enterrados.",
        "location": "Enterrado no cemitério da Encruzilhada do Rio Ivlis (cap. 2, F).",
        "area": "F",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "coins-8",
    "suit": "coins",
    "number": 8,
    "image": "modules/tarokka-reading/assets/cards/common/coins-8.webp",
    "name": "Coletor de Impostos",
    "nameEn": "Tax Collector",
    "flavor": "Corrupção; honestidade em um governo ou organização corruptos.",
    "readings": {
      "tome": {
        "prophecy": "Os Vistani têm o que vocês buscam. Uma criança desaparecida guarda a chave para a liberação do tesouro.",
        "location": "Carroça de tesouros dos Vistani, fora de Vallaki (cap. 5, N9i). A criança desaparecida é Arabelle, no Lago Zarovich (cap. 2, L).",
        "area": "N9i",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Os Vistani têm o que vocês buscam. Uma criança desaparecida guarda a chave para a liberação do tesouro.",
        "location": "Carroça de tesouros dos Vistani, fora de Vallaki (cap. 5, N9i). A criança desaparecida é Arabelle, no Lago Zarovich (cap. 2, L).",
        "area": "N9i",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Os Vistani têm o que vocês buscam. Uma criança desaparecida guarda a chave para a liberação do tesouro.",
        "location": "Carroça de tesouros dos Vistani, fora de Vallaki (cap. 5, N9i). A criança desaparecida é Arabelle, no Lago Zarovich (cap. 2, L).",
        "area": "N9i",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "coins-9",
    "suit": "coins",
    "number": 9,
    "image": "modules/tarokka-reading/assets/cards/common/coins-9.webp",
    "name": "Avarento",
    "nameEn": "Miser",
    "flavor": "Riqueza acumulada; infelicidade irreversível ou a crença de que o dinheiro não tem sentido.",
    "readings": {
      "tome": {
        "prophecy": "Procure por uma fortaleza dentro de uma fortaleza, em um lugar escondido atrás do fogo.",
        "location": "Tesouraria do Castelo Ravenloft (cap. 4, K41).",
        "area": "K41",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Procure por uma fortaleza dentro de uma fortaleza, em um lugar escondido atrás do fogo.",
        "location": "Tesouraria do Castelo Ravenloft (cap. 4, K41).",
        "area": "K41",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Procure por uma fortaleza dentro de uma fortaleza, em um lugar escondido atrás do fogo.",
        "location": "Tesouraria do Castelo Ravenloft (cap. 4, K41).",
        "area": "K41",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "coins-10",
    "suit": "coins",
    "number": 10,
    "image": "modules/tarokka-reading/assets/cards/common/coins-10.webp",
    "name": "Ladino",
    "nameEn": "Rogue",
    "flavor": "Aqueles para quem o dinheiro importa; a crença de que a riqueza é a chave do sucesso.",
    "readings": {
      "tome": {
        "prophecy": "Eu vejo um ninho de corvos. Lá vocês encontrarão o prêmio.",
        "location": "Sótão da Pousada Água Azul, em Vallaki (cap. 5, N2q).",
        "area": "N2q",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Eu vejo um ninho de corvos. Lá vocês encontrarão o prêmio.",
        "location": "Sótão da Pousada Água Azul, em Vallaki (cap. 5, N2q).",
        "area": "N2q",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Eu vejo um ninho de corvos. Lá vocês encontrarão o prêmio.",
        "location": "Sótão da Pousada Água Azul, em Vallaki (cap. 5, N2q).",
        "area": "N2q",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "glyphs-1",
    "suit": "glyphs",
    "number": 1,
    "image": "modules/tarokka-reading/assets/cards/common/glyphs-1.webp",
    "name": "Monge",
    "nameEn": "Monk",
    "flavor": "Serenidade, força interior e autoconfiança; segurança plena sem arrogância.",
    "readings": {
      "tome": {
        "prophecy": "O tesouro que vocês buscam está escondido atrás do sol, na casa de um santo.",
        "location": "Salão principal da Abadia de Santa Markovia (cap. 8, S13).",
        "area": "S13",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "O tesouro que vocês buscam está escondido atrás do sol, na casa de um santo.",
        "location": "Salão principal da Abadia de Santa Markovia (cap. 8, S13).",
        "area": "S13",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "O tesouro que vocês buscam está escondido atrás do sol, na casa de um santo.",
        "location": "Salão principal da Abadia de Santa Markovia (cap. 8, S13).",
        "area": "S13",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "glyphs-2",
    "suit": "glyphs",
    "number": 2,
    "image": "modules/tarokka-reading/assets/cards/common/glyphs-2.webp",
    "name": "Missionário",
    "nameEn": "Missionary",
    "flavor": "Aqueles que espalham sabedoria e fé; um aviso sobre a propagação do medo e da ignorância.",
    "readings": {
      "tome": {
        "prophecy": "Eu vejo um jardim coberto de neve, vigiado por um espantalho com um sorriso de aniagem. Não olhem para o jardim, mas para o guardião.",
        "location": "Dentro de um dos espantalhos do jardim da Abadia de Santa Markovia (cap. 8, S9).",
        "area": "S9",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Eu vejo um jardim coberto de neve, vigiado por um espantalho com um sorriso de aniagem. Não olhem para o jardim, mas para o guardião.",
        "location": "Dentro de um dos espantalhos do jardim da Abadia de Santa Markovia (cap. 8, S9).",
        "area": "S9",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Eu vejo um jardim coberto de neve, vigiado por um espantalho com um sorriso de aniagem. Não olhem para o jardim, mas para o guardião.",
        "location": "Dentro de um dos espantalhos do jardim da Abadia de Santa Markovia (cap. 8, S9).",
        "area": "S9",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "glyphs-3",
    "suit": "glyphs",
    "number": 3,
    "image": "modules/tarokka-reading/assets/cards/common/glyphs-3.webp",
    "name": "Curandeiro",
    "nameEn": "Healer",
    "flavor": "Cura; doença ou maldição contagiosa; aqueles que praticam as artes de curar.",
    "readings": {
      "tome": {
        "prophecy": "Olhem para o oeste. Encontrem um espelho d’água abençoado pela luz do sol branco.",
        "location": "Sob o gazebo do Santuário do Sol Branco, junto ao espelho d’água de Krezk (cap. 8, S4).",
        "area": "S4",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Olhem para o oeste. Encontrem um espelho d’água abençoado pela luz do sol branco.",
        "location": "Sob o gazebo do Santuário do Sol Branco, junto ao espelho d’água de Krezk (cap. 8, S4).",
        "area": "S4",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Olhem para o oeste. Encontrem um espelho d’água abençoado pela luz do sol branco.",
        "location": "Sob o gazebo do Santuário do Sol Branco, junto ao espelho d’água de Krezk (cap. 8, S4).",
        "area": "S4",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "glyphs-4",
    "suit": "glyphs",
    "number": 4,
    "image": "modules/tarokka-reading/assets/cards/common/glyphs-4.webp",
    "name": "Pastor",
    "nameEn": "Shepherd",
    "flavor": "Aqueles que protegem os outros; alguém que carrega um fardo grande demais para suportar sozinho.",
    "readings": {
      "tome": {
        "prophecy": "Encontre a mãe - ela que deu à luz o mal.",
        "location": "Tumba do Rei Barov e da Rainha Ravenovia, no Castelo Ravenloft (cap. 4, K88).",
        "area": "K88",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Encontre a mãe - ela que deu à luz o mal.",
        "location": "Tumba do Rei Barov e da Rainha Ravenovia, no Castelo Ravenloft (cap. 4, K88).",
        "area": "K88",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Encontre a mãe - ela que deu à luz o mal.",
        "location": "Tumba do Rei Barov e da Rainha Ravenovia, no Castelo Ravenloft (cap. 4, K88).",
        "area": "K88",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "glyphs-5",
    "suit": "glyphs",
    "number": 5,
    "image": "modules/tarokka-reading/assets/cards/common/glyphs-5.webp",
    "name": "Druida",
    "nameEn": "Druid",
    "flavor": "A ambivalência e a crueldade da natureza e daqueles que se sentem atraídos por ela; conflito interior.",
    "readings": {
      "tome": {
        "prophecy": "Uma árvore maligna cresce no topo de uma colina de túmulos onde os antigos mortos dormem. Os corvos podem ajudar a encontrá-la. Procure pelo tesouro lá.",
        "location": "Base da árvore Gulthias, na Colina de Yester (cap. 14, Y4). Homens-corvo encontrados na natureza podem guiar o grupo até lá.",
        "area": "Y4",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Uma árvore maligna cresce no topo de uma colina de túmulos onde os antigos mortos dormem. Os corvos podem ajudar a encontrá-la. Procure pelo tesouro lá.",
        "location": "Base da árvore Gulthias, na Colina de Yester (cap. 14, Y4). Homens-corvo encontrados na natureza podem guiar o grupo até lá.",
        "area": "Y4",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Uma árvore maligna cresce no topo de uma colina de túmulos onde os antigos mortos dormem. Os corvos podem ajudar a encontrá-la. Procure pelo tesouro lá.",
        "location": "Base da árvore Gulthias, na Colina de Yester (cap. 14, Y4). Homens-corvo encontrados na natureza podem guiar o grupo até lá.",
        "area": "Y4",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "glyphs-6",
    "suit": "glyphs",
    "number": 6,
    "image": "modules/tarokka-reading/assets/cards/common/glyphs-6.webp",
    "name": "Anarquista",
    "nameEn": "Anarchist",
    "flavor": "Uma mudança fundamental provocada por alguém cujas crenças estão sendo postas à prova.",
    "readings": {
      "tome": {
        "prophecy": "Eu vejo paredes de ossos, um lustre de ossos e uma mesa de ossos - tudo o que resta de inimigos há muito esquecidos.",
        "location": "Salão dos Ossos do Castelo Ravenloft (cap. 4, K67).",
        "area": "K67",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Eu vejo paredes de ossos, um lustre de ossos e uma mesa de ossos - tudo o que resta de inimigos há muito esquecidos.",
        "location": "Salão dos Ossos do Castelo Ravenloft (cap. 4, K67).",
        "area": "K67",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Eu vejo paredes de ossos, um lustre de ossos e uma mesa de ossos - tudo o que resta de inimigos há muito esquecidos.",
        "location": "Salão dos Ossos do Castelo Ravenloft (cap. 4, K67).",
        "area": "K67",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "glyphs-7",
    "suit": "glyphs",
    "number": 7,
    "image": "modules/tarokka-reading/assets/cards/common/glyphs-7.webp",
    "name": "Charlatão",
    "nameEn": "Charlatan",
    "flavor": "Mentirosos; aqueles que professam uma crença, mas na verdade seguem outra.",
    "readings": {
      "tome": {
        "prophecy": "Eu vejo um moinho solitário em um precipício. O tesouro repousa lá dentro.",
        "location": "Sótão do Velho Moinho de Ossos (cap. 6, O4).",
        "area": "O4",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Eu vejo um moinho solitário em um precipício. O tesouro repousa lá dentro.",
        "location": "Sótão do Velho Moinho de Ossos (cap. 6, O4).",
        "area": "O4",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Eu vejo um moinho solitário em um precipício. O tesouro repousa lá dentro.",
        "location": "Sótão do Velho Moinho de Ossos (cap. 6, O4).",
        "area": "O4",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "glyphs-8",
    "suit": "glyphs",
    "number": 8,
    "image": "modules/tarokka-reading/assets/cards/common/glyphs-8.webp",
    "name": "Bispo",
    "nameEn": "Bishop",
    "flavor": "Adesão rigorosa a um código ou crença; aqueles que tramam, planejam e conspiram.",
    "readings": {
      "tome": {
        "prophecy": "O que vocês buscam repousa em uma pilha de tesouros, além de um par de portas de âmbar.",
        "location": "Tesouraria selada do Templo de Âmbar (cap. 13, X40). Esta é a leitura oficial; a Lâmina Solar no Reloaded usa outra pista e X42.",
        "area": "X40",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "O que vocês buscam repousa em uma pilha de tesouros, além de um par de portas de âmbar.",
        "location": "Tesouraria selada do Templo de Âmbar (cap. 13, X40). Esta é a leitura oficial; a Lâmina Solar no Reloaded usa outra pista e X42.",
        "area": "X40",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "O que vocês buscam repousa em uma pilha de tesouros, além de um par de portas de âmbar.",
        "location": "Tesouraria selada do Templo de Âmbar (cap. 13, X40). Esta é a leitura oficial; a Lâmina Solar no Reloaded usa outra pista e X42.",
        "area": "X40",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "glyphs-9",
    "suit": "glyphs",
    "number": 9,
    "image": "modules/tarokka-reading/assets/cards/common/glyphs-9.webp",
    "name": "Traidor",
    "nameEn": "Traitor",
    "flavor": "Traição por alguém próximo e confiável; enfraquecimento ou perda da fé.",
    "readings": {
      "tome": {
        "prophecy": "Procure por uma mulher rica. Uma aliada leal do diabo, ela mantém o tesouro sob sete chaves, com os ossos de um antigo inimigo.",
        "location": "Quarto principal de Wachterhaus, em Vallaki (cap. 5, N4o). Esta é a leitura oficial; o Tomo no Reloaded está com Leo Dilisnya.",
        "area": "N4o",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Procure por uma mulher rica. Uma aliada leal do diabo, ela mantém o tesouro sob sete chaves, com os ossos de um antigo inimigo.",
        "location": "Quarto principal de Wachterhaus, em Vallaki (cap. 5, N4o). Esta é a leitura oficial; o Tomo no Reloaded está com Leo Dilisnya.",
        "area": "N4o",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Procure por uma mulher rica. Uma aliada leal do diabo, ela mantém o tesouro sob sete chaves, com os ossos de um antigo inimigo.",
        "location": "Quarto principal de Wachterhaus, em Vallaki (cap. 5, N4o). Esta é a leitura oficial; o Tomo no Reloaded está com Leo Dilisnya.",
        "area": "N4o",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "glyphs-10",
    "suit": "glyphs",
    "number": 10,
    "image": "modules/tarokka-reading/assets/cards/common/glyphs-10.webp",
    "name": "Sacerdote",
    "nameEn": "Priest",
    "flavor": "Iluminação; devoção a uma divindade, a valores ou a um propósito superior.",
    "readings": {
      "tome": {
        "prophecy": "Vocês encontrarão o que buscam no castelo, em meio às ruínas de um lugar de súplica.",
        "location": "Capela do Castelo Ravenloft (cap. 4, K15).",
        "area": "K15",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "symbol": {
        "prophecy": "Vocês encontrarão o que buscam no castelo, em meio às ruínas de um lugar de súplica.",
        "location": "Capela do Castelo Ravenloft (cap. 4, K15).",
        "area": "K15",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      },
      "sword": {
        "prophecy": "Vocês encontrarão o que buscam no castelo, em meio às ruínas de um lugar de súplica.",
        "location": "Capela do Castelo Ravenloft (cap. 4, K15).",
        "area": "K15",
        "reference": "Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  }
];

export const HIGH_DECK = [
  {
    "id": "high-1",
    "number": 1,
    "image": "modules/tarokka-reading/assets/cards/high/high-1.webp",
    "name": "Artefato",
    "nameEn": "Artifact",
    "symbol": "👑",
    "flavor": "Um objeto que precisa ser obtido, protegido ou destruído a qualquer custo.",
    "readings": {
      "ally": {
        "prophecy": "Procure por um homem divertido com um macaco. Este homem é mais do que aparenta.",
        "npc": "Rictavio - Rudolph van Richten",
        "description": "Rictavio é Rudolph van Richten disfarçado, na Pousada Água Azul (N2). Ao ouvir a leitura, revela sua identidade e aceita acompanhar o grupo. Blinsky e seu macaco são uma pista falsa; Blinsky indica Rictavio.",
        "area": "N2",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Enemy, pp. 15–17"
      },
      "location": {
        "prophecy": "Ele espreita na escuridão onde a luz da manhã outrora brilhou - um lugar sagrado.",
        "place": "A Capela (Castelo Ravenloft, K15).",
        "room": "K15",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Location in the Castle, pp. 17–18"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "high-2",
    "number": 2,
    "image": "modules/tarokka-reading/assets/cards/high/high-2.webp",
    "name": "Besta",
    "nameEn": "Beast",
    "symbol": "👑",
    "flavor": "Grande fúria ou paixão; algo bestial ou maligno escondido à vista de todos ou logo abaixo da superfície.",
    "readings": {
      "ally": {
        "prophecy": "Uma lobisomem guarda um ódio secreto por seu inimigo. Use o ódio dela a seu favor.",
        "npc": "Zuleika Toranescu",
        "description": "Zuleika Toranescu está no santuário da Mãe Noite (Z7). Acompanha o grupo se prometerem vingar seu companheiro Emil, matando Kiril Stoyanovich.",
        "area": "Z7",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Enemy, pp. 15–17"
      },
      "location": {
        "prophecy": "A besta senta em seu trono sombrio.",
        "place": "O Salão de Audiências (Castelo Ravenloft, K25).",
        "room": "K25",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Location in the Castle, pp. 17–18"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "high-3",
    "number": 3,
    "image": "modules/tarokka-reading/assets/cards/high/high-3.webp",
    "name": "O Despedaçado",
    "nameEn": "Broken One",
    "symbol": "👑",
    "flavor": "Derrota, fracasso e desespero; a perda de algo ou alguém sem o qual a pessoa se sente incompleta.",
    "readings": {
      "ally": {
        "prophecy": "Seu maior aliado será um mago. Sua mente está quebrada, mas seus feitiços são fortes.",
        "npc": "O Mago Louco do Monte Baratok",
        "description": "O Mago Louco do Monte Baratok (área M). É preciso lidar com a loucura e a desconfiança dele conforme a seção do encontro; a carta não o apresenta como aliado já recuperado.",
        "prophecyAlt": "Eu vejo um homem de fé cuja sanidade está por um fio. Ele perdeu alguém próximo a ele.",
        "npcAlt": "Donavich",
        "descriptionAlt": "Donavich é o sacerdote da vila de Barovia (E5). Só acompanha o grupo depois que Doru estiver morto e enterrado.",
        "area": "M",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Enemy, pp. 15–17",
        "areaAlt": "E5"
      },
      "location": {
        "prophecy": "Ele assombra a tumba do homem que invejava acima de todos.",
        "place": "A tumba de Sergei (Castelo Ravenloft, K85).",
        "room": "K85",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Location in the Castle, pp. 17–18"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "high-4",
    "number": 4,
    "image": "modules/tarokka-reading/assets/cards/high/high-4.webp",
    "name": "Lorde das Trevas",
    "nameEn": "Darklord",
    "symbol": "👑",
    "flavor": "Uma pessoa poderosa e maligna, cujos objetivos têm consequências vastas e duradouras.",
    "readings": {
      "ally": {
        "prophecy": "Ah, a pior de todas as verdades: Vocês devem enfrentar o mal desta terra sozinhos!",
        "npc": "Nenhum aliado",
        "description": "Não há aliado destinado que receba a ação Inspirar por esta leitura. Isso não impede outras alianças normais durante a campanha.",
        "area": "Nenhuma",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Enemy, pp. 15–17"
      },
      "location": {
        "prophecy": "Ele espreita nas profundezas da escuridão, no único lugar para o qual ele deve retornar.",
        "place": "A tumba de Strahd (Castelo Ravenloft, K86).",
        "room": "K86",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Location in the Castle, pp. 17–18"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "high-5",
    "number": 5,
    "image": "modules/tarokka-reading/assets/cards/high/high-5.webp",
    "name": "Masmorra",
    "nameEn": "Donjon",
    "symbol": "👑",
    "flavor": "Isolamento e aprisionamento; alguém tão preso às próprias ideias que se torna prisioneiro de suas crenças.",
    "readings": {
      "ally": {
        "prophecy": "Procure por um jovem perturbado cercado por riqueza e loucura. Sua casa é sua prisão.",
        "npc": "Victor Vallakovich",
        "description": "Victor Vallakovich está em sua oficina no sótão (N3t). Ao perceber que o grupo pode libertá-lo de sua situação, deixa a casa e acompanha os personagens a Ravenloft.",
        "prophecyAlt": "Encontre uma garota levada à insanidade, trancada no coração da casa de seu pai morto. Curar sua loucura é a chave para o sucesso de vocês.",
        "npcAlt": "Stella Wachter",
        "descriptionAlt": "Stella Wachter está em N4n. Não concede benefício enquanto sua loucura não for curada; recuperada, aceita deixar a família e acompanhar o grupo.",
        "area": "N3t",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Enemy, pp. 15–17",
        "areaAlt": "N4n"
      },
      "location": {
        "prophecy": "Ele espreita em um salão de ossos, nos poços escuros de seu castelo.",
        "place": "O Salão dos Ossos (Castelo Ravenloft, K67).",
        "room": "K67",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Location in the Castle, pp. 17–18"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "high-6",
    "number": 6,
    "image": "modules/tarokka-reading/assets/cards/high/high-6.webp",
    "name": "Vidente",
    "nameEn": "Seer",
    "symbol": "👑",
    "flavor": "Inspiração e intelecto aguçado; um acontecimento futuro cujo desfecho dependerá de uma mente perspicaz.",
    "readings": {
      "ally": {
        "prophecy": "Procure por um elfo crepuscular vivendo entre os Vistani. Ele sofreu uma grande perda e é assombrado por sonhos sombrios. Ajude-o, e ele os ajudará em retorno.",
        "npc": "Kasimir Velikov",
        "description": "Kasimir Velikov vive no acampamento dos elfos do crepúsculo (N9a). Só acompanha o grupo a Ravenloft depois que o levam ao Templo de Âmbar e o ajudam a obter os meios para ressuscitar Patrina Velikovna.",
        "area": "N9a",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Enemy, pp. 15–17"
      },
      "location": {
        "prophecy": "Ele espera por vocês em um lugar de sabedoria, calor e desespero. Grandes segredos estão lá.",
        "place": "O Estudo (Castelo Ravenloft, K37).",
        "room": "K37",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Location in the Castle, pp. 17–18"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "high-7",
    "number": 7,
    "image": "modules/tarokka-reading/assets/cards/high/high-7.webp",
    "name": "Fantasma",
    "nameEn": "Ghost",
    "symbol": "👑",
    "flavor": "O passado que se aproxima; o retorno de um antigo inimigo ou a descoberta de um segredo há muito enterrado.",
    "readings": {
      "ally": {
        "prophecy": "Eu vejo um paladino caído de uma ordem caída de cavaleiros. Ele permanece como um fantasma no covil de um dragão morto.",
        "npc": "Sir Godfrey Gwilym",
        "description": "Sir Godfrey Gwilym é um revenant, não um fantasma, em Argynvostholt (Q37). Aceita acompanhar o grupo se o convencerem de que sua ajuda pode restaurar a honra da Ordem do Dragão de Prata: Carisma (Persuasão) CD 15.",
        "prophecyAlt": "Desperte o espírito do cavaleiro desajeitado cuja cripta repousa nas profundezas do castelo.",
        "npcAlt": "Sir Klutz",
        "descriptionAlt": "Sir Klutz, guerreiro fantasma da cripta 33 (K84). Como aliado destinado, permanece até que ele ou Strahd chegue a 0 PV, em vez de desaparecer após sete dias.",
        "area": "Q37",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Enemy, pp. 15–17",
        "areaAlt": "K84/33"
      },
      "location": {
        "prophecy": "Olhe para a tumba do pai.",
        "place": "Tumba do Rei Barov e da Rainha Ravenovia (Castelo Ravenloft, K88).",
        "room": "K88",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Location in the Castle, pp. 17–18"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "high-8",
    "number": 8,
    "image": "modules/tarokka-reading/assets/cards/high/high-8.webp",
    "name": "Executor",
    "nameEn": "Executioner",
    "symbol": "👑",
    "flavor": "A morte iminente de alguém condenado, com ou sem justiça; falsas acusações e perseguição injusta.",
    "readings": {
      "ally": {
        "prophecy": "Busque o irmão da noiva do diabo. Eles o chamam de \"o menor\", mas ele tem uma alma poderosa.",
        "npc": "Ismark Kolyanovich",
        "description": "Ismark Kolyanovich está na vila de Barovia (E2). Não acompanha os personagens a Ravenloft até saber que Ireena Kolyana está em segurança.",
        "area": "E2",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Enemy, pp. 15–17"
      },
      "location": {
        "prophecy": "Eu vejo uma figura sombria em uma varanda, olhando para baixo sobre esta terra torturada com um sorriso distorcido.",
        "place": "O Mirante (Castelo Ravenloft, K6).",
        "room": "K6",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Location in the Castle, pp. 17–18"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "high-9",
    "number": 9,
    "image": "modules/tarokka-reading/assets/cards/high/high-9.webp",
    "name": "Cavaleiro",
    "nameEn": "Horseman",
    "symbol": "👑",
    "flavor": "Morte e desastre; perda de riqueza ou propriedade, uma derrota terrível ou o fim de uma linhagem.",
    "readings": {
      "ally": {
        "prophecy": "Eu vejo um homem morto de nascimento nobre, guardado por sua viúva. Devolva a vida ao cadáver do homem morto, e ele será um aliado leal.",
        "npc": "Nikolai Wachter, o ancião",
        "description": "Nikolai Wachter, o ancião, está morto em N4o. Reviver os mortos ou ressurreição restaura-o; após se recuperar, aceita ajudar apesar da oposição da esposa. Se necessário, Rictavio pode deixar um pergaminho de reviver os mortos para o grupo.",
        "prophecyAlt": "Um homem da morte chamado Arrigal abandonará seu lorde sombrio para servir a causa de vocês. Cuidado! Ele tem uma alma podre.",
        "npcAlt": "Arrigal",
        "descriptionAlt": "Arrigal, assassino Vistani em N9c, acompanha o grupo se informado da leitura. Após a derrota de Strahd, trai e ataca os personagens, acreditando que deve ser o novo senhor de Barovia.",
        "area": "N4o",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Enemy, pp. 15–17",
        "areaAlt": "N9c"
      },
      "location": {
        "prophecy": "Ele espreita no único lugar para o qual deve retornar - um lugar de morte.",
        "place": "A tumba de Strahd (Castelo Ravenloft, K86).",
        "room": "K86",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Location in the Castle, pp. 17–18"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "high-10",
    "number": 10,
    "image": "modules/tarokka-reading/assets/cards/high/high-10.webp",
    "name": "Inocente",
    "nameEn": "Innocent",
    "symbol": "👑",
    "flavor": "Alguém de grande importância cuja vida corre perigo, talvez indefeso ou inconsciente da ameaça.",
    "readings": {
      "ally": {
        "prophecy": "Eu vejo um jovem com um coração bondoso. O menino da mamãe! Ele é forte de corpo mas fraco de mente. Busque-o na Vila de Barovia.",
        "npc": "Parriwimple",
        "description": "Parriwimple trabalha para Bildrath (E1). Precisa de uma boa razão para ir a Ravenloft, e o grupo deve lidar com a oposição de Bildrath.",
        "prophecyAlt": "A noiva do mal é quem vocês buscam!",
        "npcAlt": "Ireena Kolyana",
        "descriptionAlt": "Ireena Kolyana está em E4. Insiste em seguir a leitura apesar da oposição de Ismark, mas não parte antes do sepultamento de Kolyan Indirovich.",
        "area": "E1",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Enemy, pp. 15–17",
        "areaAlt": "E4"
      },
      "location": {
        "prophecy": "Ele habita com aquele cujo sangue selou sua perdição, um irmão de luz apagado cedo demais.",
        "place": "A tumba de Sergei (Castelo Ravenloft, K85).",
        "room": "K85",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Location in the Castle, pp. 17–18"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "high-11",
    "number": 11,
    "image": "modules/tarokka-reading/assets/cards/high/high-11.webp",
    "name": "Marionete",
    "nameEn": "Marionette",
    "symbol": "👑",
    "flavor": "Um espião ou servo de um poder maior; um encontro com um fantoche ou subordinado.",
    "readings": {
      "ally": {
        "prophecy": "Que horror é esse? Eu vejo um homem feito por um homem. Sem idade e solitário, ele assombra as torres do castelo.",
        "npc": "Pidlwick II",
        "description": "Pidlwick II é o construto do Castelo Ravenloft (K59; apêndice D). Não se deve confundi-lo com o Pidlwick humano morto.",
        "prophecyAlt": "Procure por um homem da música, um homem com duas cabeças. Ele vive em um lugar de grande fome e tristeza.",
        "npcAlt": "Clovin Belview",
        "descriptionAlt": "Clovin Belview é o mestiço de duas cabeças da abadia (S17). Só aceita partir depois da morte do Abade e se subornado com vinho; não concede benefício sem sua viola.",
        "area": "K59",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Enemy, pp. 15–17",
        "areaAlt": "S17"
      },
      "location": {
        "prophecy": "Olhe para grandes alturas. Encontre o coração pulsante do castelo. Ele espera por perto.",
        "place": "O pico da torre norte (Castelo Ravenloft, K60).",
        "room": "K60",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Location in the Castle, pp. 17–18"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "high-12",
    "number": 12,
    "image": "modules/tarokka-reading/assets/cards/high/high-12.webp",
    "name": "Brumas",
    "nameEn": "Mists",
    "symbol": "👑",
    "flavor": "Algo inesperado ou misterioso que não pode ser evitado; uma grande busca ou jornada que provará o espírito.",
    "readings": {
      "ally": {
        "prophecy": "Uma Vistana vaga por esta terra sozinha, procurando por seu mentor. Ela não fica em um lugar por muito tempo. Busque-a na abadia de Santa Markovia, perto das brumas.",
        "npc": "Ezmerelda d'Avenir",
        "description": "Ezmerelda d’Avenir pode ser encontrada na Abadia de Santa Markovia (S19), além de outros locais indicados na aventura. Consulte o apêndice D.",
        "area": "S19",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Enemy, pp. 15–17"
      },
      "location": {
        "prophecy": "As cartas não conseguem ver onde o mal espreita. As brumas obscurecem tudo!",
        "place": "Qualquer lugar dentro do Castelo Ravenloft, à escolha do mestre. Alternativamente, Eva pede que voltem após pelo menos três dias para uma nova leitura apenas da quinta carta.",
        "room": "Variável",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Location in the Castle, pp. 17–18"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "high-13",
    "number": 13,
    "image": "modules/tarokka-reading/assets/cards/high/high-13.webp",
    "name": "Corvo",
    "nameEn": "Raven",
    "symbol": "👑",
    "flavor": "Uma fonte oculta de informação; uma virada favorável dos acontecimentos; um potencial secreto para o bem.",
    "readings": {
      "ally": {
        "prophecy": "Encontre o líder dos emplumados que vivem entre as vinhas. Embora velho, ele tem mais uma luta dentro de si.",
        "npc": "Davian Martikov",
        "description": "Davian Martikov é um homem-corvo da Vinícola Mago dos Vinhos (W). Deixa a vinícola com Adrian e Elvir, mas exige reconciliar-se com Urwin (Pousada Água Azul, N2) antes de seguir para Ravenloft.",
        "area": "W/N2",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Enemy, pp. 15–17"
      },
      "location": {
        "prophecy": "Olhe para a tumba da mãe.",
        "place": "Tumba do Rei Barov e da Rainha Ravenovia (Castelo Ravenloft, K88).",
        "room": "K88",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Location in the Castle, pp. 17–18"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  },
  {
    "id": "high-14",
    "number": 14,
    "image": "modules/tarokka-reading/assets/cards/high/high-14.webp",
    "name": "Tentador",
    "nameEn": "Tempter",
    "symbol": "👑",
    "flavor": "Alguém comprometido ou desviado pela tentação ou insensatez; aquele que tenta os outros para fins malignos.",
    "readings": {
      "ally": {
        "prophecy": "Eu vejo uma criança - uma Vistana. Vocês devem se apressar, pois o destino dela está por um fio. Encontre-a no lago!",
        "npc": "Arabelle",
        "description": "Arabelle está no Lago Zarovich (L). Aceita juntar-se ao grupo, mas, se retornar ao acampamento, Luvash recusa-se a deixá-la partir.",
        "prophecyAlt": "Eu ouço um sino de casamento, ou talvez um sino fúnebre. Ele chama a ti para uma abadia na montanha, na qual vocês encontrarão uma mulher que é mais do que a soma de suas partes.",
        "npcAlt": "Vasilka",
        "descriptionAlt": "Vasilka é o golem de carne da Abadia de Santa Markovia (S13). Consulte o encontro com o Abade para conduzir sua participação.",
        "area": "L",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Enemy, pp. 15–17",
        "areaAlt": "S13"
      },
      "location": {
        "prophecy": "Eu vejo um lugar secreto - um cofre de tentação escondido atrás de uma mulher de grande beleza. O mal espera no topo de sua torre de tesouro.",
        "place": "Tesouraria do Castelo Ravenloft (K41). A mulher da pista é o retrato de Tatyana no escritório (K37), atrás do qual há uma passagem secreta para a tesouraria.",
        "room": "K41",
        "reference": "Curse of Strahd, cap. 1, Strahd’s Location in the Castle, pp. 17–18"
      }
    },
    "meaningSource": "Curse of Strahd, apêndice E, pp. 243–244"
  }
];

// ─────────────────────────────────────────────────
// FUNÇÕES UTILITÁRIAS
// ─────────────────────────────────────────────────

/**
 * Retorna todas as 54 cartas do baralho Tarokka.
 * @returns {Array} Array com todas as cartas (Common + High)
 */
export function getAllCards() {
  return [...COMMON_DECK, ...HIGH_DECK];
}

/**
 * Busca uma carta do Baralho Comum pelo naipe e número.
 * @param {string} suit - O naipe ('swords', 'stars', 'coins', 'glyphs')
 * @param {number} number - O número da carta (1-10, onde 10 = Mestre)
 * @returns {Object|null} A carta encontrada ou null
 */
export function getCommonCard(suit, number) {
  return COMMON_DECK.find(c => c.suit === suit && c.number === number) || null;
}

/**
 * Busca uma carta do Baralho Alto pelo número (1-14).
 * @param {number} number - O número da carta (1-14)
 * @returns {Object|null} A carta encontrada ou null
 */
export function getHighCard(number) {
  return HIGH_DECK.find(c => c.number === number) || null;
}

/**
 * Retorna a leitura (profecia + interpretação) para uma carta numa posição específica.
 * @param {Object} card - O objeto da carta
 * @param {number} position - A posição na leitura (0-4)
 *   0 = Tomo de Strahd, 1 = Símbolo Sagrado, 2 = Lâmina Solar,
 *   3 = Aliado Destinado, 4 = Local no Castelo
 * @returns {Object} { prophecy, location/npc/place, description }
 */
export function getCardReading(card, position) {
  const positionKeys = ['tome', 'symbol', 'sword', 'ally', 'location'];
  const key = positionKeys[position];

  if (!card || !card.readings || !card.readings[key]) {
    return {
      prophecy: 'As brumas obscurecem esta visão... O destino ainda não se revelou.',
      details: 'Leitura não encontrada.'
    };
  }

  return card.readings[key];
}

/**
 * Retorna informações sobre um naipe.
 * @param {string} suitId - ID do naipe ('swords', 'stars', 'coins', 'glyphs')
 * @returns {Object} Dados do naipe
 */
export function getSuitInfo(suitId) {
  return SUITS[suitId] || { id: 'high', name: 'Baralho Alto', nameEn: 'High Deck', symbol: '👑', theme: 'Arquétipos e forças cósmicas', color: '#d4af37' };
}

/**
 * Retorna o nome formatado de uma carta (ex: "3 de Espadas — Soldado").
 * @param {Object} card - O objeto da carta
 * @returns {string} Nome formatado
 */
export function getCardDisplayName(card) {
  if (!card) return '???';

  // Carta do Baralho Alto
  if (!card.suit || card.suit === 'high') {
    return card.name;
  }

  // Carta do Baralho Comum
  const suit = SUITS[card.suit];
  const numberName = card.number === 10 ? 'Mestre' : card.number;
  return `${numberName} de ${suit.name} — ${card.name}`;
}

/**
 * Retorna nomes das posições da leitura.
 */
export const POSITION_NAMES = [
  { name: 'O Tomo de Strahd', subtitle: 'O Passado', icon: '📖' },
  { name: 'O Símbolo Sagrado de Ravenkind', subtitle: 'O Presente', icon: '☀️' },
  { name: 'A Lâmina Solar', subtitle: 'O Futuro', icon: '⚔️' },
  { name: 'O Inimigo de Strahd', subtitle: 'O Aliado Destinado', icon: '🛡️' },
  { name: 'O Lorde das Trevas', subtitle: 'O Confronto Final', icon: '🏰' }
];
