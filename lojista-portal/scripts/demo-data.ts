/**
 * Dados fictícios para vitrine demo do Portal Lojista.
 * Remoção: slugs com prefixo `demo-` e e-mails `@portaldolojista.demo`.
 */

export const DEMO_CITY = "Santa Cruz do Sul";
export const DEMO_STATE = "RS";
export const DEMO_EMAIL_DOMAIN = "portaldolojista.demo";

/** Senha compartilhada das contas demo (apenas ambiente de demonstração). */
export const DEMO_SEED_PASSWORD = "DemoPortal2026!";

export type DemoProduct = {
  nome: string;
  descricao: string;
  preco: number;
  foto_url: string;
  ordem: number;
};

export type DemoStore = {
  slug: string;
  nome_fantasia: string;
  razao_social: string;
  categoriaSlug: string;
  bairro: string;
  endereco: string;
  numero: string;
  cep: string;
  slogan: string;
  descricao: string;
  telefone: string;
  whatsapp: string;
  site: string;
  instagram: string;
  logo_url: string;
  capa_url: string;
  destaque: boolean;
  produtos: DemoProduct[];
};

function emailForSlug(slug: string): string {
  return `${slug}@${DEMO_EMAIL_DOMAIN}`;
}

const U = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const DEMO_STORES: DemoStore[] = [
  {
    slug: "demo-boutique-luar",
    nome_fantasia: "Boutique Luar do Campo",
    razao_social: "Luar do Campo Comércio de Vestuário Ltda",
    categoriaSlug: "moda",
    bairro: "Centro",
    endereco: "Rua das Acácias",
    numero: "128",
    cep: "96810-100",
    slogan: "Moda feminina com alma de bairro",
    descricao:
      "Peças selecionadas para o dia a dia e ocasiões especiais. Atendimento personalizado e novidades toda semana no coração de Santa Cruz do Sul.",
    telefone: "(51) 3302-1101",
    whatsapp: "(51) 99102-3401",
    site: "https://boutiqueluar.demo.local",
    instagram: "@boutiqueluardocamp",
    logo_url: U("photo-1490481651871-ab68de25d43d", 400),
    capa_url: U("photo-1441986300917-64674bd600d8", 1200),
    destaque: true,
    produtos: [
      {
        nome: "Vestido Midi Aurora",
        descricao: "Tecido leve, caimento fluido. Ideal para o verão gaúcho.",
        preco: 189.9,
        foto_url: U("photo-1595777457583-95e059d581b8", 600),
        ordem: 1,
      },
      {
        nome: "Blusa Linho Brisa",
        descricao: "Manga bufante e gola V. Disponível em cores neutras.",
        preco: 79.9,
        foto_url: U("photo-1434389677669-e08b4cac3105", 600),
        ordem: 2,
      },
      {
        nome: "Calça Wide Leg Areia",
        descricao: "Cintura alta e tecido confortável para o dia a dia.",
        preco: 129.9,
        foto_url: U("photo-1509631179647-0177331693ae", 600),
        ordem: 3,
      },
      {
        nome: "Bolsa Tiracolo Couro Sintético",
        descricao: "Compartimento principal e alça ajustável.",
        preco: 99.9,
        foto_url: U("photo-1548036328-c9fa89d128fa", 600),
        ordem: 4,
      },
      {
        nome: "Kimono Estampado Floral",
        descricao: "Sobreposição versátil para looks casuais.",
        preco: 69.9,
        foto_url: U("photo-1483985988355-763728f17f2f", 600),
        ordem: 5,
      },
      {
        nome: "Cinto Fino Dourado",
        descricao: "Acessório elegante para compor produções.",
        preco: 39.9,
        foto_url: U("photo-1624222247344-550fb60583fd", 600),
        ordem: 6,
      },
    ],
  },
  {
    slug: "demo-padaria-horizonte",
    nome_fantasia: "Padaria Horizonte",
    razao_social: "Padaria Horizonte Alimentos Ltda",
    categoriaSlug: "alimentacao",
    bairro: "Jardim Primavera",
    endereco: "Av. Horizonte",
    numero: "450",
    cep: "96815-200",
    slogan: "O pão quentinho que o bairro confia",
    descricao:
      "Pães artesanais, salgados assados na hora e doces caseiros. Café da manhã completo de terça a domingo.",
    telefone: "(51) 3303-2202",
    whatsapp: "(51) 99203-4502",
    site: "https://padariahorizonte.demo.local",
    instagram: "@padariahorizonte_sc",
    logo_url: U("photo-1509440159596-0249088772ff", 400),
    capa_url: U("photo-1608198093002-47d5574f5715", 1200),
    destaque: true,
    produtos: [
      {
        nome: "Pão Francês (dúzia)",
        descricao: "Assado várias vezes ao dia. Crocante por fora, macio por dentro.",
        preco: 18.0,
        foto_url: U("photo-1549931319-a545dcf3bc73", 600),
        ordem: 1,
      },
      {
        nome: "Coxinha de Frango (un.)",
        descricao: "Recheio cremoso e massa sequinha.",
        preco: 7.5,
        foto_url: U("photo-1617196034796-aa61a3bbffc8", 600),
        ordem: 2,
      },
      {
        nome: "Empada de Palmito",
        descricao: "Massa amanteigada com recheio especial da casa.",
        preco: 8.9,
        foto_url: U("photo-1601050690117-3f3eaadae1f2", 600),
        ordem: 3,
      },
      {
        nome: "Bolo de Cenoura (fatia)",
        descricao: "Com cobertura de chocolate meio amargo.",
        preco: 9.9,
        foto_url: U("photo-1578985545062-69928b1d9587", 600),
        ordem: 4,
      },
      {
        nome: "Café Expresso 50ml",
        descricao: "Blend especial torrado na região.",
        preco: 5.0,
        foto_url: U("photo-1514431521087-1eac29ef2940", 600),
        ordem: 5,
      },
      {
        nome: "Suco Natural Laranja 300ml",
        descricao: "Espremido na hora.",
        preco: 8.0,
        foto_url: U("photo-1621506289937-a8e4df240d0b", 600),
        ordem: 6,
      },
      {
        nome: "Torta de Limão (fatia)",
        descricao: "Base crocante e creme cítrico equilibrado.",
        preco: 12.9,
        foto_url: U("photo-1519915028121-7d3443d24b0f", 600),
        ordem: 7,
      },
      {
        nome: "Cesta Café da Manhã (2 pessoas)",
        descricao: "Pães, frios, frutas, suco e café. Encomende com 24h de antecedência.",
        preco: 49.9,
        foto_url: U("photo-1493777901214-1a49b0a9f0e2", 600),
        ordem: 8,
      },
    ],
  },
  {
    slug: "demo-espaco-bela-vila",
    nome_fantasia: "Espaço Bela Vila",
    razao_social: "Bela Vila Estética e Beleza Ltda",
    categoriaSlug: "beleza-saude",
    bairro: "Vila Nova",
    endereco: "Rua Harmonia",
    numero: "72",
    cep: "96820-300",
    slogan: "Beleza, bem-estar e autoestima no seu bairro",
    descricao:
      "Salão completo com corte, coloração, manicure e tratamentos capilares. Ambiente acolhedor e profissionais experientes.",
    telefone: "(51) 3304-3303",
    whatsapp: "(51) 99304-5603",
    site: "https://belavila.demo.local",
    instagram: "@espacobelavila",
    logo_url: U("photo-1560066984-138dadb4c035", 400),
    capa_url: U("photo-1522337360788-8b13dee7a37e", 1200),
    destaque: false,
    produtos: [
      {
        nome: "Corte Feminino",
        descricao: "Inclui lavagem, finalização e consultoria de estilo.",
        preco: 65.0,
        foto_url: U("photo-1522337360788-8b13dee7a37e", 600),
        ordem: 1,
      },
      {
        nome: "Corte Masculino",
        descricao: "Máquina e tesoura com acabamento premium.",
        preco: 45.0,
        foto_url: U("photo-1621605815977-fbc98d665033", 600),
        ordem: 2,
      },
      {
        nome: "Escova Modeladora",
        descricao: "Brushing com proteção térmica.",
        preco: 55.0,
        foto_url: U("photo-1519699047748-de8e457a634e", 600),
        ordem: 3,
      },
      {
        nome: "Manicure Completa",
        descricao: "Cutículas, esmaltação e hidratação.",
        preco: 35.0,
        foto_url: U("photo-1604654894610-6f2d3e2e1f4e", 600),
        ordem: 4,
      },
      {
        nome: "Hidratação Capilar Profunda",
        descricao: "Tratamento de 45 minutos com máscara reparadora.",
        preco: 89.9,
        foto_url: U("photo-1527799820374-dcf8d9a5d0cb", 600),
        ordem: 5,
      },
    ],
  },
  {
    slug: "demo-lar-harmonia",
    nome_fantasia: "Lar & Harmonia Decorações",
    razao_social: "Lar e Harmonia Casa e Decoração Ltda",
    categoriaSlug: "casa-decoracao",
    bairro: "Parque das Flores",
    endereco: "Rua dos Lírios",
    numero: "310",
    cep: "96825-400",
    slogan: "Transforme cada canto da sua casa",
    descricao:
      "Móveis, cortinas, tapetes e objetos decorativos. Consultoria gratuita para ambientes residenciais.",
    telefone: "(51) 3305-4404",
    whatsapp: "(51) 99405-6704",
    site: "https://larharmonia.demo.local",
    instagram: "@larharmonia_sc",
    logo_url: U("photo-1616486338812-3dadae4b4ace", 400),
    capa_url: U("photo-1618221195710-dd57527530ac", 1200),
    destaque: false,
    produtos: [
      {
        nome: "Almofada Veludo 45x45",
        descricao: "Tecido macio, zíper invisível. Cores assortidas.",
        preco: 49.9,
        foto_url: U("photo-1584100936595-6726e2439c65", 600),
        ordem: 1,
      },
      {
        nome: "Luminária de Mesa Nordic",
        descricao: "Base em madeira clara e cúpula em linho.",
        preco: 129.0,
        foto_url: U("photo-1507473889651-0e2cb1c4deaf", 600),
        ordem: 2,
      },
      {
        nome: "Tapete Sisal Natural 1,40m",
        descricao: "Ideal para sala e varanda gourmet.",
        preco: 219.0,
        foto_url: U("photo-1600210492493-0946911129ea", 600),
        ordem: 3,
      },
      {
        nome: "Kit Quadros Abstratos (3 peças)",
        descricao: "Moldura em MDF e impressão artística.",
        preco: 159.9,
        foto_url: U("photo-1513519245088-0e12902e35ca", 600),
        ordem: 4,
      },
      {
        nome: "Vaso Cerâmica Terracota G",
        descricao: "Peça artesanal para plantas de médio porte.",
        preco: 89.0,
        foto_url: U("photo-1485955900006-10f4d324d411", 600),
        ordem: 5,
      },
      {
        nome: "Cortina Blackout 2,80m",
        descricao: "Bloqueio de luz e isolamento térmico.",
        preco: 189.0,
        foto_url: U("photo-1615529328331-f8917597711f", 600),
        ordem: 6,
      },
    ],
  },
  {
    slug: "demo-pixel-byte",
    nome_fantasia: "Pixel & Byte Informática",
    razao_social: "Pixel e Byte Tecnologia Ltda",
    categoriaSlug: "tecnologia",
    bairro: "Centro",
    endereco: "Rua Sete de Setembro",
    numero: "890",
    cep: "96810-500",
    slogan: "Tecnologia acessível, suporte de verdade",
    descricao:
      "Venda e assistência de notebooks, smartphones e periféricos. Formatação, backup e consultoria para pequenos negócios.",
    telefone: "(51) 3306-5505",
    whatsapp: "(51) 99506-7805",
    site: "https://pixelbyte.demo.local",
    instagram: "@pixelbyte_sc",
    logo_url: U("photo-1517694712202-14dd9538aa97", 400),
    capa_url: U("photo-1498050108023-c5249f4df085", 1200),
    destaque: false,
    produtos: [
      {
        nome: 'Notebook 14" 8GB/256GB SSD',
        descricao: "Ideal para estudos e home office. Garantia de 12 meses.",
        preco: 2499.0,
        foto_url: U("photo-1496181133206-80ce9b88a853", 600),
        ordem: 1,
      },
      {
        nome: "Mouse Sem Fio Ergonômico",
        descricao: "Conforto para longas jornadas de trabalho.",
        preco: 79.9,
        foto_url: U("photo-1527814050087-3793815479db", 600),
        ordem: 2,
      },
      {
        nome: "Teclado Mecânico RGB",
        descricao: "Switches silenciosos e layout ABNT2.",
        preco: 249.0,
        foto_url: U("photo-1587829741301-dc798b83add3", 600),
        ordem: 3,
      },
      {
        nome: "Fone Bluetooth Over-Ear",
        descricao: "Até 30h de bateria e cancelamento passivo de ruído.",
        preco: 189.9,
        foto_url: U("photo-1505740420928-5e560c06d30e", 600),
        ordem: 4,
      },
      {
        nome: "Formatação + Instalação Windows",
        descricao: "Backup de arquivos essenciais incluso.",
        preco: 120.0,
        foto_url: U("photo-1555066931-4365d14bab8c", 600),
        ordem: 5,
      },
      {
        nome: "Cabo USB-C 2m Reforçado",
        descricao: "Suporte a carga rápida.",
        preco: 29.9,
        foto_url: U("photo-1625948515291-69613ac8c64e", 600),
        ordem: 6,
      },
      {
        nome: "Suporte Articulado Monitor",
        descricao: "Compatível com telas de 17 a 32 polegadas.",
        preco: 99.0,
        foto_url: U("photo-1527443224154-c4a3942d3acf", 600),
        ordem: 7,
      },
    ],
  },
  {
    slug: "demo-oficina-rota-certa",
    nome_fantasia: "Oficina Rota Certa",
    razao_social: "Rota Certa Serviços Automotivos Ltda",
    categoriaSlug: "automotivo",
    bairro: "Industrial",
    endereco: "Av. Industrial",
    numero: "1550",
    cep: "96830-600",
    slogan: "Seu carro em boas mãos, sem surpresa na conta",
    descricao:
      "Mecânica geral, revisão preventiva, troca de óleo e alinhamento. Orçamento transparente e agendamento pelo WhatsApp.",
    telefone: "(51) 3307-6606",
    whatsapp: "(51) 99607-8906",
    site: "https://rotacerta.demo.local",
    instagram: "@oficinarotacerta",
    logo_url: U("photo-1486262715619-67b85e0b08d3", 400),
    capa_url: U("photo-1487754180451-c747fba580c3", 1200),
    destaque: false,
    produtos: [
      {
        nome: "Troca de Óleo + Filtro",
        descricao: "Óleo semissintético e filtro de qualidade.",
        preco: 149.0,
        foto_url: U("photo-1486262715619-67b85e0b08d3", 600),
        ordem: 1,
      },
      {
        nome: "Alinhamento e Balanceamento",
        descricao: "Equipamento computadorizado de última geração.",
        preco: 120.0,
        foto_url: U("photo-1619642751034-765df6917ece", 600),
        ordem: 2,
      },
      {
        nome: "Revisão Preventiva Completa",
        descricao: "Checklist de 40 itens com relatório digital.",
        preco: 289.0,
        foto_url: U("photo-1625047509168-a702cb8d3270", 600),
        ordem: 3,
      },
      {
        nome: "Diagnóstico Eletrônico",
        descricao: "Leitura de códigos e laudo técnico.",
        preco: 80.0,
        foto_url: U("photo-1492144534655-ae79c964c9d7", 600),
        ordem: 4,
      },
    ],
  },
];

export function demoEmailForStore(slug: string): string {
  return emailForSlug(slug);
}

export const DEMO_SLUG_PREFIX = "demo-";
