// Private guidance checked against the local CoS book, each area's
// "Fortunes of Ravenloft" section. These notes never enter publicState.
const treasureNotes={
  'swords-1':'Vladimir está com o tesouro. Só o entrega voluntariamente depois que o farol de Argynvostholt for aceso.',
  'swords-2':'O tesouro está dentro do caixão, ao lado do corpo de Sergei.',
  'swords-3':'Seis donzelas da neve guardam o telhado. Use espectros com imunidade a frio e dano de frio no lugar de necrótico. O tesouro surge magicamente na neve depois que a última for derrotada.',
  'swords-4':'O tesouro está ao lado do esqueleto no fundo do poço da cripta 31.',
  'swords-5':'O tesouro está entre as oferendas na base da estátua da Mãe Noite. Quem o retirar fica amaldiçoado: sofre pesadelos do anoitecer ao amanhecer e não recebe os benefícios de descansos curtos ou longos durante a noite. Descansar de dia funciona normalmente. Devolver o item não encerra a maldição, que não passa a outros portadores. Restauração maior, remover maldição ou sair de Barovia encerram o efeito.',
  'swords-6':'O tesouro está num compartimento secreto sob os restos de Grislek. Remover os ossos carbonizados permite encontrá-lo e abri-lo sem teste de habilidade.',
  'swords-7':'O tesouro está no chão, dentro da cabeça da estátua.',
  'swords-8':'O tesouro está no estrado de mármore, logo atrás do trono.',
  'swords-9':'O tesouro está escondido em um baú do depósito. Cada personagem tem 20% de chance cumulativa de encontrá-lo por hora de busca no sótão.',
  'swords-10':'O tesouro está no nicho central da tumba.',
  'stars-1':'O tesouro está dentro do baú de ferro no pico da torre.',
  'stars-2':'O tesouro está escondido em uma das carroças Vistani. Se pedirem permissão, Madame Eva autoriza a busca; uma busca nas carroças encontra o item.',
  'stars-3':'O tesouro está numa cavidade sob o monumento. Movê-lo ou tombá-lo exige Força CD 15. Perturbá-lo desperta sete cadáveres, inicialmente a cerca de 18 metros. Use as estatísticas de plebeu, com deslocamento de 6 metros e imunidade às condições enfeitiçado e amedrontado. Cada cadáver libera um enxame de cobras venenosas ao cair a 0 PV. O grupo pode pegar o tesouro e fugir dos cadáveres lentos.',
  'stars-4':'O tesouro repousa no peitoril da janela oeste do farol.',
  'stars-5':'O tesouro está dentro da maquete. É preciso quebrar o pequeno castelo para alcançá-lo.',
  'stars-6':'O tesouro está no compartimento sob a laje de mármore. Encaixar a ponta de mármore do cajado no recesso eleva a laje por 1 minuto; a ponta de latão causa 4d10 de dano elétrico ao portador.',
  'stars-7':'O tesouro está numa caixa revestida de chumbo, sob o banco dianteiro da carroça, junto dos demais objetos escondidos.',
  'stars-8':'O tesouro repousa sobre a cornija da lareira, abaixo do retrato de Tatyana.',
  'stars-9':'O tesouro está no baú, junto dos demais objetos da cabana.',
  'stars-10':'O tesouro está num compartimento estreito da parede, atrás da armadura. Se ativada e ordenada a buscá-lo, ela remove as pedras. Se a torre desabar, a busca leva 1d8 + 2 horas e tem 10% de chance por hora de desenterrar um golem de barro enfurecido.',
  'coins-1':'O tesouro está num compartimento secreto sob os restos de Endorovich. Retirar os ossos e a poeira revela o compartimento, que pode ser aberto sem teste de habilidade.',
  'coins-2':'O tesouro está sob os destroços de um dos berços.',
  'coins-3':'O tesouro está enterrado no barril de areia. Esvaziar o barril ou revirar a areia revela o item sem teste.',
  'coins-4':'Cyrus Belview escondeu o tesouro em um dos barris vazios junto à parede norte.',
  'coins-5':'O tesouro está sob as garrafas de vinho. Quem procurar sob elas o encontra automaticamente.',
  'coins-6':'Kasimir está com o tesouro. Ele o entrega se os personagens prometerem acompanhá-lo ao Templo de Âmbar e ajudá-lo a encontrar uma forma de ressuscitar Patrina.',
  'coins-7':'O tesouro está enterrado em uma das sepulturas. Cada cova escavada acrescenta 10% cumulativos à chance de encontrá-lo.',
  'coins-8':'O tesouro está entre os demais objetos da carroça. A pista da criança se refere a Arabelle. As chaves dos dois cadeados estão com Luvash e Arrigal; cada fechadura tem uma armadilha de agulha envenenada.',
  'coins-9':'O tesouro está sobre as moedas, no piso térreo da torre dentro da tesouraria.',
  'coins-10':'O tesouro está no cofre de ferro do sótão secreto. Os Guardiões da Pena só revelam onde ele está depois de testar o grupo: Urwin pede que recuperem a entrega de vinho da vinícola.',
  'glyphs-1':'O tesouro está no nicho secreto, junto da poção, atrás do símbolo do sol no salão principal.',
  'glyphs-2':'O tesouro está dentro da garganta cheia de palha do espantalho mais ao sul. Retirá-lo faz sete inumanos (wights) emergirem do jardim e atacarem.',
  'glyphs-3':'O tesouro está sob o gazebo. É preciso desmontá-lo para alcançar o item. Se o grupo danificar a estrutura e não a reparar, terá desvantagem nos testes de Carisma para mudar a atitude dos moradores.',
  'glyphs-4':'O tesouro está sobre o caixão da rainha Ravenovia.',
  'glyphs-5':'O tesouro está enterrado entre as raízes da árvore Gulthias, sob o esqueleto do aventureiro morto. Escavar sob o esqueleto revela o item automaticamente.',
  'glyphs-6':'O tesouro está sobre a mesa de ossos.',
  'glyphs-7':'O tesouro é fácil de encontrar: pode estar num ninho de pássaro ou sob um pouco de terra em um canto do sótão.',
  'glyphs-8':'O tesouro está enterrado em uma das seis pilhas da tesouraria; role 1d6 para determinar a pilha. O golem de âmbar ataca quem perturbar o tesouro.',
  'glyphs-9':'O tesouro está no baú de ferro que contém os ossos de Leo Dilisnya, no quarto principal.',
  'glyphs-10':'O tesouro está no chão, atrás do altar da capela.'
};

const encounters={
  K6:'Strahd está no mirante, olhando para além da varanda.',
  K15:'Strahd está entre os morcegos abaixo do teto ou de pé em uma das extremidades da capela.',
  K25:'Strahd está sentado no trono de madeira.',
  K37:'Strahd está recostado em uma das poltronas, contemplando o fogo.',
  K41:'Strahd está no topo da torre dentro da tesouraria.',
  K60:'Strahd está de pé ao lado do baú de ferro.',
  K67:'Strahd está sentado em uma ponta da mesa, segurando o crânio de um antigo inimigo.',
  K85:'Strahd está deitado sobre o caixão de Sergei, chorando.',
  K86:'Strahd está no próprio caixão, pronto para atacar quem abrir a tampa.',
  K88:'Strahd está tomado por fúria e desespero.'
};

const allyPlaces={
  N2:'Pousada Água Azul, em Vallaki.',Z7:'Santuário da Mãe Noite, no Covil dos Lobisomens.',
  M:'Monte Baratok, nas proximidades do Lago Zarovich.',N3t:'Oficina de Victor, no sótão da mansão do burgomestre de Vallaki.',
  N4n:'Quarto de Stella na Wachterhaus, em Vallaki.',N9a:'Casebre de Kasimir no acampamento dos elfos do crepúsculo, fora de Vallaki.',
  Q37:'Aposentos dos cavaleiros da Ordem do Dragão de Prata, em Argynvostholt.',
  'K84/33':'Cripta de Sir Klutz, nas catacumbas do Castelo Ravenloft.',
  E2:'Taverna Sangue do Vinho, na vila de Barovia.',N4o:'Quarto principal da Wachterhaus, em Vallaki.',
  N9c:'Tenda dos líderes Vistani no acampamento fora de Vallaki.',E1:'Loja de Bildrath, na vila de Barovia.',
  E4:'Mansão do burgomestre, na vila de Barovia.',K59:'Topo danificado da torre alta do Castelo Ravenloft.',
  S17:'Sótão e campanário da Abadia de Santa Markovia.',S19:'Antigo alojamento dos guardas da Abadia de Santa Markovia.',
  'W/N2':'Vinícola Mago dos Vinhos; a reconciliação com Urwin acontece na Pousada Água Azul, em Vallaki.',
  L:'Lago Zarovich.',S13:'Salão principal da Abadia de Santa Markovia.'
};

// Keep source citations in the audited data, but turn the guidance into prose
// that can be used directly at the table, without chapter or map lookups.
function tableText(text){
  return text
    .replace(/\s*\(cap\.\s*\d+[^)]*\)/gi,match=>{const crypt=match.match(/cripta\s+\d+/i);return crypt?` (${crypt[0]})`:'';})
    .replace(/\(Castelo Ravenloft,\s*K\d+\)/g,'(Castelo Ravenloft)')
    .replace(/\s*\((?:área\s+)?[A-Z]\d*[a-z]?(?:\/\d+)?(?:;\s*apêndice\s+[A-Z])?\)/g,'')
    .replace(/Esta é a leitura oficial;[^.]*\./g,'')
    .replace(/em U2/g,'na mansão de Lazlo Ulrich')
    .replace(/a estátua de Q1/g,'a estátua de pedra na entrada de Argynvostholt')
    .replace(/em N3t/g,'em sua oficina no sótão')
    .replace(/em N4o/g,'no quarto principal da Wachterhaus')
    .replace(/em N4n/g,'em seu quarto na Wachterhaus')
    .replace(/em N9c/g,'na tenda dos líderes Vistani, fora de Vallaki')
    .replace(/em E4/g,'na mansão do burgomestre da vila de Barovia')
    .replace(/, N2\)/g,', em Vallaki)')
    .replace(/Consulte o apêndice D\./g,'')
    .replace(/Consulte o encontro com o Abade para conduzir sua participação\./g,'Ela foi criada pelo Abade para ser a noiva de Strahd e obedece às ordens dele.')
    .replace(/\s+([.,;])/g,'$1').replace(/ {2,}/g,' ').trim();
}

const reloadedLocations={
  0:'Leo Dilisnya guarda o Tomo de Strahd no Plano Etéreo. Os personagens o encontram durante o ritual para restaurar Stella Wachter, na Wachterhaus. O livro fica disponível após a derrota do orador da forca.',
  2:'O punho da Lâmina Solar está no semiplano dentro da prisão de Vampyr. A entrada é o sarcófago de Vampyr, no Templo de Âmbar. O espírito de Patrina Velikovna habita o punho; é preciso derrotá-la e reacender a arma. Argynvostholt fornece o caminho até esse destino.'
};

export function gmNotesForReading(card,index,reading,mode='official'){
  const notes=[];
  const add=(label,text)=>{if(text){const prose=tableText(text);if(prose)notes.push({label,text:prose});}};
  if(index<3){
    add('Tesouro',['Tomo de Strahd','Símbolo Sagrado de Ravenkind','Lâmina Solar'][index]);
    add('Localização',mode==='reloaded'&&reloadedLocations[index]?reloadedLocations[index]:reading.location??reading.details);
    // Reloaded changes the actual destination of the Tome and Sunsword.
    if(!(mode==='reloaded'&&(index===0||index===2)))add('Onde encontrar e como obter',treasureNotes[card.id]);
  }else if(index===3){
    add('Aliado destinado',reading.npc);
    add('Localização',allyPlaces[reading.area]);
    add('Condições e orientação',reading.description??reading.details);
    if(card.id==='high-3')add('Mago Louco — participação','Depois de recuperar a sanidade, Mordenkainen pode ajudar no combate contra Strahd, mas não acompanha o grupo em viagens. O grupo deve descobrir onde encontrar o vampiro e como destruí-lo; ao saber dos três tesouros, ele insiste em recuperá-los antes do confronto.');
    if(card.id==='high-7')add('Godfrey e o farol','Se o farol de Argynvostholt ainda não estiver aceso, os outros revenants reagem com violência à decisão de Godfrey de ajudar. Se estiver aceso, Godfrey permanece como revenant para cumprir sua última tarefa contra Strahd, mesmo depois do descanso dos demais.');
    if(reading.area!=='Nenhuma')add('Regra do aliado','Enquanto estiver à vista de Strahd, o aliado recebe a ação Inspirar: concede inspiração a um personagem jogador que possa ver. Strahd percebe a ameaça e tenta eliminá-lo.');
    if(reading.npcAlt){
      add('Alternativa B — opcional',reading.npcAlt);
      add('Profecia da alternativa B',reading.prophecyAlt);
      add('Localização da alternativa B',allyPlaces[reading.areaAlt]);
      add('Condições da alternativa B',reading.descriptionAlt);
      add('Escolha do mestre','A leitura apresentada usa a opção A. A alternativa B é uma opção do livro para o mestre escolher; ela não substitui automaticamente a carta ou a profecia mostrada aos jogadores.');
    }
  }else{
    add('Local do confronto',reading.place??reading.details);
    add('Cena do encontro',encounters[reading.room]);
    add('Quando encontrar Strahd','Na primeira chegada dos personagens ao local previsto, Strahd está ali, desde que não tenha sido forçado a retornar ao próprio caixão. Essa previsão não o mantém imóvel no local durante toda a aventura.');
  }
  return notes;
}

export function renderGMNotes(container,notes=[]){
  container.replaceChildren();
  if(!notes?.length)return;
  const document=container.ownerDocument,list=document.createElement('dl');
  for(const {label,text} of notes){
    const term=document.createElement('dt'),definition=document.createElement('dd');
    term.textContent=label;definition.textContent=text;
    list.append(term,definition);
  }
  container.append(list);
}
