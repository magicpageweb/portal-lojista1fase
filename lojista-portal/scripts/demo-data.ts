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

import { demoCapaPath, demoLogoPath, demoProdutoPath } from "./demo-images";

function emailForSlug(slug: string): string {
  return `${slug}@${DEMO_EMAIL_DOMAIN}`;
}

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
    logo_url: demoLogoPath("demo-boutique-luar"),
    capa_url: demoCapaPath("demo-boutique-luar"),
    destaque: true,
    produtos: [
      {
        nome: "Vestido Midi Aurora",
        descricao: "Tecido leve, caimento fluido. Ideal para o verão gaúcho.",
        preco: 189.9,
        foto_url: demoProdutoPath("demo-boutique-luar", 1),
        ordem: 1,
      },
      {
        nome: "Blusa Linho Brisa",
        descricao: "Manga bufante e gola V. Disponível em cores neutras.",
        preco: 79.9,
        foto_url: demoProdutoPath("demo-boutique-luar", 2),
        ordem: 2,
      },
      {
        nome: "Calça Wide Leg Areia",
        descricao: "Cintura alta e tecido confortável para o dia a dia.",
        preco: 129.9,
        foto_url: demoProdutoPath("demo-boutique-luar", 3),
        ordem: 3,
      },
      {
        nome: "Bolsa Tiracolo Couro Sintético",
        descricao: "Compartimento principal e alça ajustável.",
        preco: 99.9,
        foto_url: demoProdutoPath("demo-boutique-luar", 4),
        ordem: 4,
      },
      {
        nome: "Kimono Estampado Floral",
        descricao: "Sobreposição versátil para looks casuais.",
        preco: 69.9,
        foto_url: demoProdutoPath("demo-boutique-luar", 5),
        ordem: 5,
      },
      {
        nome: "Cinto Fino Dourado",
        descricao: "Acessório elegante para compor produções.",
        preco: 39.9,
        foto_url: demoProdutoPath("demo-boutique-luar", 6),
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
    logo_url: demoLogoPath("demo-padaria-horizonte"),
    capa_url: demoCapaPath("demo-padaria-horizonte"),
    destaque: true,
    produtos: [
      {
        nome: "Pão Francês (dúzia)",
        descricao: "Assado várias vezes ao dia. Crocante por fora, macio por dentro.",
        preco: 18.0,
        foto_url: demoProdutoPath("demo-padaria-horizonte", 1),
        ordem: 1,
      },
      {
        nome: "Coxinha de Frango (un.)",
        descricao: "Recheio cremoso e massa sequinha.",
        preco: 7.5,
        foto_url: demoProdutoPath("demo-padaria-horizonte", 2),
        ordem: 2,
      },
      {
        nome: "Empada de Palmito",
        descricao: "Massa amanteigada com recheio especial da casa.",
        preco: 8.9,
        foto_url: demoProdutoPath("demo-padaria-horizonte", 3),
        ordem: 3,
      },
      {
        nome: "Bolo de Cenoura (fatia)",
        descricao: "Com cobertura de chocolate meio amargo.",
        preco: 9.9,
        foto_url: demoProdutoPath("demo-padaria-horizonte", 4),
        ordem: 4,
      },
      {
        nome: "Café Expresso 50ml",
        descricao: "Blend especial torrado na região.",
        preco: 5.0,
        foto_url: demoProdutoPath("demo-padaria-horizonte", 5),
        ordem: 5,
      },
      {
        nome: "Suco Natural Laranja 300ml",
        descricao: "Espremido na hora.",
        preco: 8.0,
        foto_url: demoProdutoPath("demo-padaria-horizonte", 6),
        ordem: 6,
      },
      {
        nome: "Torta de Limão (fatia)",
        descricao: "Base crocante e creme cítrico equilibrado.",
        preco: 12.9,
        foto_url: demoProdutoPath("demo-padaria-horizonte", 7),
        ordem: 7,
      },
      {
        nome: "Cesta Café da Manhã (2 pessoas)",
        descricao: "Pães, frios, frutas, suco e café. Encomende com 24h de antecedência.",
        preco: 49.9,
        foto_url: demoProdutoPath("demo-padaria-horizonte", 8),
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
    logo_url: demoLogoPath("demo-espaco-bela-vila"),
    capa_url: demoCapaPath("demo-espaco-bela-vila"),
    destaque: false,
    produtos: [
      {
        nome: "Corte Feminino",
        descricao: "Inclui lavagem, finalização e consultoria de estilo.",
        preco: 65.0,
        foto_url: demoProdutoPath("demo-padaria-horizonte", 1),
        ordem: 1,
      },
      {
        nome: "Corte Masculino",
        descricao: "Máquina e tesoura com acabamento premium.",
        preco: 45.0,
        foto_url: demoProdutoPath("demo-padaria-horizonte", 2),
        ordem: 2,
      },
      {
        nome: "Escova Modeladora",
        descricao: "Brushing com proteção térmica.",
        preco: 55.0,
        foto_url: demoProdutoPath("demo-espaco-bela-vila", 3),
        ordem: 3,
      },
      {
        nome: "Manicure Completa",
        descricao: "Cutículas, esmaltação e hidratação.",
        preco: 35.0,
        foto_url: demoProdutoPath("demo-padaria-horizonte", 4),
        ordem: 4,
      },
      {
        nome: "Hidratação Capilar Profunda",
        descricao: "Tratamento de 45 minutos com máscara reparadora.",
        preco: 89.9,
        foto_url: demoProdutoPath("demo-espaco-bela-vila", 5),
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
    logo_url: demoLogoPath("demo-lar-harmonia"),
    capa_url: demoCapaPath("demo-lar-harmonia"),
    destaque: false,
    produtos: [
      {
        nome: "Almofada Veludo 45x45",
        descricao: "Tecido macio, zíper invisível. Cores assortidas.",
        preco: 49.9,
        foto_url: demoProdutoPath("demo-espaco-bela-vila", 1),
        ordem: 1,
      },
      {
        nome: "Luminária de Mesa Nordic",
        descricao: "Base em madeira clara e cúpula em linho.",
        preco: 129.0,
        foto_url: demoProdutoPath("demo-espaco-bela-vila", 2),
        ordem: 2,
      },
      {
        nome: "Tapete Sisal Natural 1,40m",
        descricao: "Ideal para sala e varanda gourmet.",
        preco: 219.0,
        foto_url: demoProdutoPath("demo-lar-harmonia", 3),
        ordem: 3,
      },
      {
        nome: "Kit Quadros Abstratos (3 peças)",
        descricao: "Moldura em MDF e impressão artística.",
        preco: 159.9,
        foto_url: demoProdutoPath("demo-lar-harmonia", 4),
        ordem: 4,
      },
      {
        nome: "Vaso Cerâmica Terracota G",
        descricao: "Peça artesanal para plantas de médio porte.",
        preco: 89.0,
        foto_url: demoProdutoPath("demo-lar-harmonia", 5),
        ordem: 5,
      },
      {
        nome: "Cortina Blackout 2,80m",
        descricao: "Bloqueio de luz e isolamento térmico.",
        preco: 189.0,
        foto_url: demoProdutoPath("demo-lar-harmonia", 6),
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
    logo_url: demoLogoPath("demo-pixel-byte"),
    capa_url: demoCapaPath("demo-pixel-byte"),
    destaque: false,
    produtos: [
      {
        nome: 'Notebook 14" 8GB/256GB SSD',
        descricao: "Ideal para estudos e home office. Garantia de 12 meses.",
        preco: 2499.0,
        foto_url: demoProdutoPath("demo-lar-harmonia", 1),
        ordem: 1,
      },
      {
        nome: "Mouse Sem Fio Ergonômico",
        descricao: "Conforto para longas jornadas de trabalho.",
        preco: 79.9,
        foto_url: demoProdutoPath("demo-lar-harmonia", 2),
        ordem: 2,
      },
      {
        nome: "Teclado Mecânico RGB",
        descricao: "Switches silenciosos e layout ABNT2.",
        preco: 249.0,
        foto_url: demoProdutoPath("demo-pixel-byte", 3),
        ordem: 3,
      },
      {
        nome: "Fone Bluetooth Over-Ear",
        descricao: "Até 30h de bateria e cancelamento passivo de ruído.",
        preco: 189.9,
        foto_url: demoProdutoPath("demo-espaco-bela-vila", 4),
        ordem: 4,
      },
      {
        nome: "Formatação + Instalação Windows",
        descricao: "Backup de arquivos essenciais incluso.",
        preco: 120.0,
        foto_url: demoProdutoPath("demo-pixel-byte", 5),
        ordem: 5,
      },
      {
        nome: "Cabo USB-C 2m Reforçado",
        descricao: "Suporte a carga rápida.",
        preco: 29.9,
        foto_url: demoProdutoPath("demo-pixel-byte", 6),
        ordem: 6,
      },
      {
        nome: "Suporte Articulado Monitor",
        descricao: "Compatível com telas de 17 a 32 polegadas.",
        preco: 99.0,
        foto_url: demoProdutoPath("demo-padaria-horizonte", 7),
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
    logo_url: demoLogoPath("demo-oficina-rota-certa"),
    capa_url: demoCapaPath("demo-oficina-rota-certa"),
    destaque: false,
    produtos: [
      {
        nome: "Troca de Óleo + Filtro",
        descricao: "Óleo semissintético e filtro de qualidade.",
        preco: 149.0,
        foto_url: demoProdutoPath("demo-pixel-byte", 1),
        ordem: 1,
      },
      {
        nome: "Alinhamento e Balanceamento",
        descricao: "Equipamento computadorizado de última geração.",
        preco: 120.0,
        foto_url: demoProdutoPath("demo-pixel-byte", 2),
        ordem: 2,
      },
      {
        nome: "Revisão Preventiva Completa",
        descricao: "Checklist de 40 itens com relatório digital.",
        preco: 289.0,
        foto_url: demoProdutoPath("demo-oficina-rota-certa", 3),
        ordem: 3,
      },
      {
        nome: "Diagnóstico Eletrônico",
        descricao: "Leitura de códigos e laudo técnico.",
        preco: 80.0,
        foto_url: demoProdutoPath("demo-lar-harmonia", 4),
        ordem: 4,
      },
    ],
  },
];

export function demoEmailForStore(slug: string): string {
  return emailForSlug(slug);
}

export const DEMO_SLUG_PREFIX = "demo-";
