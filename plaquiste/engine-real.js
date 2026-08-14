(function(global){
"use strict";
const modules = {}; const cache = {};
modules['./BaseCalculateur'] = function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCalculateur = void 0;
class BaseCalculateur {
    async enrichirAvecCatalogue(materiaux) { return materiaux; }
    arrondirAuConditionnement(quantite, conditionnement = 1) { return Math.ceil(quantite / conditionnement) * conditionnement; }
    calculerMontantHT(quantite, prixUnitaire) { return Math.round(quantite * prixUnitaire * 100) / 100; }
    calculerTVA(montantHT, tauxTVA = 20) { return Math.round(montantHT * (tauxTVA / 100) * 100) / 100; }
    getTauxTVA(donnees) { const taux = donnees?.options?.taux_tva; return typeof taux === 'number' && taux >= 0 && taux <= 100 ? taux : 20; }
    validerDonnees(donnees) { if (!donnees.metier)
        throw new Error('Le métier est requis'); if (!donnees.nom_calcul)
        throw new Error('Le nom du calcul est requis'); if (!donnees.options?.complexite)
        throw new Error('La complexité est requise'); }
    genererAlertes(donnees) { const a = []; if (donnees.options?.hauteur_sous_plafond_sup_3m)
        a.push('⚠️ Hauteur > 3m : prévoir échafaudage et équipement de sécurité'); if (donnees.options?.acces_difficile)
        a.push('⚠️ Accès difficile : prévoir temps de manutention supplémentaire'); if (donnees.options?.complexite === 'complexe')
        a.push('⚠️ Chantier complexe : prévoir marge de sécurité sur matériaux et temps'); return a; }
}
exports.BaseCalculateur = BaseCalculateur;

};
modules['./plaquisteBusinessRules'] = function(require,module,exports){
"use strict";
/**
 * Règles métier Plaquiste validées avec Guillaume — Août 2026.
 *
 * Ce fichier complète le module Plaquiste existant de SpeedArti : il ne crée
 * pas un nouveau parcours. Les valeurs restent regroupées ici pour être
 * traçables et modifiables sans les disséminer dans les composants React.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaquistePlateLossPct = exports.getSuggestedOptimaRows = exports.PLAQUISTE_ISOLATION_ABAQUE_V2 = exports.PLAQUISTE_RULES_2026_08 = void 0;
exports.PLAQUISTE_RULES_2026_08 = Object.freeze({
    version: 'plaquiste-business-2026-08-05-v2',
    plaques: {
        largeurCommercialeM: 1.20,
        perteMurPct: 7,
        pertePlafondPct: 10,
        perteRampantPct: 12,
    },
    ossature: {
        pertePct: 5,
        ouvertureMontantsTouteHauteur: 4,
        ouvertureProfilsHorizontauxParLargeur: 2,
    },
    vis: {
        premierePeauMurParM2: 25,
        premierePeauPlafondParM2: 18,
        secondePeauParM2: 20,
        pertePct: 10,
        boiteUnites: 500,
    },
    finitions: {
        bandeMurMlM2: 1.8,
        bandePlafondMlM2: 2.2,
        enduitMurKgM2: 0.5,
        enduitPlafondKgM2: 0.6,
        prixVenteHtM2: {
            aucune: 0,
            bandes: 5,
            pret_a_peindre: 9,
            soignee: 13,
        },
        impressionHtM2: 5,
    },
    isolation: {
        pertePanneauxRouleauxPct: 10,
        perteSoufflePct: 3,
        semiRigideCoefMatiere: 1.20,
        semiRigideCoefMainOeuvre: 1.20,
        secondeCouchePoseHtM2: 3,
        poseCroiseeCoefMainOeuvre: 1.15,
        pareVapeurPrixVenteHtM2: 3.50,
        freinVapeurPrixVenteHtM2: 5.00,
    },
    optima: {
        espacementVerticalRangeeM: 1.35,
        fourrureF530MlM2: 1.8,
        lisseClipMlM2: 0.9,
        appuiUniteM2: 0.75,
        cleUniteM2: 0.75,
        fixationsUniteM2ParRangee: 2,
    },
    mainOeuvre: {
        cloisonHParM2: 0.35,
        doublageOptimaHParM2: 0.40,
        doublageClassiqueSansIsolantHParM2: 0.26,
        doublageClassiqueAvecIsolantHParM2: 0.32,
        plafondDroitHParM2: 0.40,
        secondePeauHParM2: 0.05,
        montantsDoublesCoef: 1.50,
        complexiteCoef: {
            simple: 0.90,
            moyenne: 1,
            complexe: 1.30,
        },
    },
    optionsDirectes: {
        repriseExistantHt: 150,
        accesDifficileHt: 450,
        seuilGrandeHauteurM: 3.50,
        grandeHauteurHtM2: 4,
        nombreusesDecoupesSpotsHtM2: 2,
        rampantHtM2: 5,
        rampantComplexeHtM2: 11,
    },
});
/**
 * Abaque `Abaque_isolants_generiques_maison_v2` transmis et validé.
 * Les prix sont des coûts d'achat HT/m² à marger, modifiables par l'artisan.
 * Le R des combles reste purement informatif.
 */
exports.PLAQUISTE_ISOLATION_ABAQUE_V2 = [
    { id: 'abaque-ldv-45', famille: 'Minéral', nom: 'Laine de verre', epaisseurMm: 45, prixAchatHtM2: 3.28, usage: 'Cloison', kind: 'panel_roll' },
    { id: 'abaque-ldr-45', famille: 'Minéral', nom: 'Laine de roche', epaisseurMm: 45, prixAchatHtM2: 4.92, usage: 'Cloison coupe-feu/phonique', kind: 'panel_roll' },
    { id: 'abaque-fdb-45', famille: 'Naturel', nom: 'Fibre de bois', epaisseurMm: 45, prixAchatHtM2: 6.56, usage: 'Cloison', kind: 'panel_roll' },
    { id: 'abaque-ldv-70', famille: 'Minéral', nom: 'Laine de verre', epaisseurMm: 70, prixAchatHtM2: 4.10, usage: 'Doublage', kind: 'panel_roll' },
    { id: 'abaque-ldr-70', famille: 'Minéral', nom: 'Laine de roche', epaisseurMm: 70, prixAchatHtM2: 5.74, usage: 'Doublage', kind: 'panel_roll' },
    { id: 'abaque-fdb-70', famille: 'Naturel', nom: 'Fibre de bois', epaisseurMm: 70, prixAchatHtM2: 8.20, usage: 'Doublage', kind: 'panel_roll' },
    { id: 'abaque-ldv-90', famille: 'Minéral', nom: 'Laine de verre', epaisseurMm: 90, prixAchatHtM2: 4.92, usage: 'Cloison R90', kind: 'panel_roll' },
    { id: 'abaque-ldr-90', famille: 'Minéral', nom: 'Laine de roche', epaisseurMm: 90, prixAchatHtM2: 6.56, usage: 'Phonique', kind: 'panel_roll' },
    { id: 'abaque-fdb-90', famille: 'Naturel', nom: 'Fibre de bois', epaisseurMm: 90, prixAchatHtM2: 9.84, usage: 'Phonique', kind: 'panel_roll' },
    { id: 'abaque-ldv-100', famille: 'Minéral', nom: 'Laine de verre', epaisseurMm: 100, prixAchatHtM2: 5.74, usage: 'ITI', kind: 'panel_roll' },
    { id: 'abaque-ldr-100', famille: 'Minéral', nom: 'Laine de roche', epaisseurMm: 100, prixAchatHtM2: 7.38, usage: 'ITI', kind: 'panel_roll' },
    { id: 'abaque-fdb-100', famille: 'Naturel', nom: 'Fibre de bois', epaisseurMm: 100, prixAchatHtM2: 11.48, usage: 'ITI', kind: 'panel_roll' },
    { id: 'abaque-ldv-120', famille: 'Minéral', nom: 'Laine de verre', epaisseurMm: 120, prixAchatHtM2: 6.56, usage: 'Combles', kind: 'panel_roll' },
    { id: 'abaque-ldr-120', famille: 'Minéral', nom: 'Laine de roche', epaisseurMm: 120, prixAchatHtM2: 8.20, usage: 'Combles', kind: 'panel_roll' },
    { id: 'abaque-fdb-120', famille: 'Naturel', nom: 'Fibre de bois', epaisseurMm: 120, prixAchatHtM2: 13.12, usage: 'Combles', kind: 'panel_roll' },
    { id: 'abaque-ldv-140', famille: 'Minéral', nom: 'Laine de verre', epaisseurMm: 140, prixAchatHtM2: 7.38, usage: 'Combles', kind: 'panel_roll' },
    { id: 'abaque-ldr-140', famille: 'Minéral', nom: 'Laine de roche', epaisseurMm: 140, prixAchatHtM2: 9.02, usage: 'Combles', kind: 'panel_roll' },
    { id: 'abaque-fdb-140', famille: 'Naturel', nom: 'Fibre de bois', epaisseurMm: 140, prixAchatHtM2: 14.76, usage: 'Combles', kind: 'panel_roll' },
    { id: 'abaque-ldv-160', famille: 'Minéral', nom: 'Laine de verre', epaisseurMm: 160, prixAchatHtM2: 8.20, usage: 'Combles', kind: 'panel_roll' },
    { id: 'abaque-ldr-160', famille: 'Minéral', nom: 'Laine de roche', epaisseurMm: 160, prixAchatHtM2: 9.84, usage: 'Combles', kind: 'panel_roll' },
    { id: 'abaque-fdb-160', famille: 'Naturel', nom: 'Fibre de bois', epaisseurMm: 160, prixAchatHtM2: 16.40, usage: 'Combles', kind: 'panel_roll' },
    { id: 'abaque-pse-blanc-80', famille: 'Synthétique', nom: 'PSE blanc', epaisseurMm: 80, prixAchatHtM2: 7.38, usage: 'ITE', kind: 'panel_roll' },
    { id: 'abaque-pse-graphite-100', famille: 'Synthétique', nom: 'PSE graphité', epaisseurMm: 100, prixAchatHtM2: 10.66, usage: 'ITE', kind: 'panel_roll' },
    { id: 'abaque-xps-80', famille: 'Synthétique', nom: 'XPS', epaisseurMm: 80, prixAchatHtM2: 13.12, usage: 'Soubassement', kind: 'panel_roll' },
    { id: 'abaque-pur-pir-80', famille: 'Synthétique', nom: 'PUR/PIR', epaisseurMm: 80, prixAchatHtM2: 18.04, usage: 'Toiture terrasse', kind: 'panel_roll' },
    { id: 'abaque-ouate-100', famille: 'Naturel', nom: 'Ouate de cellulose', epaisseurMm: 100, prixAchatHtM2: 9.02, usage: 'Combles', kind: 'panel_roll' },
    { id: 'abaque-chanvre-100', famille: 'Naturel', nom: 'Chanvre', epaisseurMm: 100, prixAchatHtM2: 12.30, usage: 'ITI', kind: 'panel_roll' },
    { id: 'abaque-lin-100', famille: 'Naturel', nom: 'Lin', epaisseurMm: 100, prixAchatHtM2: 13.12, usage: 'ITI', kind: 'panel_roll' },
    { id: 'abaque-liege-40', famille: 'Naturel', nom: 'Liège expansé', epaisseurMm: 40, prixAchatHtM2: 19.68, usage: 'ITE/sol', kind: 'panel_roll' },
    { id: 'combles-souffle-ldv-200', famille: 'Minéral', nom: 'Laine de verre soufflée', epaisseurMm: 200, prixAchatHtM2: 8, usage: 'Combles soufflés', kind: 'blown', rApprox: 5.0 },
    { id: 'combles-souffle-ldv-300', famille: 'Minéral', nom: 'Laine de verre soufflée', epaisseurMm: 300, prixAchatHtM2: 11, usage: 'Combles soufflés', kind: 'blown', rApprox: 7.5 },
    { id: 'combles-souffle-ldv-400', famille: 'Minéral', nom: 'Laine de verre soufflée', epaisseurMm: 400, prixAchatHtM2: 14, usage: 'Combles soufflés', kind: 'blown', rApprox: 10.0 },
    { id: 'combles-souffle-ldr-200', famille: 'Minéral', nom: 'Laine de roche soufflée', epaisseurMm: 200, prixAchatHtM2: 10, usage: 'Combles soufflés', kind: 'blown', rApprox: 5.4 },
    { id: 'combles-souffle-ldr-300', famille: 'Minéral', nom: 'Laine de roche soufflée', epaisseurMm: 300, prixAchatHtM2: 13, usage: 'Combles soufflés', kind: 'blown', rApprox: 8.1 },
    { id: 'combles-souffle-ouate-300', famille: 'Naturel', nom: 'Ouate de cellulose soufflée', epaisseurMm: 300, prixAchatHtM2: 15, usage: 'Combles soufflés', kind: 'blown', rApprox: 7.5 },
    { id: 'combles-souffle-ouate-400', famille: 'Naturel', nom: 'Ouate de cellulose soufflée', epaisseurMm: 400, prixAchatHtM2: 19, usage: 'Combles soufflés', kind: 'blown', rApprox: 10.0 },
    { id: 'combles-rouleau-ldv-200', famille: 'Minéral', nom: 'Laine de verre rouleau', epaisseurMm: 200, prixAchatHtM2: 9, usage: 'Combles rouleaux', kind: 'panel_roll', rApprox: 5.0 },
    { id: 'combles-rouleau-ldv-240', famille: 'Minéral', nom: 'Laine de verre rouleau', epaisseurMm: 240, prixAchatHtM2: 11, usage: 'Combles rouleaux', kind: 'panel_roll', rApprox: 6.0 },
    { id: 'combles-rouleau-ldv-300', famille: 'Minéral', nom: 'Laine de verre rouleau', epaisseurMm: 300, prixAchatHtM2: 14, usage: 'Combles rouleaux', kind: 'panel_roll', rApprox: 7.5 },
    { id: 'combles-rouleau-ldr-200', famille: 'Minéral', nom: 'Laine de roche rouleau', epaisseurMm: 200, prixAchatHtM2: 12, usage: 'Combles rouleaux', kind: 'panel_roll', rApprox: 5.4 },
    { id: 'combles-rouleau-ldr-300', famille: 'Minéral', nom: 'Laine de roche rouleau', epaisseurMm: 300, prixAchatHtM2: 16, usage: 'Combles rouleaux', kind: 'panel_roll', rApprox: 8.1 },
    { id: 'combles-rouleau-fdb-200', famille: 'Naturel', nom: 'Fibre de bois rouleau', epaisseurMm: 200, prixAchatHtM2: 22, usage: 'Combles rouleaux', kind: 'panel_roll', rApprox: 5.2 },
    { id: 'combles-rouleau-fdb-240', famille: 'Naturel', nom: 'Fibre de bois rouleau', epaisseurMm: 240, prixAchatHtM2: 25, usage: 'Combles rouleaux', kind: 'panel_roll', rApprox: 6.3 },
];
const getSuggestedOptimaRows = (heightM) => {
    // Guillaume : « un appui tous les 1,35 m » et, explicitement, 2 rangées à 2,80 m.
    // Les lisses haute/basse bornent le système ; on compte donc les rangées intermédiaires.
    const h = Math.max(0, Number(heightM) || 0);
    return Math.max(1, Math.ceil(h / exports.PLAQUISTE_RULES_2026_08.optima.espacementVerticalRangeeM) - 1);
};
exports.getSuggestedOptimaRows = getSuggestedOptimaRows;
const getPlaquistePlateLossPct = (ceilingType) => {
    if (!ceilingType)
        return exports.PLAQUISTE_RULES_2026_08.plaques.perteMurPct;
    return ceilingType === 'droit'
        ? exports.PLAQUISTE_RULES_2026_08.plaques.pertePlafondPct
        : exports.PLAQUISTE_RULES_2026_08.plaques.perteRampantPct;
};
exports.getPlaquistePlateLossPct = getPlaquistePlateLossPct;

};
modules['./types'] = function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

};
modules['./PlaquisteCalculateur'] = function(require,module,exports){
"use strict";
/**
 * Calculateur Plaquiste SpeedArti — évolution V2 du module V1.5 existant.
 *
 * Objectifs :
 * - conserver le contrat BaseCalculateur / ResultatCalcul utilisé par SpeedArti ;
 * - supprimer le ratio artificiel 60/40 ;
 * - calculer les murs réellement sélectionnés (cloison = 2 faces, doublage = 1) ;
 * - rattacher les ouvertures au mur concerné ;
 * - distinguer murs / plafonds / isolation / finitions ;
 * - appliquer les règles validées avec Guillaume en août 2026.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaquisteCalculateur = void 0;
const BaseCalculateur_1 = require("./BaseCalculateur");
const plaquisteBusinessRules_1 = require("./plaquisteBusinessRules");
const R = plaquisteBusinessRules_1.PLAQUISTE_RULES_2026_08;
const round2 = (n) => Math.round(n * 100) / 100;
const round3 = (n) => Math.round(n * 1000) / 1000;
const positive = (n) => Math.max(0, Number(n) || 0);
const PLATE_PRICE_M2 = {
    BA13: 5.50,
    BA13_abito: 8.50,
    BA13_phonique: 12,
    BA10: 4.80,
    BA15: 7,
    BA18: 9.50,
    Fermacell: 11,
    hydro: 8.50,
    feu: 10,
};
const PLATE_ARTICLE_ID = {
    BA13: 'plaque_ba13',
    BA13_abito: 'plaque_ba13_abito',
    BA13_phonique: 'plaque_ba13_phonique',
    BA10: 'plaque_ba10',
    BA15: 'plaque_ba15',
    BA18: 'plaque_ba18',
    Fermacell: 'plaque_fermacell',
    hydro: 'plaque_ba13_hydro',
    feu: 'plaque_ba13_feu',
};
class PlaquisteCalculateur extends BaseCalculateur_1.BaseCalculateur {
    async calculer(donnees, _regles) {
        this.validerDonnees(donnees);
        const geometry = this.buildGeometry(donnees);
        if (geometry.walls.length === 0 && geometry.ceilings.length === 0) {
            throw new Error('Ajoutez au moins un mur ou un plafond à chiffrer.');
        }
        this.validateIsolation(donnees);
        const surfaces = this.toResultSurfaces(geometry, donnees);
        const alerts = [...this.genererAlertes(donnees), ...geometry.warnings, ...this.buildTechnicalAlerts(donnees, geometry)];
        const hasActiveIsolation = !!(donnees.options?.isolation_cloison?.active || donnees.options?.isolation_doublage?.active || donnees.options?.isolation_plafond?.active);
        if (hasActiveIsolation && donnees.options?.isolation_marge_materiaux_pct === undefined) {
            alerts.push('⚠️ Marge matériaux isolation non renseignée : 0 % appliqué aux coûts d’achat de l’abaque. Renseignez la marge avant validation commerciale si nécessaire.');
        }
        let materials = [
            ...this.calculateWallPlates(donnees, geometry),
            ...this.calculateWallFraming(donnees, geometry),
            ...this.calculateCeilingMaterials(donnees, geometry),
            ...this.calculateScrews(donnees, geometry),
            ...this.calculateFinishInternalNeeds(donnees, geometry),
            ...this.calculateIsolationMaterials(donnees, geometry),
            ...this.calculateDirectSaleLines(donnees, geometry),
            ...this.calculateFreeArticles(donnees),
        ];
        // Les forfaits/plus-values sont des prix de vente directs : ils ne doivent pas
        // être remplacés par un prix catalogue. Les besoins internes de finition sont
        // enrichis pour la commande mais restent exclus du total vendu.
        const directSales = materials.filter((m) => m.article_id.startsWith('plq_sale_') || m.article_id.startsWith('plq_free_'));
        const catalogueMaterials = materials.filter((m) => !directSales.includes(m));
        const enriched = await this.enrichirAvecCatalogue(catalogueMaterials);
        const isolationMarginRaw = donnees.options?.isolation_marge_materiaux_pct;
        const isolationMarginPct = isolationMarginRaw === undefined || isolationMarginRaw === null || isolationMarginRaw === ''
            ? 0
            : Math.max(0, Number(isolationMarginRaw) || 0);
        enriched.forEach((m) => {
            if (m.notes?.includes('INTERNE_NON_FACTURE'))
                m.total_ht = 0;
            if (m.notes?.includes('SEMI_RIGIDE_X1.20')) {
                // Guillaume : le ×1,20 porte sur l'achat matière AVANT marge.
                m.prix_unitaire_ht = round2(m.prix_unitaire_ht * R.isolation.semiRigideCoefMatiere);
                m.total_ht = round2(m.quantite_finale * m.prix_unitaire_ht);
            }
            if (m.notes?.includes('ISOLATION_ACHAT')) {
                // Les prix de l'abaque sont des coûts d'achat HT/m² : transformation
                // explicite en prix de vente avec la marge choisie par l'artisan.
                const purchaseUnitPrice = m.prix_unitaire_ht;
                m.prix_unitaire_ht = round2(purchaseUnitPrice * (1 + isolationMarginPct / 100));
                m.total_ht = round2(m.quantite_finale * m.prix_unitaire_ht);
                m.notes = `${m.notes} · marge vente ${round2(isolationMarginPct)} %`;
            }
        });
        materials = [...enriched, ...directSales];
        const mainOeuvre = this.calculateLabour(donnees, geometry);
        const totaux = this.calculateTotals(materials, mainOeuvre, donnees);
        const stockStatus = this.calculateStockStatus(materials);
        const recommandations = this.genererRecommandations(donnees, surfaces);
        if (geometry.ceilings.some((c) => c.type !== 'droit')) {
            recommandations.push('💡 Plafond rampant : plus-value appliquée sans recalcul détaillé d’ossature supplémentaire.');
        }
        if (donnees.options?.doublage_systeme_fixation === 'optima') {
            recommandations.push('💡 Optima : vérifier les prix catalogue des appuis, clés et fixations avant validation du devis.');
        }
        return {
            surfaces,
            materiaux: materials,
            main_oeuvre: mainOeuvre,
            totaux,
            stock_status: stockStatus,
            recommandations,
            alertes: [...new Set(alerts)],
        };
    }
    // ---------------------------------------------------------------------------
    // Géométrie : source unique des surfaces utilisées par le moteur
    // ---------------------------------------------------------------------------
    buildGeometry(donnees) {
        const dim = donnees.dimensions || {};
        const pieces = dim.pieces || [];
        const lineaires = dim.metres_lineaires || [];
        const mode = dim.mode_saisie_plaquiste || (pieces.length ? 'pieces' : lineaires.length ? 'lineaire' : 'legacy');
        const walls = [];
        const ceilings = [];
        const warnings = [];
        if (mode === 'pieces') {
            pieces.forEach((piece) => {
                const L = positive(piece.longueur);
                const l = positive(piece.largeur);
                const h = positive(piece.hauteur);
                if ((piece.traiter_murs || piece.traiter_plafond) && (!L || !l || !h)) {
                    throw new Error(`Dimensions invalides pour « ${piece.nom} » : longueur, largeur et hauteur doivent être supérieures à zéro.`);
                }
                if (h > 4.15 && piece.traiter_murs) {
                    throw new Error(`« ${piece.nom} » dépasse 4,15 m de hauteur : validation technique spécifique obligatoire.`);
                }
                if (piece.traiter_murs !== false) {
                    const defaultWalls = [
                        { id: 'A', label: 'Mur A', actif: true, type: 'cloison', longueur_m: L, ouvertures: [] },
                        { id: 'B', label: 'Mur B', actif: true, type: 'cloison', longueur_m: l, ouvertures: [] },
                        { id: 'C', label: 'Mur C', actif: true, type: 'cloison', longueur_m: L, ouvertures: [] },
                        { id: 'D', label: 'Mur D', actif: true, type: 'cloison', longueur_m: l, ouvertures: [] },
                    ];
                    const sourceWalls = piece.murs?.length ? piece.murs : defaultWalls;
                    sourceWalls.forEach((mur) => {
                        if (!mur.actif || mur.type === 'null')
                            return;
                        const lengthM = positive(mur.longueur_m);
                        if (!lengthM || !h)
                            return;
                        const openings = (mur.ouvertures || []).map((o) => ({
                            widthM: positive(o.largeur_m),
                            heightM: positive(o.hauteur_m),
                            quantity: Math.max(0, Number(o.quantite) || 0),
                        }));
                        const openingsM2 = openings.reduce((sum, o) => sum + o.widthM * o.heightM * o.quantity, 0);
                        const grossOneSideM2 = lengthM * h;
                        if (openingsM2 > grossOneSideM2 + 0.0001) {
                            throw new Error(`Les ouvertures du ${mur.label || `mur ${mur.id}`} dépassent la surface brute du mur.`);
                        }
                        const netOneSideM2 = Math.max(0, grossOneSideM2 - openingsM2);
                        const type = mur.type;
                        walls.push({
                            id: `${piece.id}:${mur.id}`,
                            label: `${piece.nom} — ${mur.label || `Mur ${mur.id}`}`,
                            type,
                            lengthM,
                            heightM: h,
                            grossOneSideM2,
                            openingsM2,
                            netOneSideM2,
                            netCladdingM2: netOneSideM2 * (type === 'cloison' ? 2 : 1),
                            openings,
                            source: 'piece',
                            pieceId: piece.id,
                            optimaRowsOverride: mur.optima_nombre_rangees_appuis,
                        });
                    });
                }
                if (piece.traiter_plafond !== false && L && l) {
                    ceilings.push({
                        id: `ceiling:${piece.id}`,
                        label: `Plafond — ${piece.nom}`,
                        areaM2: L * l,
                        type: piece.type_plafond || 'droit',
                    });
                }
            });
        }
        else if (mode === 'lineaire') {
            lineaires.forEach((line) => {
                if (!line.traiter_murs) {
                    if (line.traiter_plafond)
                        warnings.push(`⚠️ ${line.nom} : le plafond n’est pas calculable en mode linéaire sans largeur.`);
                    return;
                }
                const lengthM = positive(line.longueur_ml);
                const heightM = positive(line.hauteur);
                if (!lengthM || !heightM)
                    throw new Error(`Dimensions invalides pour « ${line.nom} ».`);
                if (heightM > 4.15)
                    throw new Error(`« ${line.nom} » dépasse 4,15 m de hauteur : validation technique spécifique obligatoire.`);
                const type = line.type_paroi || 'cloison';
                const gross = lengthM * heightM;
                walls.push({
                    id: `linear:${line.id}`,
                    label: line.nom,
                    type,
                    lengthM,
                    heightM,
                    grossOneSideM2: gross,
                    openingsM2: 0,
                    netOneSideM2: gross,
                    netCladdingM2: gross * (type === 'cloison' ? 2 : 1),
                    openings: [],
                    source: 'lineaire',
                });
                if (line.traiter_plafond)
                    warnings.push(`⚠️ ${line.nom} : l’option plafond est ignorée en mode linéaire. Utilisez le mode Pièces pour le plafond.`);
            });
        }
        else {
            // Compatibilité minimale pour les anciens brouillons n'utilisant pas encore pieces[].
            const L = positive(dim.longueur);
            const l = positive(dim.largeur);
            const h = positive(dim.hauteur);
            if (!L || !l || !h)
                throw new Error('Dimensions Plaquiste incomplètes.');
            if (h > 4.15)
                throw new Error('Hauteur > 4,15 m : validation technique spécifique obligatoire.');
            const lengths = [L, l, L, l];
            lengths.forEach((lengthM, index) => {
                const gross = lengthM * h;
                walls.push({
                    id: `legacy:${index}`,
                    label: `Mur ${String.fromCharCode(65 + index)}`,
                    type: 'cloison',
                    lengthM,
                    heightM: h,
                    grossOneSideM2: gross,
                    openingsM2: 0,
                    netOneSideM2: gross,
                    netCladdingM2: gross * 2,
                    openings: [],
                    source: 'legacy',
                });
            });
            ceilings.push({ id: 'legacy:ceiling', label: 'Plafond', areaM2: L * l, type: 'droit' });
            warnings.push('⚠️ Ancien brouillon Plaquiste : données lues en compatibilité. Recréez le métrage en mode Pièces pour bénéficier de tous les réglages V2.');
        }
        const grossWallCladding = walls.reduce((sum, w) => sum + w.grossOneSideM2 * (w.type === 'cloison' ? 2 : 1), 0);
        const wallNetM2 = walls.reduce((sum, w) => sum + w.netCladdingM2, 0);
        const ceilingM2 = ceilings.reduce((sum, c) => sum + c.areaM2, 0);
        const cloisonWalls = walls.filter((w) => w.type === 'cloison');
        const doublageWalls = walls.filter((w) => w.type === 'doublage');
        return {
            walls,
            ceilings,
            warnings,
            grossM2: grossWallCladding + ceilingM2,
            netM2: wallNetM2 + ceilingM2,
            wallNetM2,
            ceilingM2,
            cloisonCladdingM2: cloisonWalls.reduce((sum, w) => sum + w.netCladdingM2, 0),
            cloisonSupportM2: cloisonWalls.reduce((sum, w) => sum + w.netOneSideM2, 0),
            doublageM2: doublageWalls.reduce((sum, w) => sum + w.netOneSideM2, 0),
        };
    }
    toResultSurfaces(geometry, donnees) {
        const opts = donnees.options || {};
        const wallLoss = Number(opts.perte_plaques_mur_pct ?? R.plaques.perteMurPct);
        const ceilingWithLoss = geometry.ceilings.reduce((sum, c) => {
            const pct = c.type === 'droit'
                ? Number(opts.perte_plaques_plafond_pct ?? R.plaques.pertePlafondPct)
                : Number(opts.perte_plaques_rampant_pct ?? R.plaques.perteRampantPct);
            return sum + c.areaM2 * (1 + pct / 100);
        }, 0);
        const withLoss = geometry.wallNetM2 * (1 + wallLoss / 100) + ceilingWithLoss;
        return {
            totale: round2(geometry.grossM2),
            nette: round2(geometry.netM2),
            avec_pertes: round2(withLoss),
            detail_par_face: {
                murs: round2(geometry.wallNetM2),
                plafond: round2(geometry.ceilingM2),
                cloison: round2(geometry.cloisonCladdingM2),
                doublage: round2(geometry.doublageM2),
                cloison_isolation: round2(geometry.cloisonSupportM2),
            },
        };
    }
    // ---------------------------------------------------------------------------
    // Plaques
    // ---------------------------------------------------------------------------
    calculateWallPlates(donnees, geometry) {
        const opts = donnees.options || {};
        const loss = Number(opts.perte_plaques_mur_pct ?? R.plaques.perteMurPct);
        const rows = [];
        const groups = [
            { type: 'cloison', surface: geometry.cloisonCladdingM2, plate: opts.cloison_type_materiau || 'BA13', doubleSkin: !!opts.cloison_double_peau },
            { type: 'doublage', surface: geometry.doublageM2, plate: opts.doublage_type_materiau || 'BA13', doubleSkin: !!opts.doublage_double_peau },
        ];
        groups.forEach((g) => {
            if (g.surface <= 0)
                return;
            rows.push(this.makePlateRow(`mur-${g.type}`, `${g.type === 'cloison' ? 'Cloisons' : 'Doublages'}`, g.plate, g.surface, g.doubleSkin ? 2 : 1, loss));
        });
        return rows;
    }
    makePlateRow(key, label, plateType, surfaceM2, skins, lossPct) {
        // Le catalogue actuel du dépôt fournit le prix au m² et la plaque standard 2,50×1,20.
        // La règle 1,20 m est conservée ; le vrai choix de hauteur commerciale supérieure
        // dépendra des formats présents dans le catalogue connecté, sans inventer de format.
        const defaultPlateAreaM2 = 2.5 * R.plaques.largeurCommercialeM;
        const theoreticalPurchasedSurface = surfaceM2 * skins;
        const requiredSurface = theoreticalPurchasedSurface * (1 + lossPct / 100);
        const plateCount = Math.ceil(requiredSurface / defaultPlateAreaM2);
        const purchasedSurfaceM2 = plateCount * defaultPlateAreaM2;
        const unitPrice = PLATE_PRICE_M2[plateType] ?? 0;
        return {
            article_id: PLATE_ARTICLE_ID[plateType] || `plaque_${plateType}`,
            nom: `Plaque ${plateType} — ${label}${skins === 2 ? ' — double peau' : ''}`,
            categorie: 'Plaques de plâtre',
            quantite_theorique: round2(theoreticalPurchasedSurface),
            quantite_avec_perte: round2(requiredSurface),
            quantite_finale: round2(purchasedSurfaceM2),
            unite: 'm2',
            prix_unitaire_ht: unitPrice,
            total_ht: round2(purchasedSurfaceM2 * unitPrice),
            stock_disponible: 0,
            a_commander: round2(purchasedSurfaceM2),
            coef_perte_applique: 1 + lossPct / 100,
            conditionnement: defaultPlateAreaM2,
            notes: `${plateCount} plaque(s) sur la base du format catalogue standard 2,50×1,20 ; perte ${lossPct} %. La hauteur commerciale supérieure doit être résolue par le catalogue lorsqu’un format dédié existe.`,
        };
    }
    // ---------------------------------------------------------------------------
    // Ossature murs et Optima
    // ---------------------------------------------------------------------------
    calculateWallFraming(donnees, geometry) {
        const opts = donnees.options || {};
        const systemeDoublage = opts.doublage_systeme_fixation || 'classique';
        const spacingM = Math.max(0.4, Math.min(0.6, (Number(opts.entraxe_montants) || 60) / 100));
        const doubled = !!opts.doublage_montants;
        const profile = this.resolveProfile(opts.type_ossature || '48/50');
        let railsMl = 0;
        let studsMl = 0;
        let optimaFurringMl = 0;
        let optimaClipMl = 0;
        let optimaSupports = 0;
        let optimaKeys = 0;
        let optimaFixings = 0;
        geometry.walls.forEach((wall) => {
            const isOptima = wall.type === 'doublage' && systemeDoublage === 'optima';
            if (isOptima) {
                const rows = Math.max(1, Number(wall.optimaRowsOverride || opts.optima_nombre_rangees_appuis) || (0, plaquisteBusinessRules_1.getSuggestedOptimaRows)(wall.heightM));
                optimaFurringMl += wall.netOneSideM2 * R.optima.fourrureF530MlM2;
                optimaClipMl += wall.netOneSideM2 * R.optima.lisseClipMlM2;
                optimaSupports += wall.netOneSideM2 * R.optima.appuiUniteM2;
                optimaKeys += wall.netOneSideM2 * R.optima.cleUniteM2;
                optimaFixings += wall.netOneSideM2 * R.optima.fixationsUniteM2ParRangee * rows;
                return;
            }
            const openingHorizontalMl = wall.openings.reduce((sum, o) => sum + 2 * o.widthM * o.quantity, 0);
            const openingStuds = wall.openings.reduce((sum, o) => sum + R.ossature.ouvertureMontantsTouteHauteur * o.quantity, 0);
            const positions = Math.ceil(wall.lengthM / spacingM) + 1;
            const baseStuds = positions * (doubled ? 2 : 1);
            railsMl += 2 * wall.lengthM + openingHorizontalMl;
            studsMl += (baseStuds + openingStuds) * wall.heightM;
        });
        const rows = [];
        if (railsMl > 0)
            rows.push(this.makeLinearMaterial(profile.railId, `Rails ${profile.label}`, 'Ossature métallique', railsMl, R.ossature.pertePct, profile.railDefaultPrice, 3));
        if (studsMl > 0)
            rows.push(this.makeLinearMaterial(profile.studId, `Montants ${profile.label}${doubled ? ' — doublés' : ''}`, 'Ossature métallique', studsMl, R.ossature.pertePct, profile.studDefaultPrice, 2.5));
        if (optimaFurringMl > 0) {
            rows.push(this.makeLinearMaterial('fourrure', 'Fourrures F530 Optima', 'Ossature Optima', optimaFurringMl, R.ossature.pertePct, 1.90, 3));
            rows.push(this.makeLinearMaterial('optima_lisse_clip', 'Lisses Clip Optima', 'Ossature Optima', optimaClipMl, R.ossature.pertePct, 0, 2.35));
            rows.push(this.makeUnitMaterial('optima_appui', 'Appuis Optima', 'Ossature Optima', optimaSupports, R.ossature.pertePct, 0, 'Prix catalogue requis — aucune valeur inventée.'));
            rows.push(this.makeUnitMaterial('optima_cle', 'Clés Optima', 'Ossature Optima', optimaKeys, R.ossature.pertePct, 0, 'Prix catalogue requis — aucune valeur inventée.'));
            rows.push(this.makeUnitMaterial('optima_fixation', 'Fixations d’appuis Optima', 'Ossature Optima', optimaFixings, R.ossature.pertePct, 0, '2 fixations/m² par rangée d’appuis ; prix catalogue requis.'));
        }
        return rows;
    }
    resolveProfile(typeOssature) {
        if (typeOssature === '72/50')
            return { label: '72 mm', railId: 'rail_72', studId: 'montant_72', railDefaultPrice: 0, studDefaultPrice: 0, widthMm: 72 };
        if (typeOssature === '100/50' || typeOssature === '100_garage')
            return { label: '100 mm', railId: 'rail_100', studId: 'montant_100', railDefaultPrice: 0, studDefaultPrice: 0, widthMm: 100 };
        return { label: '48 mm', railId: 'rail_48', studId: 'montant_48', railDefaultPrice: 1.80, studDefaultPrice: 2.10, widthMm: 48 };
    }
    makeLinearMaterial(articleId, nom, categorie, theoreticalMl, lossPct, pricePerMl, barLengthM) {
        const withLoss = theoreticalMl * (1 + lossPct / 100);
        const bars = Math.ceil(withLoss / barLengthM);
        const purchasedMl = bars * barLengthM;
        return {
            article_id: articleId,
            nom,
            categorie,
            quantite_theorique: round2(theoreticalMl),
            quantite_avec_perte: round2(withLoss),
            quantite_finale: round2(purchasedMl),
            unite: 'ml',
            prix_unitaire_ht: pricePerMl,
            total_ht: round2(purchasedMl * pricePerMl),
            stock_disponible: 0,
            a_commander: round2(purchasedMl),
            coef_perte_applique: 1 + lossPct / 100,
            conditionnement: barLengthM,
            notes: `${bars} barre(s) de ${String(barLengthM).replace('.', ',')} m`,
        };
    }
    makeUnitMaterial(articleId, nom, categorie, theoretical, lossPct, unitPrice, notes) {
        const withLoss = theoretical * (1 + lossPct / 100);
        const final = Math.ceil(withLoss);
        return {
            article_id: articleId,
            nom,
            categorie,
            quantite_theorique: round2(theoretical),
            quantite_avec_perte: round2(withLoss),
            quantite_finale: final,
            unite: 'unité',
            prix_unitaire_ht: unitPrice,
            total_ht: round2(final * unitPrice),
            stock_disponible: 0,
            a_commander: final,
            coef_perte_applique: 1 + lossPct / 100,
            notes,
        };
    }
    // ---------------------------------------------------------------------------
    // Plafonds
    // ---------------------------------------------------------------------------
    calculateCeilingMaterials(donnees, geometry) {
        const opts = donnees.options || {};
        if (geometry.ceilingM2 <= 0)
            return [];
        const rows = [];
        const plateType = opts.plafond_type_materiau || opts.cloison_type_materiau || 'BA13';
        const skins = opts.plafond_double_peau ? 2 : 1;
        ['droit', 'rampant', 'rampant_complexe'].forEach((type) => {
            const area = geometry.ceilings.filter((c) => c.type === type).reduce((sum, c) => sum + c.areaM2, 0);
            if (!area)
                return;
            const loss = type === 'droit'
                ? Number(opts.perte_plaques_plafond_pct ?? R.plaques.pertePlafondPct)
                : Number(opts.perte_plaques_rampant_pct ?? R.plaques.perteRampantPct);
            rows.push(this.makePlateRow(`ceiling-${type}`, type === 'droit' ? 'Plafonds droits' : 'Plafonds rampants', plateType, area, skins, loss));
        });
        // Besoins techniques du plafond droit réutilisés aussi pour le rampant :
        // la différence de rampant reste une plus-value simplifiée, conformément à Guillaume.
        rows.push(this.makeLinearMaterial('fourrure', 'Fourrures plafond', 'Ossature plafond', geometry.ceilingM2 * 1.67, 0, 1.90, 3));
        rows.push(this.makeUnitMaterial('suspente', 'Suspentes plafond — longueur à choisir au catalogue', 'Ossature plafond', geometry.ceilingM2 * 1.45, 0, 0.85, 'La longueur de suspente doit être confirmée par l’artisan/catalogue.'));
        rows.push(this.makeLinearMaterial('corniere_plafond', 'Cornières plafond', 'Ossature plafond', geometry.ceilingM2 * 0.42, 0, 0, 3));
        rows.push(this.makeUnitMaterial('eclisse_plafond', 'Éclisses plafond', 'Ossature plafond', geometry.ceilingM2 * 0.20, 0, 0, 'Prix catalogue requis.'));
        rows.push(this.makeUnitMaterial('cavalier_plafond', 'Cavaliers / connecteurs plafond', 'Ossature plafond', geometry.ceilingM2 * 0.35, 0, 0, 'Prix catalogue requis.'));
        return rows;
    }
    // ---------------------------------------------------------------------------
    // Vis, finitions, isolation
    // ---------------------------------------------------------------------------
    calculateScrews(donnees, geometry) {
        const opts = donnees.options || {};
        const cloisonSkins = opts.cloison_double_peau ? 2 : 1;
        const doublageSkins = opts.doublage_double_peau ? 2 : 1;
        const ceilingSkins = opts.plafond_double_peau ? 2 : 1;
        let theoretical = 0;
        theoretical += geometry.cloisonCladdingM2 * (R.vis.premierePeauMurParM2 + (cloisonSkins === 2 ? R.vis.secondePeauParM2 : 0));
        theoretical += geometry.doublageM2 * (R.vis.premierePeauMurParM2 + (doublageSkins === 2 ? R.vis.secondePeauParM2 : 0));
        theoretical += geometry.ceilingM2 * (R.vis.premierePeauPlafondParM2 + (ceilingSkins === 2 ? R.vis.secondePeauParM2 : 0));
        if (!theoretical)
            return [];
        const withLoss = theoretical * (1 + R.vis.pertePct / 100);
        const boxes = Math.ceil(withLoss / R.vis.boiteUnites);
        const finalUnits = boxes * R.vis.boiteUnites;
        return [{
                article_id: 'vis_plaque',
                nom: 'Vis plaques — murs et plafonds',
                categorie: 'Fixations',
                quantite_theorique: Math.ceil(theoretical),
                quantite_avec_perte: Math.ceil(withLoss),
                quantite_finale: finalUnits,
                unite: 'unité',
                prix_unitaire_ht: 0.012,
                total_ht: round2(finalUnits * 0.012),
                stock_disponible: 0,
                a_commander: finalUnits,
                coef_perte_applique: 1 + R.vis.pertePct / 100,
                conditionnement: R.vis.boiteUnites,
                notes: `${boxes} boîte(s) de ${R.vis.boiteUnites} vis. Première peau : 25/m² murs, 18/m² plafond ; seconde peau +20/m².`,
            }];
    }
    calculateFinishInternalNeeds(donnees, geometry) {
        const opts = donnees.options || {};
        const level = (opts.finition_niveau || this.finishFromLegacy(opts.finition));
        if (level === 'aucune')
            return [];
        const bandMl = geometry.wallNetM2 * R.finitions.bandeMurMlM2 + geometry.ceilingM2 * R.finitions.bandePlafondMlM2;
        const compoundKg = geometry.wallNetM2 * R.finitions.enduitMurKgM2 + geometry.ceilingM2 * R.finitions.enduitPlafondKgM2;
        const bandRollM = 50;
        const compoundBucketKg = 25;
        return [
            {
                article_id: 'bande_papier', nom: 'Bande à joint — besoin interne inclus dans le forfait finition', categorie: 'Finitions — besoin interne',
                quantite_theorique: round2(bandMl), quantite_avec_perte: round2(bandMl), quantite_finale: Math.ceil(bandMl / bandRollM) * bandRollM,
                unite: 'ml', prix_unitaire_ht: 0.15, total_ht: 0, stock_disponible: 0, a_commander: Math.ceil(bandMl / bandRollM) * bandRollM,
                coef_perte_applique: 1, conditionnement: bandRollM, notes: 'INTERNE_NON_FACTURE · Le forfait finition est la seule ligne de vente.',
            },
            {
                article_id: 'enduit_joint', nom: 'Enduit à joint — besoin interne inclus dans le forfait finition', categorie: 'Finitions — besoin interne',
                quantite_theorique: round2(compoundKg), quantite_avec_perte: round2(compoundKg), quantite_finale: Math.ceil(compoundKg / compoundBucketKg) * compoundBucketKg,
                unite: 'kg', prix_unitaire_ht: 0.65, total_ht: 0, stock_disponible: 0, a_commander: Math.ceil(compoundKg / compoundBucketKg) * compoundBucketKg,
                coef_perte_applique: 1, conditionnement: compoundBucketKg, notes: 'INTERNE_NON_FACTURE · Les joints horizontaux sont déjà inclus ; aucune ligne supplémentaire.',
            },
        ];
    }
    calculateIsolationMaterials(donnees, geometry) {
        const opts = donnees.options || {};
        const rows = [];
        const targets = [
            { key: 'cloison', label: 'Cloisons', surface: geometry.cloisonSupportM2, config: opts.isolation_cloison },
            { key: 'doublage', label: 'Doublages', surface: geometry.doublageM2, config: opts.isolation_doublage },
            { key: 'plafond', label: 'Plafonds', surface: geometry.ceilingM2, config: opts.isolation_plafond },
        ];
        targets.forEach(({ key, label, surface, config }) => {
            if (!config?.active || surface <= 0)
                return;
            rows.push(this.makeIsolationLayerRow(config, surface, `${key}:1`, `${label} — couche 1`));
            if (config.double_couche && config.deuxieme_couche) {
                rows.push(this.makeIsolationLayerRow(config.deuxieme_couche, surface, `${key}:2`, `${label} — couche 2`));
            }
        });
        return rows;
    }
    makeIsolationLayerRow(layer, surface, key, label) {
        const lossPct = layer.kind === 'blown' ? R.isolation.perteSoufflePct : R.isolation.pertePanneauxRouleauxPct;
        const withLoss = surface * (1 + lossPct / 100);
        // Prix de base avant enrichissement catalogue. Le coefficient semi-rigide
        // est appliqué une seule fois après résolution du prix catalogue/override.
        const price = positive(layer.prix_m2_ht);
        return {
            article_id: layer.reference_abaque || layer.type_isolant || `isolant_${key}`,
            nom: `${label}${layer.semi_rigide ? ' — semi-rigide' : ''}${layer.epaisseur_mm ? ` — ${layer.epaisseur_mm} mm` : ''}`,
            categorie: 'Isolation',
            quantite_theorique: round2(surface),
            quantite_avec_perte: round2(withLoss),
            quantite_finale: round2(withLoss),
            unite: 'm2',
            prix_unitaire_ht: round2(price),
            total_ht: round2(withLoss * price),
            stock_disponible: 0,
            a_commander: round2(withLoss),
            coef_perte_applique: 1 + lossPct / 100,
            notes: `ISOLATION_ACHAT · ${layer.kind === 'blown' ? 'Isolant soufflé : 3 % de perte' : 'Panneau/rouleau : 10 % de perte'} · coût d’achat HT/m²${layer.semi_rigide ? ' · SEMI_RIGIDE_X1.20' : ''}${layer.usage ? ` · usage ${layer.usage}` : ''}`,
        };
    }
    // ---------------------------------------------------------------------------
    // Prix directs / prestations
    // ---------------------------------------------------------------------------
    calculateDirectSaleLines(donnees, geometry) {
        const opts = donnees.options || {};
        const rows = [];
        const addSale = (id, label, qty, unit, unitPrice, notes) => {
            if (qty <= 0 || unitPrice < 0)
                return;
            rows.push({
                article_id: `plq_sale_${id}`, nom: label, categorie: 'Prestations Plaquiste',
                quantite_theorique: round2(qty), quantite_avec_perte: round2(qty), quantite_finale: round2(qty), unite: unit,
                prix_unitaire_ht: round2(unitPrice), total_ht: round2(qty * unitPrice), stock_disponible: 0, a_commander: 0,
                coef_perte_applique: 1, notes,
            });
        };
        const finish = (opts.finition_niveau || this.finishFromLegacy(opts.finition));
        const finishPrice = R.finitions.prixVenteHtM2[finish];
        if (finishPrice > 0)
            addSale('finish', `Finition ${this.finishLabel(finish)}`, geometry.netM2, 'm2', finishPrice, 'Forfait complet : bandes/enduit non refacturés séparément.');
        if ((finish === 'pret_a_peindre' || finish === 'soignee') && opts.finition_impression)
            addSale('impression', 'Impression', geometry.netM2, 'm2', R.finitions.impressionHtM2);
        if (opts.reprise_existant)
            addSale('reprise_existant', 'Reprise sur existant — forfait chantier', 1, 'forfait', Number(opts.reprise_existant_prix_ht ?? R.optionsDirectes.repriseExistantHt));
        if (opts.acces_difficile)
            addSale('acces_difficile', 'Accès difficile — forfait chantier', 1, 'forfait', Number(opts.acces_difficile_prix_ht ?? R.optionsDirectes.accesDifficileHt));
        geometry.walls.forEach((wall) => {
            if (wall.heightM > R.optionsDirectes.seuilGrandeHauteurM) {
                addSale(`grande_hauteur_${wall.id}`, `Plus-value grande hauteur — ${wall.label}`, wall.netCladdingM2, 'm2', R.optionsDirectes.grandeHauteurHtM2, 'Cloison : somme des deux faces nettes ; doublage : une face nette.');
            }
        });
        geometry.ceilings.forEach((ceiling) => {
            if (ceiling.type === 'rampant')
                addSale(`rampant_${ceiling.id}`, `Plus-value rampant — ${ceiling.label}`, ceiling.areaM2, 'm2', R.optionsDirectes.rampantHtM2, 'Plus-value simplifiée sans recalcul d’ossature supplémentaire.');
            if (ceiling.type === 'rampant_complexe')
                addSale(`rampant_complexe_${ceiling.id}`, `Plus-value rampant complexe — ${ceiling.label}`, ceiling.areaM2, 'm2', R.optionsDirectes.rampantComplexeHtM2, 'Plus-value simplifiée sans recalcul d’ossature supplémentaire.');
        });
        if (opts.nombreuses_decoupes_spots)
            addSale('decoupes_spots', 'Nombreuses découpes / spots', geometry.netM2, 'm2', R.optionsDirectes.nombreusesDecoupesSpotsHtM2);
        const isoTargets = [
            { key: 'cloison', label: 'cloisons', surface: geometry.cloisonSupportM2, cfg: opts.isolation_cloison, allowMembranes: false },
            { key: 'doublage', label: 'doublages', surface: geometry.doublageM2, cfg: opts.isolation_doublage, allowMembranes: true },
            { key: 'plafond', label: 'plafonds', surface: geometry.ceilingM2, cfg: opts.isolation_plafond, allowMembranes: false },
        ];
        isoTargets.forEach(({ key, label, surface, cfg, allowMembranes }) => {
            if (!cfg?.active || surface <= 0)
                return;
            if (cfg.double_couche && cfg.deuxieme_couche) {
                const crossed = cfg.pose_croisee ? R.isolation.poseCroiseeCoefMainOeuvre : 1;
                addSale(`isolation_double_${key}`, `Plus-value pose isolation 2 couches${cfg.pose_croisee ? ' croisées' : ''} — ${label}`, surface, 'm2', round2(R.isolation.secondeCouchePoseHtM2 * crossed));
            }
            if (allowMembranes && cfg.pare_vapeur)
                addSale(`pare_vapeur_${key}`, `Pare-vapeur — ${label}`, surface, 'm2', R.isolation.pareVapeurPrixVenteHtM2, 'Prix de vente direct.');
            if (allowMembranes && cfg.frein_vapeur)
                addSale(`frein_vapeur_${key}`, `Membrane hygrovariable / frein-vapeur — ${label}`, surface, 'm2', R.isolation.freinVapeurPrixVenteHtM2, 'Prix de vente direct. Cumulable avec pare-vapeur.');
        });
        ['caissons', 'niches', 'eclairage_integre'].forEach((key) => {
            if (!opts[key])
                return;
            const qty = positive(opts[`${key}_quantite`] ?? 1);
            const price = positive(opts[`${key}_prix_unitaire`] ?? 0);
            if (price > 0)
                addSale(`manuel_${key}`, this.manualOptionLabel(key), qty, 'unité', price, 'Prix saisi manuellement par l’artisan.');
        });
        return rows;
    }
    calculateFreeArticles(donnees) {
        const opts = donnees.options || {};
        const articles = opts.articles_libres || [];
        return articles.filter((a) => positive(a.quantite) > 0).map((a, index) => {
            const quantity = positive(a.quantite);
            const price = positive(a.prix_unitaire_ht);
            return {
                article_id: `plq_free_${index}_${String(a.nom || 'article').replace(/\W+/g, '_').toLowerCase()}`,
                nom: a.nom || 'Article complémentaire', categorie: 'Articles complémentaires',
                quantite_theorique: quantity, quantite_avec_perte: quantity, quantite_finale: quantity, unite: a.unite || 'unité',
                prix_unitaire_ht: price, total_ht: round2(quantity * price), stock_disponible: 0, a_commander: 0,
                coef_perte_applique: 1, notes: 'Article libre saisi manuellement.',
            };
        });
    }
    // ---------------------------------------------------------------------------
    // Main-d'œuvre
    // ---------------------------------------------------------------------------
    calculateLabour(donnees, geometry) {
        const opts = donnees.options || {};
        const complexite = (opts.complexite || 'moyenne');
        const complexityCoef = R.mainOeuvre.complexiteCoef[complexite] ?? 1;
        const doubledStudCoef = opts.doublage_montants ? R.mainOeuvre.montantsDoublesCoef : 1;
        const accumulator = { hours: 0, rows: [] };
        const systemeDoublage = opts.doublage_systeme_fixation || 'classique';
        const add = (label, baseHours, isolation) => {
            const semiRigid = isolation?.active && (isolation.semi_rigide || (isolation.double_couche && isolation.deuxieme_couche?.semi_rigide));
            const semiCoef = semiRigid ? R.isolation.semiRigideCoefMainOeuvre : 1;
            const hours = baseHours * complexityCoef * semiCoef;
            if (hours <= 0)
                return;
            accumulator.hours += hours;
            accumulator.rows.push({ poste: label, temps_heures: round2(hours) });
        };
        geometry.walls.filter((w) => w.type === 'cloison').forEach((wall) => {
            const second = opts.cloison_double_peau ? wall.netCladdingM2 * R.mainOeuvre.secondePeauHParM2 : 0;
            const base = wall.netOneSideM2 * R.mainOeuvre.cloisonHParM2 * doubledStudCoef + second;
            add(`Pose cloison — ${wall.label}`, base, opts.isolation_cloison);
        });
        geometry.walls.filter((w) => w.type === 'doublage').forEach((wall) => {
            let rate = R.mainOeuvre.doublageClassiqueSansIsolantHParM2;
            if (systemeDoublage === 'optima')
                rate = R.mainOeuvre.doublageOptimaHParM2;
            else if (opts.isolation_doublage?.active)
                rate = R.mainOeuvre.doublageClassiqueAvecIsolantHParM2;
            const second = opts.doublage_double_peau ? wall.netOneSideM2 * R.mainOeuvre.secondePeauHParM2 : 0;
            const base = wall.netOneSideM2 * rate * doubledStudCoef + second;
            add(`Pose doublage ${systemeDoublage} — ${wall.label}`, base, opts.isolation_doublage);
        });
        geometry.ceilings.forEach((ceiling) => {
            const second = opts.plafond_double_peau ? ceiling.areaM2 * R.mainOeuvre.secondePeauHParM2 : 0;
            add(`Pose plafond — ${ceiling.label}`, ceiling.areaM2 * R.mainOeuvre.plafondDroitHParM2 + second, opts.isolation_plafond);
        });
        const tauxHoraire = Number(opts.taux_horaire ?? 45);
        const nbOuvriers = Math.max(1, Number(opts.nb_ouvriers) || 1);
        return {
            temps_estime_heures: round2(accumulator.hours / nbOuvriers),
            decomposition: accumulator.rows,
            taux_horaire: tauxHoraire,
            nombre_ouvriers: nbOuvriers,
            cout_total: round2(accumulator.hours * tauxHoraire),
        };
    }
    // ---------------------------------------------------------------------------
    // Validation / alertes / totaux
    // ---------------------------------------------------------------------------
    validateIsolation(donnees) {
        const opts = donnees.options || {};
        const configs = [
            { label: 'cloison', cfg: opts.isolation_cloison },
            { label: 'doublage', cfg: opts.isolation_doublage },
            { label: 'plafond', cfg: opts.isolation_plafond },
        ];
        configs.forEach(({ label, cfg }) => {
            if (!cfg?.active)
                return;
            if (!cfg.validation_artisan)
                throw new Error(`Isolation ${label} : validez explicitement l’isolant et son épaisseur avant calcul.`);
            if (cfg.pose_croisee && !(cfg.double_couche && cfg.deuxieme_couche))
                throw new Error(`Isolation ${label} : la pose croisée n’est possible qu’avec deux couches.`);
            if (cfg.double_couche && !cfg.deuxieme_couche)
                throw new Error(`Isolation ${label} : choisissez la deuxième couche.`);
        });
    }
    buildTechnicalAlerts(donnees, geometry) {
        const opts = donnees.options || {};
        const alerts = [];
        const profile = this.resolveProfile(opts.type_ossature || '48/50');
        const configs = [
            { label: 'cloison', cfg: opts.isolation_cloison },
            { label: 'doublage', cfg: opts.isolation_doublage },
        ];
        configs.forEach(({ label, cfg }) => {
            if (!cfg?.active)
                return;
            const thicknesses = [cfg.epaisseur_mm, cfg.double_couche ? cfg.deuxieme_couche?.epaisseur_mm : undefined].filter((v) => typeof v === 'number');
            if (thicknesses.some((value) => value > profile.widthMm)) {
                alerts.push(`⚠️ Isolation ${label} : épaisseur supérieure au profil ${profile.widthMm} mm. Vérification artisan requise, sans blocage automatique.`);
            }
        });
        geometry.walls.forEach((wall) => {
            if (wall.heightM > 3.45 && wall.heightM <= 4.15 && profile.widthMm === 48)
                alerts.push(`⚠️ ${wall.label} : hauteur ${wall.heightM.toFixed(2)} m. Ne pas forcer du M48 ; choix M70/M90 ou solution technique à confirmer.`);
            if (wall.heightM > 2.8 && !opts.doublage_montants && profile.widthMm === 48)
                alerts.push(`⚠️ ${wall.label} : vérifier le renforcement des montants selon la hauteur.`);
        });
        if (opts.renforts_ossature)
            alerts.push('⚠️ Renforts bois activés : ajoutez l’article/prix correspondant dans les articles complémentaires si nécessaire.');
        if (opts.doublage_systeme_fixation === 'optima')
            alerts.push('⚠️ Optima : les quantités Appui/Clé/fixations sont calculées, mais leur prix doit être fourni par le catalogue.');
        return alerts;
    }
    calculateTotals(materials, labour, donnees) {
        const materiauxHT = round2(materials.reduce((sum, m) => sum + (Number(m.total_ht) || 0), 0));
        const mainOeuvreHT = round2(labour.cout_total);
        const totalHT = round2(materiauxHT + mainOeuvreHT);
        const taux = this.getTauxTVA(donnees);
        const tva = this.calculerTVA(totalHT, taux);
        return { materiaux_ht: materiauxHT, main_oeuvre_ht: mainOeuvreHT, total_ht: totalHT, tva, total_ttc: round2(totalHT + tva) };
    }
    calculateStockStatus(materials) {
        const missing = [];
        materials.forEach((m) => {
            if (m.article_id.startsWith('plq_sale_') || m.article_id.startsWith('plq_free_'))
                return;
            const explicitStock = m.catalogue_item && typeof m.catalogue_item.quantite_stock === 'number' ? Number(m.catalogue_item.quantite_stock) : undefined;
            if (explicitStock !== undefined) {
                m.stock_disponible = explicitStock;
                if (m.a_commander > explicitStock)
                    missing.push({ article_id: m.article_id, nom: m.nom, quantite_manquante: round2(m.a_commander - explicitStock) });
            }
        });
        return { disponible: missing.length === 0, articles_manquants: missing };
    }
    finishFromLegacy(value) {
        if (value === 'peinture' || value === 'papier_peint')
            return 'pret_a_peindre';
        if (value === 'carrelage_mur' || value === 'enduit')
            return 'bandes';
        return 'bandes';
    }
    finishLabel(level) {
        if (level === 'bandes')
            return 'bandes';
        if (level === 'pret_a_peindre')
            return 'prêt à peindre';
        if (level === 'soignee')
            return 'soignée';
        return 'aucune';
    }
    manualOptionLabel(key) {
        if (key === 'caissons')
            return 'Caissons / coffrage gaines';
        if (key === 'niches')
            return 'Niches murales';
        return 'Éclairage intégré / prestation complémentaire';
    }
    genererRecommandations(donnees, surfaces) {
        const reco = [];
        const opts = donnees.options || {};
        if (opts.isolation_cloison?.active || opts.isolation_doublage?.active || opts.isolation_plafond?.active)
            reco.push(`💡 Isolation : prix de l’abaque traités comme coûts d’achat HT/m² puis margés à ${round2(Number(opts.isolation_marge_materiaux_pct) || 0)} % dans ce chiffrage.`);
        if (surfaces.nette > 50)
            reco.push('💡 Grand chantier : envisager la location d’un lève-plaque.');
        if (opts.cloison_type_materiau === 'hydro' || opts.doublage_type_materiau === 'hydro' || opts.plafond_type_materiau === 'hydro')
            reco.push('💡 Plaque hydrofuge : vérifier la ventilation et l’usage de la pièce.');
        return reco;
    }
}
exports.PlaquisteCalculateur = PlaquisteCalculateur;

};
function require(name){ if(cache[name]) return cache[name].exports; if(!modules[name]) throw new Error("Module introuvable: "+name); const module={exports:{}}; cache[name]=module; modules[name](require,module,module.exports); return module.exports;}
const calcMod=require("./PlaquisteCalculateur"); const rulesMod=require("./plaquisteBusinessRules"); global.SpeedArtiPlaquisteReal={ PlaquisteCalculateur: calcMod.PlaquisteCalculateur, rules: rulesMod.PLAQUISTE_RULES_2026_08, abaque: rulesMod.PLAQUISTE_ISOLATION_ABAQUE_V2, getSuggestedOptimaRows: rulesMod.getSuggestedOptimaRows, getPlaquistePlateLossPct: rulesMod.getPlaquistePlateLossPct };
})(typeof window!=="undefined"?window:globalThis);
