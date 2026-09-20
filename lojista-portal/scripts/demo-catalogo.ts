/**
 * Catálogo fictício para a apresentação à diretoria (24 lojistas).
 *
 * Todos os registros entram com `is_demo = true`, o que permite remover a carga
 * inteira depois com um único comando, sem risco de atingir associados reais.
 *
 * Convenções propositalmente reconhecíveis como teste:
 *  - nomes genéricos ("Loja Modelo", "Exemplo ...") — nunca algo que lembre
 *    uma empresa real da cidade;
 *  - CNPJ sempre começando com 00 (dígitos verificadores calculados);
 *  - e-mails no domínio reservado @demo.sindilojas.local;
 *  - slug com prefixo `demo-`.
 *
 * Distribuição (mín. 2 por categoria, ≥1 pago com foto em cada):
 *  4 destaque + 8 vitrine + 12 essencial = 24
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
  /** Slug da cidade de atuação (tabela public.cidades). */
  cidadeSlug: string;
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

function cnpjCheckDigit(base: string): number {
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

const produtoExemplo = (nome: string, preco: number, imagem: number, ordem: number): DemoProduto => ({
  nome,
  descricao: "Item de exemplo para a vitrine.",
  preco,
  imagem,
  ordem,
});

// ---------------------------------------------------------------------------
// 4 destaque + 8 vitrine + 12 essencial = 24
// ---------------------------------------------------------------------------

export const DEMO_LOJISTAS: DemoLojista[] = [
  // ======================= DESTAQUE (4) =======================
  {
    slug: "demo-loja-modelo-vestuario",
    nome_fantasia: "Loja Modelo Vestuário",
    razao_social: "Loja Modelo Vestuário Demonstração Ltda",
    plano: "destaque",
    destaque: true,
    categoriaSlug: "moda",
    cidadeSlug: "santa-cruz-do-sul",
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
      produtoExemplo("Vestido Demonstração Midi", 189.9, 1, 1),
      produtoExemplo("Blusa Demonstração Linho", 79.9, 2, 2),
      produtoExemplo("Calça Demonstração Wide Leg", 129.9, 3, 3),
      produtoExemplo("Bolsa Demonstração Tiracolo", 99.9, 4, 4),
    ],
  },
  {
    slug: "demo-exemplo-panificadora",
    nome_fantasia: "Exemplo Panificadora",
    razao_social: "Exemplo Panificadora Demonstração Ltda",
    plano: "destaque",
    destaque: true,
    categoriaSlug: "alimentacao",
    cidadeSlug: "mato-leitao",
    bairro: "Centro",
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
      produtoExemplo("Pão Demonstração Artesanal", 18.9, 1, 1),
      produtoExemplo("Bolo Demonstração Caseiro", 42.0, 2, 2),
      produtoExemplo("Croissant Demonstração", 9.5, 3, 3),
      produtoExemplo("Cesta Demonstração Café", 74.9, 4, 4),
    ],
  },
  {
    slug: "demo-modelo-casa-decoracao",
    nome_fantasia: "Modelo Casa & Decoração",
    razao_social: "Modelo Casa e Decoração Demonstração Ltda",
    plano: "destaque",
    destaque: true,
    categoriaSlug: "casa-decoracao",
    cidadeSlug: "vera-cruz",
    bairro: "Centro",
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
      produtoExemplo("Luminária Demonstração Mesa", 159.0, 1, 1),
      produtoExemplo("Vaso Demonstração Cerâmica", 89.9, 2, 2),
      produtoExemplo("Kit Demonstração Toalhas", 119.0, 3, 3),
    ],
  },
  {
    slug: "demo-modelo-otica",
    nome_fantasia: "Modelo Ótica",
    razao_social: "Modelo Ótica Demonstração Ltda",
    plano: "destaque",
    destaque: true,
    categoriaSlug: "otica-relojoaria",
    cidadeSlug: "venancio-aires",
    bairro: "Centro",
    endereco: "Rua de Demonstração",
    numero: "880",
    cep: "96815-200",
    telefone: "(51) 3000-0007",
    whatsapp: "(51) 99000-0007",
    site: "https://exemplo.demo.sindilojas.local",
    instagram: "@modelootica",
    pastaImagens: "demo-otica-prime",
    slogan: "Registro de demonstração — ótica",
    descricao:
      "Registro fictício usado para demonstrar o plano Destaque. Ótica com exame de vista, lentes multifocais e ajuste de armações. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      produtoExemplo("Armação Demonstração Acetato", 320.0, 1, 1),
      produtoExemplo("Óculos Demonstração Sol", 249.0, 2, 2),
      produtoExemplo("Relógio Demonstração Pulseira", 599.0, 3, 3),
    ],
  },

  // ======================= VITRINE (8) =======================
  {
    slug: "demo-exemplo-calcados",
    nome_fantasia: "Exemplo Calçados",
    razao_social: "Exemplo Calçados Demonstração Ltda",
    plano: "vitrine",
    destaque: false,
    categoriaSlug: "moda",
    cidadeSlug: "vera-cruz",
    bairro: "Distrito",
    endereco: "Rua de Demonstração",
    numero: "45",
    cep: "96825-000",
    telefone: "(51) 3000-0004",
    whatsapp: "(51) 99000-0004",
    instagram: "@exemplocalcados",
    pastaImagens: "demo-boutique-luar",
    slogan: "Registro de demonstração — calçados",
    descricao:
      "Registro fictício usado para demonstrar o plano Vitrine. Calçados femininos, masculinos e infantis, com numeração ampla. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      produtoExemplo("Tênis Demonstração Casual", 199.0, 5, 1),
      produtoExemplo("Sandália Demonstração Couro", 149.0, 6, 2),
      produtoExemplo("Bota Demonstração Cano Baixo", 259.0, 4, 3),
    ],
  },
  {
    slug: "demo-demonstracao-mercearia",
    nome_fantasia: "Demonstração Mercearia",
    razao_social: "Demonstração Mercearia Exemplo Ltda",
    plano: "vitrine",
    destaque: false,
    categoriaSlug: "alimentacao",
    cidadeSlug: "venancio-aires",
    bairro: "Bairro Industrial",
    endereco: "Rua de Demonstração",
    numero: "512",
    cep: "96810-050",
    telefone: "(51) 3000-0005",
    whatsapp: "(51) 99000-0005",
    instagram: "@demonstracaomercearia",
    pastaImagens: "demo-padaria-horizonte",
    slogan: "Registro de demonstração — mercearia",
    descricao:
      "Registro fictício usado para demonstrar o plano Vitrine. Mercearia de bairro com hortifrúti, frios e produtos da agricultura familiar. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      produtoExemplo("Cesta Demonstração Hortifrúti", 39.9, 5, 1),
      produtoExemplo("Queijo Demonstração Colonial", 28.5, 6, 2),
      produtoExemplo("Mel Demonstração Pote", 22.0, 7, 3),
    ],
  },
  {
    slug: "demo-loja-exemplo-beleza",
    nome_fantasia: "Loja Exemplo Beleza",
    razao_social: "Loja Exemplo Beleza Demonstração Ltda",
    plano: "vitrine",
    destaque: false,
    categoriaSlug: "beleza-saude",
    cidadeSlug: "santa-cruz-do-sul",
    bairro: "Higienópolis",
    endereco: "Rua de Demonstração",
    numero: "710",
    cep: "96810-120",
    telefone: "(51) 3000-0006",
    whatsapp: "(51) 99000-0006",
    instagram: "@lojaexemplobeleza",
    pastaImagens: "demo-espaco-bela-vila",
    slogan: "Registro de demonstração — beleza e bem-estar",
    descricao:
      "Registro fictício usado para demonstrar o plano Vitrine. Espaço de beleza com cabelo, estética facial e day spa por agendamento. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      produtoExemplo("Kit Demonstração Skincare", 89.0, 1, 1),
      produtoExemplo("Shampoo Demonstração Capilar", 45.0, 2, 2),
      produtoExemplo("Máscara Demonstração Facial", 62.0, 3, 3),
    ],
  },
  {
    slug: "demo-modelo-lavanderia",
    nome_fantasia: "Modelo Lavanderia",
    razao_social: "Modelo Lavanderia Demonstração Ltda",
    plano: "vitrine",
    destaque: false,
    categoriaSlug: "servicos",
    cidadeSlug: "mato-leitao",
    bairro: "Linha Nova",
    endereco: "Rua de Demonstração",
    numero: "198",
    cep: "96840-000",
    telefone: "(51) 3000-0018",
    whatsapp: "(51) 99000-0018",
    instagram: "@modelolavanderia",
    pastaImagens: "demo-lavanderia-modelo",
    slogan: "Registro de demonstração — lavanderia",
    descricao:
      "Registro fictício usado para demonstrar o plano Vitrine. Lavanderia com lavagem, passagem e retirada/entrega na região. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      produtoExemplo("Pacote Demonstração Lavagem", 49.9, 1, 1),
      produtoExemplo("Passadoria Demonstração Peça", 18.0, 2, 2),
      produtoExemplo("Kit Demonstração Enxoval", 89.0, 3, 3),
    ],
  },
  {
    slug: "demo-exemplo-assistencia-tecnica",
    nome_fantasia: "Exemplo Assistência Técnica",
    razao_social: "Exemplo Assistência Técnica Demonstração Ltda",
    plano: "vitrine",
    destaque: false,
    categoriaSlug: "tecnologia",
    cidadeSlug: "herveiras",
    bairro: "Centro",
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
      produtoExemplo("Serviço Demonstração Formatação", 120.0, 1, 1),
      produtoExemplo("Troca Demonstração de Tela", 280.0, 2, 2),
      produtoExemplo("Upgrade Demonstração SSD", 410.0, 3, 3),
    ],
  },
  {
    slug: "demo-demonstracao-auto-servicos",
    nome_fantasia: "Demonstração Auto Serviços",
    razao_social: "Demonstração Auto Serviços Exemplo Ltda",
    plano: "vitrine",
    destaque: false,
    categoriaSlug: "automotivo",
    cidadeSlug: "vale-do-sol",
    bairro: "Centro",
    endereco: "Rua de Demonstração",
    numero: "1500",
    cep: "96835-000",
    telefone: "(51) 3000-0009",
    whatsapp: "(51) 99000-0009",
    pastaImagens: "demo-oficina-rota-certa",
    slogan: "Registro de demonstração — oficina",
    descricao:
      "Registro fictício usado para demonstrar o plano Vitrine. Oficina mecânica com revisão preventiva, troca de óleo e alinhamento. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      produtoExemplo("Revisão Demonstração Básica", 220.0, 1, 1),
      produtoExemplo("Troca Demonstração de Óleo", 180.0, 2, 2),
      produtoExemplo("Alinhamento Demonstração", 130.0, 3, 3),
    ],
  },
  {
    slug: "demo-exemplo-papelaria-grafica",
    nome_fantasia: "Exemplo Papelaria e Gráfica",
    razao_social: "Exemplo Papelaria e Gráfica Demonstração Ltda",
    plano: "vitrine",
    destaque: false,
    categoriaSlug: "papelaria",
    cidadeSlug: "gramado-xavier",
    bairro: "Centro",
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
      produtoExemplo("Kit Demonstração Escolar", 139.0, 1, 1),
      produtoExemplo("Impressão Demonstração A3", 12.0, 2, 2),
      produtoExemplo("Caderno Demonstração Personalizado", 49.9, 3, 3),
    ],
  },
  {
    slug: "demo-exemplo-artigos-esportivos",
    nome_fantasia: "Exemplo Artigos Esportivos",
    razao_social: "Exemplo Artigos Esportivos Demonstração Ltda",
    plano: "vitrine",
    destaque: false,
    categoriaSlug: "esportes",
    cidadeSlug: "sinimbu",
    bairro: "Centro",
    endereco: "Rua de Demonstração",
    numero: "430",
    cep: "96845-000",
    telefone: "(51) 3000-0019",
    whatsapp: "(51) 99000-0019",
    instagram: "@exemploesportes",
    pastaImagens: "demo-esportes-arena",
    slogan: "Registro de demonstração — esportes",
    descricao:
      "Registro fictício usado para demonstrar o plano Vitrine. Artigos esportivos, tênis e acessórios para academia e lazer. Nenhum dado aqui corresponde a um associado real.",
    produtos: [
      produtoExemplo("Tênis Demonstração Corrida", 299.0, 1, 1),
      produtoExemplo("Bola Demonstração Campo", 89.0, 2, 2),
      produtoExemplo("Garrafa Demonstração Esportiva", 49.0, 3, 3),
    ],
  },

  // ======================= ESSENCIAL (12) =======================
  {
    slug: "demo-loja-modelo-confeccoes",
    nome_fantasia: "Loja Modelo Confecções",
    razao_social: "Loja Modelo Confecções Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "moda",
    cidadeSlug: "santa-cruz-do-sul",
    bairro: "Universitário",
    telefone: "(51) 3000-0011",
    whatsapp: "(51) 99000-0011",
    produtos: [],
  },
  {
    slug: "demo-exemplo-boutique-infantil",
    nome_fantasia: "Exemplo Boutique Infantil",
    razao_social: "Exemplo Boutique Infantil Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "moda",
    cidadeSlug: "vera-cruz",
    bairro: "Linha Nova",
    telefone: "(51) 3000-0017",
    whatsapp: "(51) 99000-0017",
    produtos: [],
  },
  {
    slug: "demo-exemplo-minimercado",
    nome_fantasia: "Exemplo Minimercado",
    razao_social: "Exemplo Minimercado Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "alimentacao",
    cidadeSlug: "venancio-aires",
    bairro: "Interior",
    telefone: "(51) 3000-0012",
    whatsapp: "(51) 99000-0012",
    produtos: [],
  },
  {
    slug: "demo-demonstracao-lanchonete",
    nome_fantasia: "Demonstração Lanchonete",
    razao_social: "Demonstração Lanchonete Exemplo Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "alimentacao",
    cidadeSlug: "mato-leitao",
    bairro: "Distrito",
    telefone: "(51) 3000-0016",
    whatsapp: "(51) 99000-0016",
    produtos: [],
  },
  {
    slug: "demo-modelo-salao-de-beleza",
    nome_fantasia: "Modelo Salão de Beleza",
    razao_social: "Modelo Salão de Beleza Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "beleza-saude",
    cidadeSlug: "herveiras",
    bairro: "Interior",
    telefone: "(51) 3000-0013",
    whatsapp: "(51) 99000-0013",
    produtos: [],
  },
  {
    slug: "demo-loja-modelo-materiais",
    nome_fantasia: "Loja Modelo Materiais de Construção",
    razao_social: "Loja Modelo Materiais de Construção Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "casa-decoracao",
    cidadeSlug: "gramado-xavier",
    bairro: "Distrito",
    telefone: "(51) 3000-0015",
    whatsapp: "(51) 99000-0015",
    produtos: [],
  },
  {
    slug: "demo-exemplo-chaveiro",
    nome_fantasia: "Exemplo Chaveiro 24h",
    razao_social: "Exemplo Chaveiro Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "servicos",
    cidadeSlug: "vale-do-sol",
    bairro: "Distrito",
    telefone: "(51) 3000-0014",
    whatsapp: "(51) 99000-0014",
    produtos: [],
  },
  {
    slug: "demo-exemplo-informaticas",
    nome_fantasia: "Exemplo Informática Bairro",
    razao_social: "Exemplo Informática Bairro Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "tecnologia",
    cidadeSlug: "vale-do-sol",
    bairro: "Interior",
    telefone: "(51) 3000-0020",
    whatsapp: "(51) 99000-0020",
    produtos: [],
  },
  {
    slug: "demo-exemplo-auto-pecas",
    nome_fantasia: "Exemplo Auto Peças",
    razao_social: "Exemplo Auto Peças Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "automotivo",
    cidadeSlug: "herveiras",
    bairro: "Distrito",
    telefone: "(51) 3000-0021",
    whatsapp: "(51) 99000-0021",
    produtos: [],
  },
  {
    slug: "demo-modelo-papelaria-escolar",
    nome_fantasia: "Modelo Papelaria Escolar",
    razao_social: "Modelo Papelaria Escolar Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "papelaria",
    cidadeSlug: "sinimbu",
    bairro: "Distrito",
    telefone: "(51) 3000-0022",
    whatsapp: "(51) 99000-0022",
    produtos: [],
  },
  {
    slug: "demo-exemplo-relojoaria",
    nome_fantasia: "Exemplo Relojoaria",
    razao_social: "Exemplo Relojoaria Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "otica-relojoaria",
    cidadeSlug: "gramado-xavier",
    bairro: "Interior",
    telefone: "(51) 3000-0023",
    whatsapp: "(51) 99000-0023",
    produtos: [],
  },
  {
    slug: "demo-modelo-academia-bairro",
    nome_fantasia: "Modelo Academia de Bairro",
    razao_social: "Modelo Academia de Bairro Demonstração Ltda",
    plano: "essencial",
    destaque: false,
    categoriaSlug: "esportes",
    cidadeSlug: "sinimbu",
    bairro: "Interior",
    telefone: "(51) 3000-0024",
    whatsapp: "(51) 99000-0024",
    produtos: [],
  },
];
