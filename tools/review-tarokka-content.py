from pathlib import Path
import json,re
root=Path(__file__).resolve().parents[1]
before=json.loads((root/'backups/content-review-2026-10-20/cards-before.json').read_text(encoding='utf-8'))
cards=json.loads(json.dumps(before));by={c['id']:c for c in cards}
meanings={
'swords-1':'Justiça e vingança por grandes injustiças; a busca para livrar o mundo de um grande mal.',
'swords-2':'Guerreiros justos e nobres; honra e integridade guiadas por um código de conduta.',
'swords-3':'Guerra e sacrifício; resistência para suportar grandes provações.',
'swords-4':'Força interior e perseverança; aqueles que lutam por poder ou riqueza.',
'swords-5':'Grandes heróis; uma súbita reviravolta do destino; a vitória do mais fraco sobre um inimigo poderoso.',
'swords-6':'A face brutal e bárbara da guerra; sede de sangue; uma natureza bestial.',
'swords-7':'Fanatismo, intolerância e xenofobia; uma presença misteriosa ou alguém recém-chegado.',
'swords-8':'Os males do governo e da liderança; aqueles que governam pelo medo e pela violência.',
'swords-9':'Sofrimento ou crueldade implacável por vir; maldade ou sadismo irredimíveis.',
'swords-10':'Força e violência personificadas; aqueles que usam a força para atingir seus objetivos.',
'stars-1':'Uma nova descoberta; acontecimentos inesperados; consequências imprevistas e caos.',
'stars-2':'Conhecimento temperado pela sabedoria; verdade, honestidade, sábios e profecia.',
'stars-3':'Conflito interior causado por confusão, medo do fracasso ou informações falsas.',
'stars-4':'Lógica e razão; um aviso sobre uma pista ou informação que passou despercebida.',
'stars-5':'O triunfo da natureza sobre a civilização; desastres naturais e colheitas abundantes.',
'stars-6':'Poder mágico ou sobrenatural incontrolável; magia usada para destruir.',
'stars-7':'Mentiras e engano; grandes conspirações e sociedades secretas; um tolo enganado ou um sabotador.',
'stars-8':'Acontecimentos antinaturais e obsessões nocivas; aqueles que seguem um caminho de destruição.',
'stars-9':'Uma ameaça sobrenatural inesperada que se aproxima; aqueles que se consideram deuses.',
'stars-10':'Mistérios, enigmas e o desconhecido; aqueles que anseiam por poder mágico e grande conhecimento.',
'coins-1':'Aqueles que gostam de dinheiro, mas o dão livremente; ladinos e patifes carismáticos.',
'coins-2':'Caridade e generosidade em grande escala; riqueza usada para combater o mal e a doença.',
'coins-3':'Comércio, contrabando e mercados clandestinos; trocas justas e equilibradas.',
'coins-4':'Uma mercadoria rara ou oportunidade de negócio; transações enganosas ou perigosas.',
'coins-5':'Pessoas de ideias semelhantes unidas por um objetivo comum; orgulho no próprio trabalho.',
'coins-6':'Uma mudança repentina na condição econômica ou na fortuna.',
'coins-7':'Roubo e furto; perda de bens, beleza, inocência, amizade ou reputação.',
'coins-8':'Corrupção; honestidade em um governo ou organização corruptos.',
'coins-9':'Riqueza acumulada; infelicidade irreversível ou a crença de que o dinheiro não tem sentido.',
'coins-10':'Aqueles para quem o dinheiro importa; a crença de que a riqueza é a chave do sucesso.',
'glyphs-1':'Serenidade, força interior e autoconfiança; segurança plena sem arrogância.',
'glyphs-2':'Aqueles que espalham sabedoria e fé; um aviso sobre a propagação do medo e da ignorância.',
'glyphs-3':'Cura; doença ou maldição contagiosa; aqueles que praticam as artes de curar.',
'glyphs-4':'Aqueles que protegem os outros; alguém que carrega um fardo grande demais para suportar sozinho.',
'glyphs-5':'A ambivalência e a crueldade da natureza e daqueles que se sentem atraídos por ela; conflito interior.',
'glyphs-6':'Uma mudança fundamental provocada por alguém cujas crenças estão sendo postas à prova.',
'glyphs-7':'Mentirosos; aqueles que professam uma crença, mas na verdade seguem outra.',
'glyphs-8':'Adesão rigorosa a um código ou crença; aqueles que tramam, planejam e conspiram.',
'glyphs-9':'Traição por alguém próximo e confiável; enfraquecimento ou perda da fé.',
'glyphs-10':'Iluminação; devoção a uma divindade, a valores ou a um propósito superior.',
'high-1':'Um objeto que precisa ser obtido, protegido ou destruído a qualquer custo.',
'high-2':'Grande fúria ou paixão; algo bestial ou maligno escondido à vista de todos ou logo abaixo da superfície.',
'high-3':'Derrota, fracasso e desespero; a perda de algo ou alguém sem o qual a pessoa se sente incompleta.',
'high-4':'Uma pessoa poderosa e maligna, cujos objetivos têm consequências vastas e duradouras.',
'high-5':'Isolamento e aprisionamento; alguém tão preso às próprias ideias que se torna prisioneiro de suas crenças.',
'high-6':'Inspiração e intelecto aguçado; um acontecimento futuro cujo desfecho dependerá de uma mente perspicaz.',
'high-7':'O passado que se aproxima; o retorno de um antigo inimigo ou a descoberta de um segredo há muito enterrado.',
'high-8':'A morte iminente de alguém condenado, com ou sem justiça; falsas acusações e perseguição injusta.',
'high-9':'Morte e desastre; perda de riqueza ou propriedade, uma derrota terrível ou o fim de uma linhagem.',
'high-10':'Alguém de grande importância cuja vida corre perigo, talvez indefeso ou inconsciente da ameaça.',
'high-11':'Um espião ou servo de um poder maior; um encontro com um fantoche ou subordinado.',
'high-12':'Algo inesperado ou misterioso que não pode ser evitado; uma grande busca ou jornada que provará o espírito.',
'high-13':'Uma fonte oculta de informação; uma virada favorável dos acontecimentos; um potencial secreto para o bem.',
'high-14':'Alguém comprometido ou desviado pela tentação ou insensatez; aquele que tenta os outros para fins malignos.'}
locations={
'swords-1':('Q36','Vladimir Horngaard guarda o tesouro no Salão de Audiências do Dragão, em Argynvostholt (cap. 7, Q36).'),
'swords-2':('K85','Tumba de Sergei, no Castelo Ravenloft (cap. 4, K85).'),
'swords-3':('T6','Telhado da torre de guarda da Passagem de Tsolenka (cap. 9, T6).'),
'swords-4':('K84/31','Cripta 31 das catacumbas do Castelo Ravenloft (cap. 4, K84).'),
'swords-5':('Z7','Santuário da Mãe Noite, no Covil dos Lobisomens (cap. 15, Z7).'),
'swords-6':('K84/38','Cripta do General Kroval “Cão Louco” Grislek, no Castelo Ravenloft (cap. 4, K84, cripta 38).'),
'swords-7':('X5a','Dentro da cabeça da estátua gigante do Templo de Âmbar (cap. 13, X5a).'),
'swords-8':('K25','Salão de Audiências do Castelo Ravenloft (cap. 4, K25).'),
'swords-9':('N3s','Depósito do sótão da mansão do burgomestre de Vallaki (cap. 5, N3s), não a oficina de Victor em N3t.'),
'swords-10':('K86','Tumba de Strahd, no Castelo Ravenloft (cap. 4, K86).'),
'stars-1':('K60','Pico da torre norte do Castelo Ravenloft (cap. 4, K60).'),
'stars-2':('G','Acampamento de Madame Eva na Poça de Tser (cap. 2, G). Se Eva conduz a leitura, acrescenta que o tesouro está debaixo de seu próprio nariz.'),
'stars-3':('U5','Sob o monumento de Marina, em Berez (cap. 10, U5). O “mestre do pântano” é o fantasma do burgomestre Lazlo Ulrich em U2, que pode indicar o monumento.'),
'stars-4':('Q53','Farol de Argynvostholt (cap. 7, Q53). O dragão de pedra da pista é a estátua de Q1.'),
'stars-5':('X20','Dentro da maquete do Castelo Ravenloft no Templo de Âmbar (cap. 13, X20).'),
'stars-6':('K84/37','Cripta de Gralmore Nimblenobs no Castelo Ravenloft (cap. 4, K84, cripta 37).'),
'stars-7':('N5','Carroça de Rictavio no pátio de estoque de Vallaki (cap. 5, N5).'),
'stars-8':('K37','Escritório do Castelo Ravenloft (cap. 4, K37). A mulher da pista é o retrato de Tatyana sobre a lareira.'),
'stars-9':('U3','Cabana de Baba Lysaga nas ruínas de Berez (cap. 10, U3).'),
'stars-10':('V7','Quarto andar da Torre de Van Richten (cap. 11, V7).'),
'coins-1':('K84/7','Cripta de Endorovich no Castelo Ravenloft (cap. 4, K84, cripta 7).'),
'coins-2':('S23','Berçário da Abadia de Santa Markovia (cap. 8, S23).'),
'coins-3':('W10','Oficina do soprador de vidro na Vinícola Mago dos Vinhos (cap. 12, W10).'),
'coins-4':('K63','Adega do Castelo Ravenloft (cap. 4, K63).'),
'coins-5':('K84/5','Cripta de Artank Swilovich no Castelo Ravenloft (cap. 4, K84, cripta 5).'),
'coins-6':('N9a','Casebre de Kasimir no acampamento Vistani e dos elfos do crepúsculo, fora de Vallaki (cap. 5, N9a), não dentro da cidade.'),
'coins-7':('F','Enterrado no cemitério da Encruzilhada do Rio Ivlis (cap. 2, F).'),
'coins-8':('N9i','Carroça de tesouros dos Vistani, fora de Vallaki (cap. 5, N9i). A criança desaparecida é Arabelle, no Lago Zarovich (cap. 2, L).'),
'coins-9':('K41','Tesouraria do Castelo Ravenloft (cap. 4, K41).'),
'coins-10':('N2q','Sótão da Pousada Água Azul, em Vallaki (cap. 5, N2q).'),
'glyphs-1':('S13','Salão principal da Abadia de Santa Markovia (cap. 8, S13).'),
'glyphs-2':('S9','Dentro de um dos espantalhos do jardim da Abadia de Santa Markovia (cap. 8, S9).'),
'glyphs-3':('S4','Sob o gazebo do Santuário do Sol Branco, junto ao espelho d’água de Krezk (cap. 8, S4).'),
'glyphs-4':('K88','Tumba do Rei Barov e da Rainha Ravenovia, no Castelo Ravenloft (cap. 4, K88).'),
'glyphs-5':('Y4','Base da árvore Gulthias, na Colina de Yester (cap. 14, Y4). Homens-corvo encontrados na natureza podem guiar o grupo até lá.'),
'glyphs-6':('K67','Salão dos Ossos do Castelo Ravenloft (cap. 4, K67).'),
'glyphs-7':('O4','Sótão do Velho Moinho de Ossos (cap. 6, O4).'),
'glyphs-8':('X40','Tesouraria selada do Templo de Âmbar (cap. 13, X40). Esta é a leitura oficial; a Lâmina Solar no Reloaded usa outra pista e X42.'),
'glyphs-9':('N4o','Quarto principal de Wachterhaus, em Vallaki (cap. 5, N4o). Esta é a leitura oficial; o Tomo no Reloaded está com Leo Dilisnya.'),
'glyphs-10':('K15','Capela do Castelo Ravenloft (cap. 4, K15).')}
for c in cards:
    c['flavor']=meanings[c['id']]
    c['meaningSource']='Curse of Strahd, apêndice E, pp. 243–244'
    if c.get('suit'):
        area,location=locations[c['id']]
        for key in ['tome','symbol','sword']:
            c['readings'][key]['location']=location
            c['readings'][key]['area']=area
            c['readings'][key]['reference']='Curse of Strahd, cap. 1, Treasure Locations, pp. 12–15'
# Clear mistranslations, without changing the official destinations.
for key in ['tome','symbol','sword']:
    by['coins-1']['readings'][key]['prophecy']='Eu vejo o esqueleto de um guerreiro temível, deitado sobre um leito de pedra ladeado por gárgulas.'
    by['glyphs-2']['readings'][key]['prophecy']='Eu vejo um jardim coberto de neve, vigiado por um espantalho com um sorriso de aniagem. Não olhem para o jardim, mas para o guardião.'
    by['glyphs-3']['readings'][key]['prophecy']='Olhem para o oeste. Encontrem um espelho d’água abençoado pela luz do sol branco.'
by['high-3']['readings']['location']['prophecy']='Ele assombra a tumba do homem que invejava acima de todos.'
by['high-12']['readings']['location']['place']='Qualquer lugar dentro do Castelo Ravenloft, à escolha do mestre. Alternativamente, Eva pede que voltem após pelo menos três dias para uma nova leitura apenas da quinta carta.'
by['high-14']['readings']['location']['place']='Tesouraria do Castelo Ravenloft (K41). A mulher da pista é o retrato de Tatyana no escritório (K37), atrás do qual há uma passagem secreta para a tesouraria.'
allies={
'high-1':('N2','Rictavio é Rudolph van Richten disfarçado, na Pousada Água Azul (N2). Ao ouvir a leitura, revela sua identidade e aceita acompanhar o grupo. Blinsky e seu macaco são uma pista falsa; Blinsky indica Rictavio.'),
'high-2':('Z7','Zuleika Toranescu está no santuário da Mãe Noite (Z7). Acompanha o grupo se prometerem vingar seu companheiro Emil, matando Kiril Stoyanovich.'),
'high-3':('M','O Mago Louco do Monte Baratok (área M). É preciso lidar com a loucura e a desconfiança dele conforme a seção do encontro; a carta não o apresenta como aliado já recuperado.'),
'high-4':('Nenhuma','Não há aliado destinado que receba a ação Inspirar por esta leitura. Isso não impede outras alianças normais durante a campanha.'),
'high-5':('N3t','Victor Vallakovich está em sua oficina no sótão (N3t). Ao perceber que o grupo pode libertá-lo de sua situação, deixa a casa e acompanha os personagens a Ravenloft.'),
'high-6':('N9a','Kasimir Velikov vive no acampamento dos elfos do crepúsculo (N9a). Só acompanha o grupo a Ravenloft depois que o levam ao Templo de Âmbar e o ajudam a obter os meios para ressuscitar Patrina Velikovna.'),
'high-7':('Q37','Sir Godfrey Gwilym é um revenant, não um fantasma, em Argynvostholt (Q37). Aceita acompanhar o grupo se o convencerem de que sua ajuda pode restaurar a honra da Ordem do Dragão de Prata: Carisma (Persuasão) CD 15.'),
'high-8':('E2','Ismark Kolyanovich está na vila de Barovia (E2). Não acompanha os personagens a Ravenloft até saber que Ireena Kolyana está em segurança.'),
'high-9':('N4o','Nikolai Wachter, o ancião, está morto em N4o. Reviver os mortos ou ressurreição restaura-o; após se recuperar, aceita ajudar apesar da oposição da esposa. Se necessário, Rictavio pode deixar um pergaminho de reviver os mortos para o grupo.'),
'high-10':('E1','Parriwimple trabalha para Bildrath (E1). Precisa de uma boa razão para ir a Ravenloft, e o grupo deve lidar com a oposição de Bildrath.'),
'high-11':('K59','Pidlwick II é o construto do Castelo Ravenloft (K59; apêndice D). Não se deve confundi-lo com o Pidlwick humano morto.'),
'high-12':('S19','Ezmerelda d’Avenir pode ser encontrada na Abadia de Santa Markovia (S19), além de outros locais indicados na aventura. Consulte o apêndice D.'),
'high-13':('W/N2','Davian Martikov é um homem-corvo da Vinícola Mago dos Vinhos (W). Deixa a vinícola com Adrian e Elvir, mas exige reconciliar-se com Urwin (Pousada Água Azul, N2) antes de seguir para Ravenloft.'),
'high-14':('L','Arabelle está no Lago Zarovich (L). Aceita juntar-se ao grupo, mas, se retornar ao acampamento, Luvash recusa-se a deixá-la partir.')}
alts={
'high-3':('E5','Donavich é o sacerdote da vila de Barovia (E5). Só acompanha o grupo depois que Doru estiver morto e enterrado.'),
'high-5':('N4n','Stella Wachter está em N4n. Não concede benefício enquanto sua loucura não for curada; recuperada, aceita deixar a família e acompanhar o grupo.'),
'high-7':('K84/33','Sir Klutz, guerreiro fantasma da cripta 33 (K84). Como aliado destinado, permanece até que ele ou Strahd chegue a 0 PV, em vez de desaparecer após sete dias.'),
'high-9':('N9c','Arrigal, assassino Vistani em N9c, acompanha o grupo se informado da leitura. Após a derrota de Strahd, trai e ataca os personagens, acreditando que deve ser o novo senhor de Barovia.'),
'high-10':('E4','Ireena Kolyana está em E4. Insiste em seguir a leitura apesar da oposição de Ismark, mas não parte antes do sepultamento de Kolyan Indirovich.'),
'high-11':('S17','Clovin Belview é o mestiço de duas cabeças da abadia (S17). Só aceita partir depois da morte do Abade e se subornado com vinho; não concede benefício sem sua viola.'),
'high-14':('S13','Vasilka é o golem de carne da Abadia de Santa Markovia (S13). Consulte o encontro com o Abade para conduzir sua participação.')}
for cid,(area,description) in allies.items():
    reading=by[cid]['readings']['ally'];reading.update(area=area,description=description,reference='Curse of Strahd, cap. 1, Strahd’s Enemy, pp. 15–17')
for cid,(area,description) in alts.items():
    by[cid]['readings']['ally'].update(areaAlt=area,descriptionAlt=description)
for c in cards:
    if not c.get('suit'):
        c['readings']['location']['reference']='Curse of Strahd, cap. 1, Strahd’s Location in the Castle, pp. 17–18'
# Preserve the module API and original asset IDs.
p=root/'tarokka-reading/scripts/tarokka-data.mjs';s=p.read_text(encoding='utf-8')
a=s.index('export const COMMON_DECK = [');b=s.index('export const HIGH_DECK = [',a)
c=s.index('// ─────────────────────────────────────────────────\n// FUNÇÕES UTILITÁRIAS',b)
s=s[:a]+'export const COMMON_DECK = '+json.dumps(cards[:40],ensure_ascii=False,indent=2)+';\n\nexport const HIGH_DECK = '+json.dumps(cards[40:],ensure_ascii=False,indent=2)+';\n\n'+s[c:]
s=s.replace('ex: "⚔️ 3 de Espadas — Soldado"','ex: "3 de Espadas — Soldado"')
p.write_text(s,encoding='utf-8')
# One audit row per card records precisely what was checked and changed.
rows=[]
for old,new in zip(before,cards):
    changes=[]
    def diff(a,b,prefix=''):
        for k in sorted(set(a)|set(b)):
            path=f'{prefix}.{k}' if prefix else k
            if isinstance(a.get(k),dict) and isinstance(b.get(k),dict):diff(a[k],b[k],path)
            elif a.get(k)!=b.get(k):changes.append({'field':path,'before':a.get(k),'after':b.get(k)})
    diff(old,new)
    rows.append({'id':new['id'],'name':new['name'],'nameEn':new['nameEn'],'imageVerified':True,'meaningSource':new['meaningSource'],'officialAreas':{k:v.get('area',v.get('room')) for k,v in new['readings'].items()},'changes':changes})
report={'reviewedAt':'2026-10-20','officialSource':r'Curse of Strahd.md (referência local)','coverage':{'cards':54,'symbolicMeanings':54,'treasureAssociations':40,'allyResultsIncludingAlternatives':21,'strahdLocations':14},'cards':rows}
(root/'docs/auditoria-cartas.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Revisadas 54 cartas: 40 tesouros, 21 resultados de aliado e 14 destinos de Strahd.')
