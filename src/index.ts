import merge from "deepmerge";

import _écrit from "@/données/écrit.json" with { type: "json" };
import _orale from "@/données/écrit.json" with { type: "json" };

export const trouver = ({
  désirées,
  disponibles, 
  données,
}: { 
  désirées: string[];
  disponibles: string[];
  données: FormatDonnéesAuSuivant;
}): string | undefined  => {
  const parmiDésirées = désirées.find(d=>disponibles.includes(d))
  if (parmiDésirées) return parmiDésirées;

  const recherche = ({
    parmi,
    déjàVus = new Set<string>(),
    distance = 0,
  }: {
      parmi: string[];
      déjàVus?: Set<string>;
      distance?: number;
  }): {[langue: string]: number} => {
      for (const lg of parmi) {
        déjàVus.add(lg);

        const alternatives = données[lg] || [];
        const parmisAlternatives = Object.fromEntries(alternatives.filter(x => disponibles.includes(x)).map(x=>[x, distance]));

        if (Object.keys(parmisAlternatives).length) return parmisAlternatives;

        const alt = recherche({
          parmi: alternatives.filter(x => !déjàVus.has(x)),
          déjàVus,
          distance: distance + 1
        })
        return alt;
      }
      return {}
  }

  const distancesDisponibles = recherche({
    parmi: désirées,
  })

  return Object.entries(distancesDisponibles).sort((a, b) => a[1] < b[1] ? -1 : 1)?.[0]?.[0];;
}

export type FormatDonnéesAuSuivant = {
    [langue: string] : string[];
}

export class AuSuivant {
    _données_orales_constl: FormatDonnéesAuSuivant;
    _données_écrites_constl: FormatDonnéesAuSuivant;

    constructor () {
        this._données_orales_constl = {};
        this._données_écrites_constl = {};
    }

    get données_orales(): FormatDonnéesAuSuivant {
        return merge(_orale, this._données_orales_constl);
    }

    get données_écrites(): FormatDonnéesAuSuivant {
        return merge(_écrit, this._données_écrites_constl);
    }

    trouver ({
        désirées,
        disponibles, 
        voie = "écrite" 
    }: {
        désirées: string | string[];
        disponibles: string[];
        voie: "écrite" | "oral";
    }): string | undefined {
        const données = voie === "écrite" ? this.données_écrites : this.données_orales;

        const listeDésirées = typeof désirées === "string" ? [désirées] : désirées;

        return trouver({
          désirées: listeDésirées,
          disponibles,
          données,
        })
    }
}