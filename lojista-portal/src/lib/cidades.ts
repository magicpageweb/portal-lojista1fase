/** Constantes e helpers das cidades de atuação do Sindilojas. */

export const CIDADES_ATUACAO = [
  { nome: "Santa Cruz do Sul", slug: "santa-cruz-do-sul" },
  { nome: "Vera Cruz", slug: "vera-cruz" },
  { nome: "Venâncio Aires", slug: "venancio-aires" },
  { nome: "Mato Leitão", slug: "mato-leitao" },
  { nome: "Herveiras", slug: "herveiras" },
  { nome: "Gramado Xavier", slug: "gramado-xavier" },
  { nome: "Vale do Sol", slug: "vale-do-sol" },
  { nome: "Sinimbu", slug: "sinimbu" },
] as const;

export function textoInstitucionalCidade(nomeCidade: string): string {
  return (
    "O Sindilojas Vale do Rio Pardo é uma entidade patronal de classe, " +
    "representante do comércio varejista, atuando em oito municípios do Vale: " +
    "Santa Cruz do Sul, Vera Cruz, Venâncio Aires, Mato Leitão, Herveiras, " +
    "Gramado Xavier, Vale do Sol e Sinimbu. Conheça o comércio local de " +
    `${nomeCidade} e apoie quem move a economia da nossa região.`
  );
}
