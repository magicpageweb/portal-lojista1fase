/**
 * Catálogo fictício para a apresentação à diretoria (18 lojistas).
 *
 * Todos os registros entram com `is_demo = true`, o que permite remover a carga
 * inteira depois com um único comando, sem risco de atingir associados reais.
 *
 * Convenções propositalmente reconhecíveis como teste:
 *  - nomes genéricos ("Loja Modelo", "Exemplo ...") — nunca algo que lembre
 *    uma empresa real da cidade;
 *  - CNPJ sempre começando com 00 (dígitos verificadores calculados, então
 *    passam na validação do painel);
 *  - e-mails no domínio reservado @demo.sindilojas.local;
 *  - slug com prefixo `demo-`.
 *
 * As imagens reaproveitam as pastas já versionadas em `public/demo/`, servidas
 * pelo próprio portal — a carga não depende de upload no Supabase Storage.
 */

export const DEMO_CITY = "Santa Cruz do Sul";
export const DEMO_STATE = "RS";
export const DEMO_CATALOGO_EMAIL_DOMAIN = "demo.sindilojas.local";
export const DEMO_CATALOGO_SLUG_PREFIX = "demo-";

export type DemoPlano = "essencial" | "vitrine" | "destaque";

export type DemoProduto = {
  nome: string;
  descricao: string;
  preco: number;
  /** Índice do arquivo em public/demo/<pastaImagens>/produtos/<n>.webp */
  imagem: number;
  ordem: number;
};

export type DemoLojista = {
  slug: string;
  nome_fantasia: string;
  razao_social: string;
  plano: DemoPlano;
  destaque: boolean;
  categoriaSlug: string;
  bairro: string;
  telefone: string;
  whatsapp: string;
  /** Planos pagos: pasta em public/demo/ usada para logo, capa e produtos. */
  pastaImagens?: string;
  slogan?: string;
  descricao?: string;
  site?: string;
  instagram?: string;
  endereco?: string;
  numero?: string;
  cep?: string;
  produtos: DemoProduto[];
};

// ---------------------------------------------------------------------------
// CNPJ de teste: base "00" + sequência, com dígitos verificadores reais.
// ---------------------------------------------------------------------------

function cnpjCheckDigit(base: string): number {
  // Pesos 2..9 aplicados da direita para a esquerda.
  let sum = 0;
  let weight = 2;
  for (let i = base.length - 1; i >= 0; i--) {
    sum += Number(base[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}

/** Gera um CNPJ válido e visivelmente sintético (sempre iniciado em 00). */
export function demoCnpj(seq: number): string {
  const base = `00${String(seq).padStart(6, "0")}0001`;
  const dv1 = cnpjCheckDigit(base);
  const dv2 = cnpjCheckDigit(`${base}${dv1}`);
  const full = `${base}${dv1}${dv2}`;
  return `${full.slice(0, 2)}.${full.slice(2, 5)}.${full.slice(5, 8)}/${full.slice(8, 12)}-${full.slice(12)}`;
}

export function demoEmail(slug: string): string {
  return `${slug}@${DEMO_CATALOGO_EMAIL_DOMAIN}`;
}

export function demoLogoPath(pasta: string): string {
  return `/demo/${pasta}/logo.webp`;
}

export function demoCapaPath(pasta: string): string {
  return `/demo/${pasta}/capa.webp`;
}

export function demoProdutoPath(pasta: string, imagem: number): string {
  return `/demo/${pasta}/produtos/${imagem}.webp`;
}

// ---------------------------------------------------------------------------
// 3 destaque + 7 vitrine + 8 essencial = 18
// ---------------------------------------------------------------------------

export const DEMO_LOJISTAS: DemoLojista[] = [
  // ======================= DESTAQUE (3) =======================
  {
    slug: "demo-loja-modelo-vestuario",
    nome_fantasia: "Loja Modelo Vestuário",
    razao_social: "Loja Modelo Vestuário Demonstração Ltda",
    plano: "destaque",
    destaque: true,
    categoriaSlug: "moda",
    bairro: "Centro",
    endereco: "Rua de Demonstração",
    numero: "100",
    cep: "96810-000",
    telefone: "(51) 3000-0001",
    whatsapp: "(51) 99000-0001",
    site: "https://exemplo.demo.sindilojas.local",
    instagram: "@lojamodelovestuario",
    pastaImagens: "demo-boutique-luar",
    slogan: "Registro de demonstração — moda feminina",
    descricao:
      "Registro fictício usado para demonstrar o plano Destaque. Loja de vestuário com coleções de estação, provador assistido e atendimento personalizado. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      {
        nome: "Vestido Demonstração Midi",
        descricao: "Item de exemplo para a vitrine.",
        preco: 189.9,
        imagem: 1,
        ordem: 1,
      },
      {
        nome: "Blusa Demonstração Linho",
        descricao: "Item de exemplo para a vitrine.",
        preco: 79.9,
        imagem: 2,
        ordem: 2,
      },
      {
        nome: "Calça Demonstração Wide Leg",
        descricao: "Item de exemplo para a vitrine.",
        preco: 129.9,
        imagem: 3,
        ordem: 3,
      },
      {
        nome: "Bolsa Demonstração Tiracolo",
        descricao: "Item de exemplo para a vitrine.",
        preco: 99.9,
        imagem: 4,
        ordem: 4,
      },
    ],
  },
  {
    slug: "demo-exemplo-panificadora",
    nome_fantasia: "Exemplo Panificadora",
    razao_social: "Exemplo Panificadora Demonstração Ltda",
    plano: "destaque",
    destaque: true,
    categoriaSlug: "alimentacao",
    bairro: "Higienópolis",
    endereco: "Avenida de Demonstração",
    numero: "220",
    cep: "96815-000",
    telefone: "(51) 3000-0002",
    whatsapp: "(51) 99000-0002",
    site: "https://exemplo.demo.sindilojas.local",
    instagram: "@exemplopanificadora",
    pastaImagens: "demo-padaria-horizonte",
    slogan: "Registro de demonstração — panificação",
    descricao:
      "Registro fictício usado para demonstrar o plano Destaque. Padaria de bairro com produção própria, cafeteria e encomendas para eventos. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      {
        nome: "Pão Demonstração Artesanal",
        descricao: "Item de exemplo para a vitrine.",
        preco: 18.9,
        imagem: 1,
        ordem: 1,
      },
      {
        nome: "Bolo Demonstração Caseiro",
        descricao: "Item de exemplo para a vitrine.",
        preco: 42.0,
        imagem: 2,
        ordem: 2,
      },
      {
        nome: "Croissant Demonstração",
        descricao: "Item de exemplo para a vitrine.",
        preco: 9.5,
        imagem: 3,
        ordem: 3,
      },
      {
        nome: "Cesta Demonstração Café",
        descricao: "Item de exemplo para a vitrine.",
        preco: 74.9,
        imagem: 4,
        ordem: 4,
      },
    ],
  },
  {
    slug: "demo-modelo-casa-decoracao",
    nome_fantasia: "Modelo Casa & Decoração",
    razao_social: "Modelo Casa e Decoração Demonstração Ltda",
    plano: "destaque",
    destaque: true,
    categoriaSlug: "casa-decoracao",
    bairro: "Avenida",
    endereco: "Rua de Demonstração",
    numero: "340",
    cep: "96820-000",
    telefone: "(51) 3000-0003",
    whatsapp: "(51) 99000-0003",
    site: "https://exemplo.demo.sindilojas.local",
    instagram: "@modelocasadecoracao",
    pastaImagens: "demo-lar-harmonia",
    slogan: "Registro de demonstração — casa e decoração",
    descricao:
      "Registro fictício usado para demonstrar o plano Destaque. Loja de utilidades domésticas e decoração, com projeto de ambientes e entrega na região. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      {
        nome: "Luminária Demonstração",
        descricao: "Item de exemplo para a vitrine.",
        preco: 159.0,
        imagem: 1,
        ordem: 1,
      },
      {
        nome: "Vaso Demonstração Cerâmica",
        descricao: "Item de exemplo para a vitrine.",
        preco: 89.0,
        imagem: 2,
        ordem: 2,
      },
      {
        nome: "Jogo Demonstração Almofadas",
        descricao: "Item de exemplo para a vitrine.",
        preco: 119.0,
        imagem: 3,
        ordem: 3,
      },
    ],
  },

  // ======================= VITRINE (7) =======================
  {
    slug: "demo-exemplo-calcados",
    nome_fantasia: "Exemplo Calçados",
    razao_social: "Exemplo Calçados Demonstração Ltda",
    plano: "vitrine",
    destaque: false,
    categoriaSlug: "moda",
    bairro: "Vila Nova",
    endereco: "Rua de Demonstração",
    numero: "455",
    cep: "96825-000",
    telefone: "(51) 3000-0004",
    whatsapp: "(51) 99000-0004",
    instagram: "@exemplocalcados",
    pastaImagens: "demo-boutique-luar",
    slogan: "Registro de demonstração — calçados",
    descricao:
      "Registro fictício usado para demonstrar o plano Vitrine. Calçados femininos, masculinos e infantis, com numeração ampla. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      {
        nome: "Tênis Demonstração Casual",
        descricao: "Item de exemplo para a vitrine.",
        preco: 219.9,
        imagem: 5,
        ordem: 1,
      },
      {
        nome: "Sandália Demonstração Verão",
        descricao: "Item de exemplo para a vitrine.",
        preco: 109.9,
        imagem: 6,
        ordem: 2,
      },
      {
        nome: "Cinto Demonstração Couro",
        descricao: "Item de exemplo para a vitrine.",
        preco: 59.9,
        imagem: 1,
        ordem: 3,
      },
    ],
  },
  {
    slug: "demo-demonstracao-mercearia",
    nome_fantasia: "Demonstração Mercearia",
    razao_social: "Demonstração Mercearia Exemplo Ltda",
    plano: "vitrine",
    destaque: false,
    categoriaSlug: "alimentacao",
    bairro: "Santo Inácio",
    endereco: "Rua de Demonstração",
    numero: "512",
    cep: "96830-000",
    telefone: "(51) 3000-0005",
    whatsapp: "(51) 99000-0005",
    instagram: "@demonstracaomercearia",
    pastaImagens: "demo-padaria-horizonte",
    slogan: "Registro de demonstração — mercearia",
    descricao:
      "Registro fictício usado para demonstrar o plano Vitrine. Mercearia de bairro com hortifrúti, frios e produtos da agricultura familiar. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      {
        nome: "Cesta Demonstração Hortifrúti",
        descricao: "Item de exemplo para a vitrine.",
        preco: 64.9,
        imagem: 5,
        ordem: 1,
      },
      {
        nome: "Queijo Demonstração Colonial",
        descricao: "Item de exemplo para a vitrine.",
        preco: 48.0,
        imagem: 6,
        ordem: 2,
      },
      {
        nome: "Geleia Demonstração Artesanal",
        descricao: "Item de exemplo para a vitrine.",
        preco: 24.9,
        imagem: 7,
        ordem: 3,
      },
    ],
  },
  {
    slug: "demo-loja-exemplo-beleza",
    nome_fantasia: "Loja Exemplo Beleza",
    razao_social: "Loja Exemplo Beleza Demonstração Ltda",
    plano: "vitrine",
    destaque: false,
    categoriaSlug: "beleza-saude",
    bairro: "Centro",
    endereco: "Rua de Demonstração",
    numero: "78",
    cep: "96810-100",
    telefone: "(51) 3000-0006",
    whatsapp: "(51) 99000-0006",
    instagram: "@lojaexemplobeleza",
    pastaImagens: "demo-espaco-bela-vila",
    slogan: "Registro de demonstração — beleza e bem-estar",
    descricao:
      "Registro fictício usado para demonstrar o plano Vitrine. Espaço de beleza com cabelo, estética facial e day spa por agendamento. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      {
        nome: "Pacote Demonstração Day Spa",
        descricao: "Item de exemplo para a vitrine.",
        preco: 289.0,
        imagem: 1,
        ordem: 1,
      },
      {
        nome: "Sessão Demonstração Estética",
        descricao: "Item de exemplo para a vitrine.",
        preco: 149.0,
        imagem: 2,
        ordem: 2,
      },
      {
        nome: "Kit Demonstração Cuidados",
        descricao: "Item de exemplo para a vitrine.",
        preco: 99.0,
        imagem: 3,
        ordem: 3,
      },
    ],
  },
  {
    slug: "demo-modelo-otica",
    nome_fantasia: "Modelo Ótica",
    razao_social: "Modelo Ótica Demonstração Ltda",
    plano: "vitrine",
    destaque: false,
    categoriaSlug: "beleza-saude",
    bairro: "Universitário",
    endereco: "Avenida de Demonstração",
    numero: "915",
    cep: "96815-100",
    telefone: "(51) 3000-0007",
    whatsapp: "(51) 99000-0007",
    instagram: "@modelootica",
    pastaImagens: "demo-otica-prime",
    slogan: "Registro de demonstração — ótica",
    descricao:
      "Registro fictício usado para demonstrar o plano Vitrine. Ótica com exame de vista, lentes multifocais e ajuste de armações. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      {
        nome: "Armação Demonstração Acetato",
        descricao: "Item de exemplo para a vitrine.",
        preco: 349.0,
        imagem: 1,
        ordem: 1,
      },
      {
        nome: "Óculos Demonstração Solar",
        descricao: "Item de exemplo para a vitrine.",
        preco: 259.0,
        imagem: 2,
        ordem: 2,
      },
      {
        nome: "Lente Demonstração Multifocal",
        descricao: "Item de exemplo para a vitrine.",
        preco: 599.0,
        imagem: 3,
        ordem: 3,
      },
    ],
  },
  {
    slug: "demo-exemplo-assistencia-tecnica",
    nome_fantasia: "Exemplo Assistência Técnica",
    razao_social: "Exemplo Assistência Técnica Demonstração Ltda",
    plano: "vitrine",
    destaque: false,
    categoriaSlug: "servicos",
    bairro: "Renascença",
    endereco: "Rua de Demonstração",
    numero: "1240",
    cep: "96820-100",
    telefone: "(51) 3000-0008",
    whatsapp: "(51) 99000-0008",
    instagram: "@exemploassistencia",
    pastaImagens: "demo-pixel-byte",
    slogan: "Registro de demonstração — assistência técnica",
    descricao:
      "Registro fictício usado para demonstrar o plano Vitrine. Assistência técnica de computadores e celulares, com orçamento sem compromisso. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      {
        nome: "Serviço Demonstração Formatação",
        descricao: "Item de exemplo para a vitrine.",
        preco: 120.0,
        imagem: 1,
        ordem: 1,
      },
      {
        nome: "Troca Demonstração de Tela",
        descricao: "Item de exemplo para a vitrine.",
        preco: 280.0,
        imagem: 2,
        ordem: 2,
      },
      {
        nome: "Upgrade Demonstração SSD",
        descricao: "Item de exemplo para a vitrine.",
        preco: 410.0,
        imagem: 3,
        ordem: 3,
      },
      {
        nome: "Limpeza Demonstração Notebook",
        descricao: "Item de exemplo para a vitrine.",
        preco: 95.0,
        imagem: 4,
        ordem: 4,
      },
    ],
  },
  {
    slug: "demo-demonstracao-auto-servicos",
    nome_fantasia: "Demonstração Auto Serviços",
    razao_social: "Demonstração Auto Serviços Exemplo Ltda",
    plano: "vitrine",
    destaque: false,
    categoriaSlug: "servicos",
    bairro: "Bom Jesus",
    endereco: "Avenida de Demonstração",
    numero: "1580",
    cep: "96825-100",
    telefone: "(51) 3000-0009",
    whatsapp: "(51) 99000-0009",
    pastaImagens: "demo-oficina-rota-certa",
    slogan: "Registro de demonstração — oficina",
    descricao:
      "Registro fictício usado para demonstrar o plano Vitrine. Oficina mecânica com revisão preventiva, troca de óleo e alinhamento. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      {
        nome: "Revisão Demonstração Completa",
        descricao: "Item de exemplo para a vitrine.",
        preco: 390.0,
        imagem: 1,
        ordem: 1,
      },
      {
        nome: "Troca Demonstração de Óleo",
        descricao: "Item de exemplo para a vitrine.",
        preco: 180.0,
        imagem: 2,
        ordem: 2,
      },
      {
        nome: "Alinhamento Demonstração",
        descricao: "Item de exemplo para a vitrine.",
        preco: 130.0,
        imagem: 3,
        ordem: 3,
      },
    ],
  },
  {
    slug: "demo-exemplo-papelaria-grafica",
    nome_fantasia: "Exemplo Papelaria e Gráfica",
    razao_social: "Exemplo Papelaria e Gráfica Demonstração Ltda",
    plano: "vitrine",
    destaque: false,
    categoriaSlug: "servicos",
    bairro: "Menino Deus",
    endereco: "Rua de Demonstração",
    numero: "62",
    cep: "96830-100",
    telefone: "(51) 3000-0010",
    whatsapp: "(51) 99000-0010",
    instagram: "@exemplopapelaria",
    pastaImagens: "demo-papelaria-centro",
    slogan: "Registro de demonstração — papelaria e gráfica",
    descricao:
      "Registro fictício usado para demonstrar o plano Vitrine. Papelaria com material escolar, impressão digital e personalizados. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      {
        nome: "Kit Demonstração Escolar",
        descricao: "Item de exemplo para a vitrine.",
        preco: 139.0,
        imagem: 1,
        ordem: 1,
      },
      {
        nome: "Impressão Demonstração A3",
        descricao: "Item de exemplo para a vitrine.",
        preco: 12.0,
        imagem: 2,
        ordem: 2,
      },
      {
        nome: "Caderno Demonstração Personalizado",
        descricao: "Item de exemplo para a vitrine.",
        preco: 49.9,
        imagem: 3,
        ordem: 3,
      },
    ],
  },

  // ======================= ESSENCIAL (8) =======================
  // Sem logo, capa, descrição ou produtos: apenas identificação e contato.
  {
    slug: "demo-loja-modelo-confeccoes",
    nome_fantasia: "Loja Modelo Confecções",
    razao_social: "Loja Modelo Confecções Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "moda",
    bairro: "Arroio Grande",
    telefone: "(51) 3000-0011",
    whatsapp: "(51) 99000-0011",
    produtos: [],
  },
  {
    slug: "demo-exemplo-minimercado",
    nome_fantasia: "Exemplo Minimercado",
    razao_social: "Exemplo Minimercado Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "alimentacao",
    bairro: "Linha Santa Cruz",
    telefone: "(51) 3000-0012",
    whatsapp: "(51) 99000-0012",
    produtos: [],
  },
  {
    slug: "demo-modelo-salao-de-beleza",
    nome_fantasia: "Modelo Salão de Beleza",
    razao_social: "Modelo Salão de Beleza Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "beleza-saude",
    bairro: "Country",
    telefone: "(51) 3000-0013",
    whatsapp: "(51) 99000-0013",
    produtos: [],
  },
  {
    slug: "demo-exemplo-chaveiro",
    nome_fantasia: "Exemplo Chaveiro 24h",
    razao_social: "Exemplo Chaveiro Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "servicos",
    bairro: "Centro",
    telefone: "(51) 3000-0014",
    whatsapp: "(51) 99000-0014",
    produtos: [],
  },
  {
    slug: "demo-loja-modelo-materiais",
    nome_fantasia: "Loja Modelo Materiais de Construção",
    razao_social: "Loja Modelo Materiais de Construção Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "casa-decoracao",
    bairro: "Progresso",
    telefone: "(51) 3000-0015",
    whatsapp: "(51) 99000-0015",
    produtos: [],
  },
  {
    slug: "demo-demonstracao-lanchonete",
    nome_fantasia: "Demonstração Lanchonete",
    razao_social: "Demonstração Lanchonete Exemplo Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "alimentacao",
    bairro: "Vila Formosa",
    telefone: "(51) 3000-0016",
    whatsapp: "(51) 99000-0016",
    produtos: [],
  },
  {
    slug: "demo-exemplo-boutique-infantil",
    nome_fantasia: "Exemplo Boutique Infantil",
    razao_social: "Exemplo Boutique Infantil Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "moda",
    bairro: "Verena",
    telefone: "(51) 3000-0017",
    whatsapp: "(51) 99000-0017",
    produtos: [],
  },
  {
    slug: "demo-modelo-lavanderia",
    nome_fantasia: "Modelo Lavanderia",
    razao_social: "Modelo Lavanderia Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "servicos",
    bairro: "Goiás",
    telefone: "(51) 3000-0018",
    whatsapp: "(51) 99000-0018",
    produtos: [],
  },
];
