/** Caminhos e URLs de imagem para lojas demo (storage + placeholders de produto). */

export const DEMO_ASSETS_EXT = "webp";

export function demoCapaPath(slug: string): string {
  return `demo/${slug}/capa.${DEMO_ASSETS_EXT}`;
}

export function demoLogoPath(slug: string): string {
  return `demo/${slug}/logo.${DEMO_ASSETS_EXT}`;
}

export function demoProdutoPath(slug: string, ordem: number): string {
  return `demo/${slug}/produtos/${ordem}.${DEMO_ASSETS_EXT}`;
}

const CATEGORIA_CORES: Record<string, string> = {
  moda: "F5A623",
  alimentacao: "E74C3C",
  servicos: "3498DB",
  "beleza-saude": "E91E63",
  "casa-decoracao": "9B59B6",
  esportes: "27AE60",
  tecnologia: "1A2E5A",
  automotivo: "34495E",
};

/** Placeholder quadrado 640×640 com nome do produto (fallback se não houver arquivo local). */
export function produtoFotoUrl(nome: string, categoriaSlug: string): string {
  const bg = CATEGORIA_CORES[categoriaSlug] ?? "1A2E5A";
  const label = nome.length > 24 ? `${nome.slice(0, 24)}…` : nome;
  return `https://placehold.co/640x640/${bg}/ffffff/png?text=${encodeURIComponent(label)}`;
}
