import {expect} from "aegir/chai";
import {AuSuivant, trouver} from "@/index.js";

describe("Disponibilité langues", function () {
    it("Langue disponible", async () => {
      const trouvé = trouver({
        désirées: ["fra"],
        disponibles: ["cst", "fra"],
        données: {
          fra: ["cst"],
          cst: ["fra"]
        }
      })
      expect(trouvé).to.eq("fra")
    });
    
    it("Langue disponible, inexistante dans données", async () => {
      const trouvé = trouver({
        désirées: ["fra"],
        disponibles: ["cst", "fra"],
        données: {}
      })
      expect(trouvé).to.eq("fra")
    });
    
    it("Langue non disponible, inexistante dans données", async () => {
      const trouvé = trouver({
        désirées: ["fra"],
        disponibles: ["cst", "ctl"],
        données: {}
      })
      expect(trouvé).to.be.undefined();
    });

    it("Langue existante, aucune option", async () => {
      const trouvé = trouver({
        désirées: ["fra"],
        disponibles: ["fra"],
        données: {
          fra: []
        }
      })
      expect(trouvé).to.eq("fra");
    });
    
    it("Langue existante, aucune option disponible", async () => {
      const trouvé = trouver({
        désirées: ["fra"],
        disponibles: [],
        données: {
          fra: ["cst"]
        }
      })
      expect(trouvé).to.be.undefined();
    });
    
    it("Langue existante, aucune option disponible", async () => {
      const trouvé = trouver({
        désirées: ["fra"],
        disponibles: [],
        données: {
          fra: ["cst"]
        }
      })
      expect(trouvé).to.be.undefined();
    });
});

describe("Résolution", function () {
    it("Première option disponible", async () => {
      const trouvé = trouver({
        désirées: ["fra"],
        disponibles: ["cst"],
        données: {
          fra: ["cst"]
        }
      })
      expect(trouvé).to.eq("cst");
    });
    
    it("Deuxième option disponible", async () => {
      const trouvé = trouver({
        désirées: ["fra"],
        disponibles: ["ptg"],
        données: {
          fra: ["cst", "ptg"]
        }
      })
      expect(trouvé).to.eq("ptg");
    });
    
    it("Priorité options de langue initiale", async () => {
      const trouvé = trouver({
        désirées: ["fra"],
        disponibles: ["itl", "ctl"],
        données: {
          fra: ["cst", "ptg", "ctl"],
          cst: ["itl"]
        }
      })
      expect(trouvé).to.eq("ctl");
    });
    
    it("Deuxième degré", async () => {
      const trouvé = trouver({
        désirées: ["fra"],
        disponibles: ["itl"],
        données: {
          fra: ["cst", "ptg", "ctl"],
          cst: ["itl"]
        }
      })
      expect(trouvé).to.eq("itl");
    });
    
    it("Deuxième degré - coût d'éloignement", async () => {
      const trouvé = trouver({
        désirées: ["fra"],
        disponibles: ["itl", "occ"],
        données: {
          fra: ["cst", "ptg", "ctl"],
          cst: ["ptg", "itl"],
          ptg: ["occ"]
        }
      })
      expect(trouvé).to.eq("itl");
    });

    it("Multiples désirées", async () => {
      const trouvé = trouver({
        désirées: ["fra", "ctl"],
        disponibles: ["itl", "ctl", "ptg"],
        données: {
          fra: ["cst", "ctl", "ptg"],
          ctl: ["occ", "itl"]
        }
      })
      expect(trouvé).to.eq("ctl");
    });

    it("Multiples désirées - priorité premier de fil", async () => {
      const trouvé = trouver({
        désirées: ["fra", "ctl"],
        disponibles: ["itl", "occ", "ptg"],
        données: {
          fra: ["cst", "ctl", "ptg"],
          ctl: ["occ", "itl"]
        }
      })
      expect(trouvé).to.eq("ptg");
    });

    it("Circulairité", async () => {
      const trouvé = trouver({
        désirées: ["fra"],
        disponibles: ["itl", "occ"],
        données: {
          fra: ["cst", "occ"],
          cst: ["fra"],
        }
      })
      expect(trouvé).to.eq("occ");
    });
});


describe("Au suivant", function () {
  let auSuivant: AuSuivant;
  before(()=>{
    auSuivant = new AuSuivant();
  })
  it("Langue écrite", async () => {
    auSuivant.résoudre({ désirées: "हिं", disponibles: ["राज"], voie: "écrite" })
  })
});