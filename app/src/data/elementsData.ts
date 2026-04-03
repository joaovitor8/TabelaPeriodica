// Define os tipos exatos de categorias para o autocompletar ajudar você no CSS
export type ElementCategory = 
  | "nonmetal" | "noble-gas" | "alkali-metal" | "alkaline-earth-metal"
  | "metalloid" | "halogen" | "post-transition-metal" | "transition-metal"
  | "lanthanide" | "actinide";

// Define a estrutura obrigatória de cada elemento
export interface ChemicalElement {
  number: number;
  symbol: string;
  name: string;
  category: ElementCategory;
  column: number;
  row: number;
  summary: string;
}


export const elements: ChemicalElement[] = [
  { number: 1, symbol: "H", name: "Hidrogénio", category: "nonmetal", column: 1, row: 1, summary: "O combustível das estrelas e o elemento mais abundante do cosmos." },
  { number: 2, symbol: "He", name: "Hélio", category: "noble-gas", column: 18, row: 1, summary: "Batizado em honra ao Sol (Helios), é o segundo elemento mais comum no universo." },
  { number: 3, symbol: "Li", name: "Lítio", category: "alkali-metal", column: 1, row: 2, summary: "Um dos poucos elementos criados nos primeiros minutos após o Big Bang." },
  { number: 4, symbol: "Be", name: "Berílio", category: "alkaline-earth-metal", column: 2, row: 2, summary: "Raro no universo, é formado através da fragmentação de núcleos mais pesados por raios cósmicos." },
  { number: 5, symbol: "B", name: "Boro", category: "metalloid", column: 13, row: 2, summary: "Um elemento metaloide essencial para a estrutura das plantas e raro na crosta terrestre." },
  { number: 6, symbol: "C", name: "Carbono", category: "nonmetal", column: 14, row: 2, summary: "A base da vida tal como a conhecemos, forjado no coração de estrelas gigantes." },
  { number: 7, symbol: "N", name: "Azoto", category: "nonmetal", column: 15, row: 2, summary: "Dominante na nossa atmosfera, é crucial para a formação do DNA." },
  { number: 8, symbol: "O", name: "Oxigénio", category: "nonmetal", column: 16, row: 2, summary: "O terceiro elemento mais abundante do universo, vital para a respiração e combustão." },
  { number: 9, symbol: "F", name: "Flúor", category: "nonmetal", column: 17, row: 2, summary: "O elemento mais reativo da tabela periódica, extremamente corrosivo no seu estado puro." },
  { number: 10, symbol: "Ne", name: "Néon", category: "noble-gas", column: 18, row: 2, summary: "Famoso pelo seu brilho avermelhado, é o quinto elemento mais comum no universo." },
  { number: 11, symbol: "Na", name: "Sódio", category: "alkali-metal", column: 1, row: 3, summary: "Um metal altamente reativo que, em conjunto com o cloro, forma o sal comum." },
  { number: 12, symbol: "Mg", name: "Magnésio", category: "alkaline-earth-metal", column: 2, row: 3, summary: "Gerado em estrelas massivas através da fusão de hélio com néon." },
  { number: 13, symbol: "Al", name: "Alumínio", category: "post-transition-metal", column: 13, row: 3, summary: "O metal mais abundante na crosta terrestre, conhecido pela sua leveza e resistência." },
  { number: 14, symbol: "Si", name: "Silício", category: "metalloid", column: 14, row: 3, summary: "Fundamental para a computação e eletrónica, é o principal componente da areia." },
  { number: 15, symbol: "P", "name": "Fósforo", category: "nonmetal", column: 15, row: 3, summary: "Conhecido como o 'portador da luz', é essencial para o transporte de energia nas células." },
  { number: 16, symbol: "S", name: "Enxofre", category: "nonmetal", column: 16, row: 3, summary: "Identificado desde a antiguidade, é comum em regiões vulcânicas e fontes termais." },
  { number: 17, symbol: "Cl", name: "Cloro", category: "nonmetal", column: 17, row: 3, summary: "Um gás denso e tóxico, mas vital para manter o equilíbrio de fluidos nos seres vivos." },
  { number: 18, symbol: "Ar", name: "Árgon", category: "noble-gas", column: 18, row: 3, summary: "O terceiro gás mais abundante na atmosfera da Terra, sendo quimicamente inerte." },
  { number: 19, symbol: "K", name: "Potássio", category: "alkali-metal", column: 1, row: 4, summary: "Um metal essencial para o funcionamento dos nervos e do coração." },
  { number: 20, symbol: "Ca", name: "Cálcio", category: "alkaline-earth-metal", column: 2, row: 4, summary: "Espalhado pelo universo através de explosões de supernovas, é o que compõe os nossos ossos." },
  { number: 21, symbol: "Sc", name: "Escândio", category: "transition-metal", column: 3, row: 4, summary: "Um metal leve usado em ligas de alumínio para a indústria aeroespacial e bicicletas de alta performance." },
  { number: 22, symbol: "Ti", name: "Titânio", category: "transition-metal", column: 4, row: 4, summary: "Conhecido por sua extrema resistência e leveza, é forjado durante as explosões de supernovas." },
  { number: 23, symbol: "V", name: "Vanádio", category: "transition-metal", column: 5, row: 4, summary: "Um metal duro que leva o nome da deusa nórdica da beleza, usado para fortalecer o aço." },
  { number: 24, symbol: "Cr", name: "Cromo", category: "transition-metal", column: 6, row: 4, summary: "Notável por seu alto polimento e resistência, é o que dá a cor vibrante aos rubis e esmeraldas." },
  { number: 25, symbol: "Mn", name: "Manganês", category: "transition-metal", column: 7, row: 4, summary: "Essencial para a produção de ferro e aço, pode ser encontrado em grandes nódulos no fundo do oceano." },
  { number: 26, symbol: "Fe", name: "Ferro", category: "transition-metal", column: 8, row: 4, summary: "O elemento mais pesado produzido pela fusão estelar normal; sua criação marca o fim da vida de uma estrela massiva." },
  { number: 27, symbol: "Co", name: "Cobalto", category: "transition-metal", column: 9, row: 4, summary: "Famoso pelo seu tom de azul profundo em pigmentos antigos, é crucial para baterias de íons de lítio modernas." },
  { number: 28, symbol: "Ni", name: "Níquel", category: "transition-metal", column: 10, row: 4, summary: "Um dos componentes centrais do núcleo da Terra e de grande parte dos meteoritos que caem no nosso planeta." },
  { number: 29, symbol: "Cu", name: "Cobre", category: "transition-metal", column: 11, row: 4, summary: "Um dos primeiros metais dominados pela humanidade, é um excelente condutor elétrico." },
  { number: 30, symbol: "Zn", name: "Zinco", category: "transition-metal", column: 12, row: 4, summary: "Vital para o sistema imunológico biológico e extensivamente usado para proteger o aço contra a corrosão." },
  { number: 31, symbol: "Ga", name: "Gálio", category: "post-transition-metal", column: 13, row: 4, summary: "Um metal intrigante que possui um ponto de fusão tão baixo que derrete na palma da mão humana." },
  { number: 32, symbol: "Ge", name: "Germânio", category: "metalloid", column: 14, row: 4, summary: "Um semicondutor brilhante crucial para o desenvolvimento de fibras ópticas e painéis solares para satélites." },
  { number: 33, symbol: "As", name: "Arsênio", category: "metalloid", column: 15, row: 4, summary: "Historicamente famoso como um elemento letal, hoje é utilizado na fabricação de semicondutores especiais." },
  { number: 34, symbol: "Se", name: "Selênio", category: "nonmetal", column: 16, row: 4, summary: "Batizado em homenagem à Lua (Selene), possui propriedades fotovoltaicas e é sensível à luz." },
  { number: 35, symbol: "Br", name: "Bromo", category: "halogen", column: 17, row: 4, summary: "Um dos raros elementos que é líquido à temperatura ambiente, emitindo um vapor avermelhado denso." },
  { number: 36, symbol: "Kr", name: "Criptônio", category: "noble-gas", column: 18, row: 4, summary: "Um gás nobre inerte que emite um brilho esbranquiçado agudo, muito usado em flashes fotográficos de alta velocidade." },
  { number: 37, symbol: "Rb", name: "Rubídio", category: "alkali-metal", column: 1, row: 5, summary: "Altamente reativo, inflama-se espontaneamente ao entrar em contato com o ar e a água." },
  { number: 38, symbol: "Sr", name: "Estrôncio", category: "alkaline-earth-metal", column: 2, row: 5, summary: "Um metal macio que queima com uma chama vermelha carmesim intensa, sendo a estrela dos fogos de artifício." },
  { number: 39, symbol: "Y", name: "Ítrio", category: "transition-metal", column: 3, row: 5, summary: "Fundamental para a criação de LEDs brancos e lasers, recebeu o nome da pequena vila sueca de Ytterby." },
  { number: 40, symbol: "Zr", name: "Zircônio", category: "transition-metal", column: 4, row: 5, summary: "Altamente resistente a temperaturas extremas, seu óxido é frequentemente usado como um substituto brilhante para o diamante." },
  { number: 41, symbol: "Nb", name: "Nióbio", category: "transition-metal", column: 5, row: 5, summary: "Utilizado para criar superligas de aço incrivelmente fortes para motores a jato e foguetes." },
  { number: 42, symbol: "Mo", name: "Molibdênio", category: "transition-metal", column: 6, row: 5, summary: "Um metal que suporta calor extremo sem se expandir muito, essencial para a exploração espacial e processos biológicos." },
  { number: 43, symbol: "Tc", name: "Tecnécio", category: "transition-metal", column: 7, row: 5, summary: "O primeiro elemento a ser produzido artificialmente pelo ser humano; não possui isótopos estáveis." },
  { number: 44, symbol: "Ru", name: "Rutênio", category: "transition-metal", column: 8, row: 5, summary: "Um metal raro, endurecedor formidável, muito empregado em contatos elétricos de alta resistência ao desgaste." },
  { number: 45, symbol: "Rh", name: "Ródio", category: "transition-metal", column: 9, row: 5, summary: "Um dos metais mais valiosos e reflexivos da Terra, vital para catalisadores automotivos de redução de emissões." },
  { number: 46, symbol: "Pd", name: "Paládio", category: "transition-metal", column: 10, row: 5, summary: "Possui a capacidade quase mágica de absorver hidrogênio gasoso em até 900 vezes o seu próprio volume." },
  { number: 47, symbol: "Ag", name: "Prata", category: "transition-metal", column: 11, row: 5, summary: "Nasce de colisões de estrelas de nêutrons e detém a coroa da maior condutividade elétrica entre todos os elementos." },
  { number: 48, symbol: "Cd", name: "Cádmio", category: "transition-metal", column: 12, row: 5, summary: "Um metal tóxico e maleável, historicamente importante para a fabricação de pigmentos amarelos vibrantes e baterias." },
  { number: 49, symbol: "In", name: "Índio", category: "post-transition-metal", column: 13, row: 5, summary: "Um metal tão macio que pode ser cortado com uma faca, é a espinha dorsal invisível por trás de todas as telas sensíveis ao toque." },
  { number: 50, symbol: "Sn", name: "Estanho", category: "post-transition-metal", column: 14, row: 5, summary: "Conhecido desde a antiguidade, quando combinado com o cobre no fogo, deu origem à Era do Bronze." },
  { number: 51, symbol: "Sb", name: "Antimônio", category: "metalloid", column: 15, row: 5, summary: "Conhecido desde a antiguidade para cosméticos, hoje é usado para endurecer ligas de chumbo." },
  { number: 52, symbol: "Te", name: "Telúrio", category: "metalloid", column: 16, row: 5, summary: "Um metaloide raro com brilho prateado estelar, muito utilizado na fabricação de painéis solares." },
  { number: 53, symbol: "I", name: "Iodo", category: "halogen", column: 17, row: 5, summary: "Quando aquecido, não derrete: sublima diretamente num deslumbrante gás violeta e denso." },
  { number: 54, symbol: "Xe", name: "Xenônio", category: "noble-gas", column: 18, row: 5, summary: "Gás nobre pesado com um brilho azulado, é o combustível principal dos propulsores iônicos de naves espaciais." },
  { number: 55, symbol: "Cs", name: "Césio", category: "alkali-metal", column: 1, row: 6, summary: "Tão reativo que explode na água e tão exato que dita a passagem do tempo nos relógios atômicos mundiais." },
  { number: 56, symbol: "Ba", name: "Bário", category: "alkaline-earth-metal", column: 2, row: 6, summary: "Altamente reativo com o ar, é o elemento responsável por dar a cor verde brilhante aos fogos de artifício." },
  
  /* LANTANÍDEOS (Terras Raras) - Movidos para a linha 8 do Grid */
  { number: 57, symbol: "La", name: "Lantânio", category: "lanthanide", column: 4, row: 8, summary: "O pioneiro das terras raras, é crucial para criar as lentes de altíssima precisão dos telescópios espaciais." },
  { number: 58, symbol: "Ce", name: "Cério", category: "lanthanide", column: 5, row: 8, summary: "O mais abundante das terras raras, forjado no coração ardente da morte de estrelas gigantes." },
  { number: 59, symbol: "Pr", name: "Praseodímio", category: "lanthanide", column: 6, row: 8, summary: "Cria um escudo quase mágico contra a luz, sendo usado nos óculos de proteção de soldadores e em projetores de cinema." },
  { number: 60, symbol: "Nd", name: "Neodímio", category: "lanthanide", column: 7, row: 8, summary: "A base dos ímãs permanentes mais poderosos do mundo, essenciais para motores elétricos e discos rígidos." },
  { number: 61, symbol: "Pm", name: "Promécio", category: "lanthanide", column: 8, row: 8, summary: "Altamente radioativo e raro, carrega o nome do titã mitológico que roubou o fogo dos deuses para entregá-lo aos mortais." },
  { number: 62, symbol: "Sm", name: "Samário", category: "lanthanide", column: 9, row: 8, summary: "Mantém a sua força magnética mesmo em temperaturas extremas, sendo o favorito para missões em alto espaço." },
  { number: 63, symbol: "Eu", name: "Európio", category: "lanthanide", column: 10, row: 8, summary: "O elemento mais reativo da sua família, é a chave para gerar as cores vermelha e azul em telas e monitores." },
  { number: 64, symbol: "Gd", name: "Gadolínio", category: "lanthanide", column: 11, row: 8, summary: "Possui propriedades magnéticas únicas e é usado como contraste em ressonâncias para revelar o invisível no corpo humano." },
  { number: 65, symbol: "Tb", name: "Térbio", category: "lanthanide", column: 12, row: 8, summary: "Consegue mudar fisicamente a sua própria forma quando exposto a um campo magnético, usado em sonares de alta tecnologia." },
  { number: 66, symbol: "Dy", name: "Disprósio", category: "lanthanide", column: 13, row: 8, summary: "O seu nome significa 'difícil de obter'; atua como uma 'esponja de nêutrons' para controlar reatores nucleares." },
  { number: 67, symbol: "Ho", name: "Hólmio", category: "lanthanide", column: 14, row: 8, summary: "Detém o maior momento magnético natural de todos os elementos, capaz de concentrar e domar campos magnéticos artificiais." },
  { number: 68, symbol: "Er", name: "Érbio", category: "lanthanide", column: 15, row: 8, summary: "Os seus íons rosados são usados para amplificar sinais de luz em cabos de fibra óptica que cruzam os oceanos da Terra." },
  { number: 69, symbol: "Tm", name: "Túlio", category: "lanthanide", column: 16, row: 8, summary: "Um metal extremamente raro forjado em supernovas, hoje esculpido em lasers cirúrgicos de precisão quase microscópica." },
  { number: 70, symbol: "Yb", name: "Itérbio", category: "lanthanide", column: 17, row: 8, summary: "Usado na construção de relógios atômicos experimentais que medem com exatidão as distorções no próprio espaço-tempo." },
  { number: 71, symbol: "Lu", name: "Lutécio", category: "lanthanide", column: 18, row: 8, summary: "O último da sua série, é um metal denso e raro, frequentemente usado para calcular a idade de meteoritos caídos na Terra." },

  /* De volta à tabela principal - Linha 6 */
  { number: 72, symbol: "Hf", name: "Háfnio", category: "transition-metal", column: 4, row: 6, summary: "Excelente absorvedor de nêutrons, é a principal linha de defesa nas barras de controle de reatores nucleares de submarinos." },
  { number: 73, symbol: "Ta", name: "Tântalo", category: "transition-metal", column: 5, row: 6, summary: "Batizado em honra ao rei mitológico, este metal não se degrada, sendo o herói invisível dentro dos capacitores do seu celular." },
  { number: 74, symbol: "W", name: "Tungstênio", category: "transition-metal", column: 6, row: 6, summary: "Possui o ponto de fusão mais alto de todos os metais do universo, aguentando o calor extremo das tubeiras de foguetes." },
  { number: 75, symbol: "Re", name: "Rênio", category: "transition-metal", column: 7, row: 6, summary: "Um dos elementos mais raros da crosta terrestre, suporta o inferno de calor dentro dos motores a jato das aeronaves modernas." },
  { number: 76, symbol: "Os", name: "Ósmio", category: "transition-metal", column: 8, row: 6, summary: "O elemento natural mais denso que existe; uma bola de bilhar feita dele pesaria tanto quanto uma bola de boliche." },
  { number: 77, symbol: "Ir", name: "Irídio", category: "transition-metal", column: 9, row: 6, summary: "O metal que reveste a crosta da Terra como a grande assinatura química do asteroide gigante que extinguiu os dinossauros." },
  { number: 78, symbol: "Pt", name: "Platina", category: "transition-metal", column: 10, row: 6, summary: "Forjada em colisões cataclísmicas entre estrelas de nêutrons, é um dos metais mais preciosos e puros conhecidos." },
  { number: 79, symbol: "Au", name: "Ouro", category: "transition-metal", column: 11, row: 6, summary: "O metal eterno. Absolutamente todo o ouro existente no nosso planeta nasceu das cinzas da morte explosiva de antigas estrelas." },
  { number: 80, symbol: "Hg", name: "Mercúrio", category: "transition-metal", column: 12, row: 6, summary: "O único metal que é líquido à temperatura ambiente; hipnotizante, porém altamente tóxico." },
  { number: 81, symbol: "Tl", name: "Tálio", category: "post-transition-metal", column: 13, row: 6, summary: "Historicamente apelidado de 'o veneno do envenenador', hoje as suas emissões no espaço ajudam a estudar o nascimento das estrelas." },
  { number: 82, symbol: "Pb", name: "Chumbo", category: "post-transition-metal", column: 14, row: 6, summary: "Pesado e denso, é o destino final estável e silencioso de muitas cadeias de decaimento radioativo do cosmos." },
  { number: 83, symbol: "Bi", name: "Bismuto", category: "post-transition-metal", column: 15, row: 6, summary: "Cristaliza-se em padrões geométricos hipnotizantes e iridescentes, parecendo uma verdadeira relíquia alienígena." },
  { number: 84, symbol: "Po", name: "Polônio", category: "metalloid", column: 16, row: 6, summary: "Um metal altamente radioativo que brilha em azul na escuridão, descoberto por Marie Curie e nomeado em honra à Polônia." },
  { number: 85, symbol: "At", name: "Astato", category: "halogen", column: 17, row: 6, summary: "O elemento de ocorrência natural mais raro da Terra; estima-se que existam apenas gramas dele em todo o planeta a qualquer momento." },
  { number: 86, symbol: "Rn", name: "Radônio", category: "noble-gas", column: 18, row: 6, summary: "Um gás nobre pesado, invisível e radioativo, que emana naturalmente das rochas mais profundas da crosta terrestre." },

  /* Tabela Principal - Linha 7 (Onde mora o perigo radioativo) */
  { number: 87, symbol: "Fr", name: "Frâncio", category: "alkali-metal", column: 1, row: 7, summary: "Tão incrivelmente instável que uma amostra visível dele evaporaria instantaneamente devido ao seu próprio calor radioativo." },
  { number: 88, symbol: "Ra", name: "Rádio", category: "alkaline-earth-metal", column: 2, row: 7, summary: "O seu brilho verde fantasmagórico iluminava antigos relógios de pulso antes de a humanidade compreender a sua força letal." },

  /* ACTINÍDEOS (Série radioativa) - Movidos para a linha 9 do Grid */
  { number: 89, symbol: "Ac", name: "Actínio", category: "actinide", column: 4, row: 9, summary: "O ancestral que dá nome à sua família radioativa, emitindo um suave brilho azul pálido na completa escuridão." },
  { number: 90, symbol: "Th", name: "Tório", category: "actinide", column: 5, row: 9, summary: "Batizado em homenagem ao deus nórdico do trovão, carrega tanta energia latente que é estudado como a energia nuclear do futuro." },
  { number: 91, symbol: "Pa", name: "Protactínio", category: "actinide", column: 6, row: 9, summary: "Extremamente tóxico e raro, o seu nome significa literalmente 'pai do actínio' na cadeia de decaimento radioativo." },
  { number: 92, symbol: "U", name: "Urânio", category: "actinide", column: 7, row: 9, summary: "O titã da era atômica, cujos átomos instáveis foram forjados há bilhões de anos, antes mesmo de o nosso sistema solar existir." },
  { number: 93, symbol: "Np", name: "Netúnio", category: "actinide", column: 8, row: 9, summary: "O primeiro elemento transurânico criado, que levou a tabela periódica para além da fronteira do Urânio (assim como o planeta Netuno)." },
  { number: 94, symbol: "Pu", name: "Plutônio", category: "actinide", column: 9, row: 9, summary: "Nasce artificialmente em reatores; tem energia suficiente para alimentar as sondas espaciais que viajam para fora da nossa galáxia." },
  { number: 95, symbol: "Am", name: "Amerício", category: "actinide", column: 10, row: 9, summary: "Embora sintético e radioativo, é o guarda silencioso da sua casa, sendo a tecnologia central dentro dos detectores de fumo." },
  { number: 96, symbol: "Cm", name: "Cúrio", category: "actinide", column: 11, row: 9, summary: "Criado em laboratório e nomeado em homenagem a Marie e Pierre Curie, emite tanta radioatividade que brilha num tom púrpura." },
  { number: 97, symbol: "Bk", name: "Berquélio", category: "actinide", column: 12, row: 9, summary: "Forjado em ciclotrões, o seu tempo de vida é tão curto que é quase exclusivamente utilizado para pesquisa nuclear teórica." },
  { number: 98, symbol: "Cf", name: "Califórnio", category: "actinide", column: 13, row: 9, summary: "Uma autêntica 'metralhadora de nêutrons', usado em radares terrestres potentes para encontrar jazidas de ouro e prata." },
  { number: 99, symbol: "Es", name: "Einstênio", category: "actinide", column: 14, row: 9, summary: "Descoberto pela primeira vez nas cinzas trágicas da primeira detonação termonuclear, presta homenagem a Albert Einstein." },
  { number: 100, symbol: "Fm", name: "Férmio", category: "actinide", column: 15, row: 9, summary: "A fronteira final: é o último elemento pesado que pode ser construído apenas atirando nêutrons contra elementos mais leves." },
  { number: 101, symbol: "Md", name: "Mendelévio", category: "actinide", column: 16, row: 9, summary: "Nomeado em homenagem a Dmitri Mendeleiev, o brilhante arquiteto que desenhou a primeira Tabela Periódica." },
  { number: 102, symbol: "No", name: "Nobélio", category: "actinide", column: 17, row: 9, summary: "Homenageia Alfred Nobel; as suas propriedades só podem ser estudadas átomo por átomo antes que se desintegre." },
  { number: 103, symbol: "Lr", name: "Laurêncio", category: "actinide", column: 18, row: 9, summary: "O último dos actinídeos. Marca o fim da era dos elementos radioativos que 'flutuam' abaixo da tabela principal." },

  /* De volta à tabela principal - Linha 7 (Os Superpesados) */
  { number: 104, symbol: "Rf", name: "Rutherfórdio", category: "transition-metal", column: 4, row: 7, summary: "O primeiro elemento superpesado inteiramente sintético, dando início à fronteira extrema da física nuclear." },
  { number: 105, symbol: "Db", name: "Dúbnio", category: "transition-metal", column: 5, row: 7, summary: "Um símbolo da Guerra Fria científica, descoberto quase em simultâneo por laboratórios americanos e soviéticos." },
  { number: 106, symbol: "Sg", name: "Seabórgio", category: "transition-metal", column: 6, row: 7, summary: "Único elemento nomeado em homenagem a uma pessoa viva na época, o lendário químico nuclear Glenn Seaborg." },
  { number: 107, symbol: "Bh", name: "Bóhrio", category: "transition-metal", column: 7, row: 7, summary: "Homenageia Niels Bohr, o físico que nos ajudou a decifrar a estrutura quântica que dá origem a todo o cosmos." },
  { number: 108, symbol: "Hs", name: "Hássio", category: "transition-metal", column: 8, row: 7, summary: "Tão incrivelmente pesado que a sua própria existência desafia os limites da força que mantém os núcleos atómicos unidos." },
  { number: 109, symbol: "Mt", name: "Meitnério", category: "transition-metal", column: 9, row: 7, summary: "Homenageia Lise Meitner, a brilhante e muitas vezes esquecida mente por trás da descoberta da fissão nuclear." },
  { number: 110, symbol: "Ds", name: "Darmstádtio", category: "transition-metal", column: 10, row: 7, summary: "Criado esmagando isótopos de chumbo e níquel quase à velocidade da luz num acelerador de partículas." },
  { number: 111, symbol: "Rg", name: "Roentgênio", category: "transition-metal", column: 11, row: 7, summary: "Nomeado em homenagem ao descobridor dos raios-X, decai em frações de segundo libertando uma energia avassaladora." },
  { number: 112, symbol: "Cn", name: "Copernício", category: "transition-metal", column: 12, row: 7, summary: "Dedicado a Nicolau Copérnico, o astrónomo revolucionário que colocou o Sol no centro do nosso sistema solar." },
  { number: 113, symbol: "Nh", name: "Nihônio", category: "post-transition-metal", column: 13, row: 7, summary: "O primeiro elemento descoberto na Ásia (Japão); existe apenas nos relatórios e poeira de colisões atómicas." },
  { number: 114, symbol: "Fl", name: "Fleróvio", category: "post-transition-metal", column: 14, row: 7, summary: "Habita a fronteira da teórica 'ilha de estabilidade', onde cientistas sonham encontrar superpesados que não decaiam imediatamente." },
  { number: 115, symbol: "Mc", name: "Moscóvio", category: "post-transition-metal", column: 15, row: 7, summary: "Um elemento efémero e ultra-denso, forjado pelo choque violento de feixes de cálcio contra alvos de amerício." },
  { number: 116, symbol: "Lv", name: "Livermório", category: "post-transition-metal", column: 16, row: 7, summary: "Dura apenas milissegundos, revelando os seus segredos unicamente através das 'cicatrizes' de radiação que deixa ao decair." },
  { number: 117, symbol: "Ts", name: "Tenessino", category: "halogen", column: 17, row: 7, summary: "O halogéneo mais pesado já criado, expandindo radicalmente as fronteiras do que é fisicamente possível construir no universo." },
  { number: 118, symbol: "Og", name: "Oganessônio", category: "noble-gas", column: 18, row: 7, summary: "O pináculo da criação humana. O elemento mais pesado de todos, fechando a sétima linha e completando a Tabela Periódica atual." }
];
