import { importShared } from './__federation_fn_import-BMMB1g9W.js';

const plusWhite = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(255,%20255,%20255)'%20d='M352%20128C352%20110.3%20337.7%2096%20320%2096C302.3%2096%20288%20110.3%20288%20128L288%20288L128%20288C110.3%20288%2096%20302.3%2096%20320C96%20337.7%20110.3%20352%20128%20352L288%20352L288%20512C288%20529.7%20302.3%20544%20320%20544C337.7%20544%20352%20529.7%20352%20512L352%20352L512%20352C529.7%20352%20544%20337.7%20544%20320C544%20302.3%20529.7%20288%20512%20288L352%20288L352%20128z'/%3e%3c/svg%3e";

const plusBlack = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20d='M352%20128C352%20110.3%20337.7%2096%20320%2096C302.3%2096%20288%20110.3%20288%20128L288%20288L128%20288C110.3%20288%2096%20302.3%2096%20320C96%20337.7%20110.3%20352%20128%20352L288%20352L288%20512C288%20529.7%20302.3%20544%20320%20544C337.7%20544%20352%20529.7%20352%20512L352%20352L512%20352C529.7%20352%20544%20337.7%20544%20320C544%20302.3%20529.7%20288%20512%20288L352%20288L352%20128z'/%3e%3c/svg%3e";

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _sfc_main$4 = {  };
const {createElementVNode:_createElementVNode$4,openBlock:_openBlock$5,createElementBlock:_createElementBlock$5} = await importShared('vue');


const _hoisted_1$4 = { class: "starbar" };

function _sfc_render(_ctx, _cache) {
  return (_openBlock$5(), _createElementBlock$5("div", _hoisted_1$4, _cache[0] || (_cache[0] = [
    _createElementVNode$4("div", { class: "left-bar" }, null, -1),
    _createElementVNode$4("p", null, "⭐️", -1),
    _createElementVNode$4("div", { class: "right-bar" }, null, -1)
  ])))
}
const StarBar = /*#__PURE__*/_export_sfc(_sfc_main$4, [['render',_sfc_render],['__scopeId',"data-v-3600db60"]]);

const {defineStore} = await importShared('pinia');

const {ref: ref$4} = await importShared('vue');



const useBudgetStore = defineStore('budget', () => {

    //budget sélectionné
    const selectedBudget = ref$4(null);
    // Variable pour contrôler l'affichage des résultats du budget
    const showBudgetResults = ref$4(true);

    //Innitialisation du model budget avec des valeurs par défaut
    const initializeBudget = () => {
        selectedBudget.value = localStorage.getItem('selectedBudget') ? JSON.parse(localStorage.getItem('selectedBudget')) : null;
        if (!selectedBudget.value) {
            selectedBudget.value = {
                title: selectedBudget.value?.title || 'Mon budget',
                type: 'classique',
                currency: 'EUR',
                month: new Date().toLocaleString('default', { month: 'long' }),
                year: new Date().getFullYear(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                transactions: [],
                accounts: [],
                goals: []
            };
        }
    };


    
 
    // Retourne les données et les fonctions pour être utilisées dans les composants
    return {
     
     selectedBudget,
    showBudgetResults,
    initializeBudget
    }       
});

const {createElementVNode:_createElementVNode$3,createVNode:_createVNode$3,toDisplayString:_toDisplayString$1,unref:_unref$2,openBlock:_openBlock$4,createElementBlock:_createElementBlock$4} = await importShared('vue');


const _hoisted_1$3 = { class: "list-sidebar" };
const _hoisted_2$2 = { class: "list-title-content" };
const _hoisted_3$2 = { class: "button-text" };
const _hoisted_4$2 = { class: "add-list-button super-action-button" };
const _hoisted_5$2 = ["src"];
const {ref: ref$3,computed: computed$1,onMounted: onMounted$3,onUnmounted: onUnmounted$3} = await importShared('vue');


const _sfc_main$3 = {
  __name: 'Sidebar',
  setup(__props) {

const budgetStore = useBudgetStore(); // Utilisation du store pour accéder aux données et fonctions liées au budget

// -------------------------GESTION DU THÈME (SOMBRE/CLAIR)-------------------------
const isDark = ref$3(false); // Variable réactive pour stocker le thème (false = clair, true = sombre)

onMounted$3(() => { // Exécuté quand le composant est monté

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)'); // Observe le thème système

  isDark.value = mediaQuery.matches; // Initialise isDark selon le thème actuel

  const handler = (e) => { // Fonction appelée quand le thème change
    isDark.value = e.matches; // Met à jour la valeur en fonction du nouveau thème

  };

  mediaQuery.addEventListener('change', handler); // Écoute les changements du thème système

  onUnmounted$3(() => { // Exécuté quand le composant est détruit
    mediaQuery.removeEventListener('change', handler); // Supprime l'écouteur pour éviter les fuites mémoire
  });

});
// ------------------------- Gestions de liste de budget-------------------------
 const monBudget = ref$3('Mon budget'); // Variable réactive pour stocker le titre du budget

const showBudgetResult = () => { // Fonction pour afficher les résultats du budget
  budgetStore.showBudgetResults = true; // Met à jour la variable dans le store pour afficher les résultats du budget
  budgetStore.initializeBudget(); // Appelle la fonction pour initialiser le budget (peut être utilisée pour charger les données du budget sélectionné)
  console.log('Budget sélectionné :', budgetStore.selectedBudget); // Affiche dans la console le budget sélectionné (pour le débogage)
};

return (_ctx, _cache) => {
  return (_openBlock$4(), _createElementBlock$4("nav", _hoisted_1$3, [
    _cache[2] || (_cache[2] = _createElementVNode$3("h2", null, " Budget ", -1)),
    _cache[3] || (_cache[3] = _createElementVNode$3("p", { style: {"margin-bottom":"10px"} }, "(actuellement en cours de développement)", -1)),
    _createVNode$3(StarBar),
    _createElementVNode$3("button", {
      class: "list-title-button",
      onClick: _cache[0] || (_cache[0] = $event => (showBudgetResult()))
    }, [
      _createElementVNode$3("div", _hoisted_2$2, [
        _createElementVNode$3("p", _hoisted_3$2, _toDisplayString$1(monBudget.value), 1)
      ])
    ]),
    _createElementVNode$3("button", _hoisted_4$2, [
      _createElementVNode$3("img", {
        class: "icon-plus",
        src: isDark.value ? _unref$2(plusWhite) : _unref$2(plusBlack),
        alt: "ajouter une liste"
      }, null, 8, _hoisted_5$2),
      _cache[1] || (_cache[1] = _createElementVNode$3("p", { class: "button-text" }, "Créer", -1))
    ])
  ]))
}
}

};
const sidebar = /*#__PURE__*/_export_sfc(_sfc_main$3, [['__scopeId',"data-v-ebd3de70"]]);

const sendImg = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(255,%20255,%20255)'%20d='M568.4%2037.7C578.2%2034.2%20589%2036.7%20596.4%2044C603.8%2051.3%20606.2%2062.2%20602.7%2072L424.7%20568.9C419.7%20582.8%20406.6%20592%20391.9%20592C377.7%20592%20364.9%20583.4%20359.6%20570.3L295.4%20412.3C290.9%20401.3%20292.9%20388.7%20300.6%20379.7L395.1%20267.3C400.2%20261.2%20399.8%20252.3%20394.2%20246.7C388.6%20241.1%20379.6%20240.7%20373.6%20245.8L261.2%20340.1C252.1%20347.7%20239.6%20349.7%20228.6%20345.3L70.1%20280.8C57%20275.5%2048.4%20262.7%2048.4%20248.5C48.4%20233.8%2057.6%20220.7%2071.5%20215.7L568.4%2037.7z'/%3e%3c/svg%3e";

const arrowLeft = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(137,%20108,%20221)'%20d='M73.4%20297.4C60.9%20309.9%2060.9%20330.2%2073.4%20342.7L233.4%20502.7C245.9%20515.2%20266.2%20515.2%20278.7%20502.7C291.2%20490.2%20291.2%20469.9%20278.7%20457.4L173.3%20352L544%20352C561.7%20352%20576%20337.7%20576%20320C576%20302.3%20561.7%20288%20544%20288L173.3%20288L278.7%20182.6C291.2%20170.1%20291.2%20149.8%20278.7%20137.3C266.2%20124.8%20245.9%20124.8%20233.4%20137.3L73.4%20297.3z'/%3e%3c/svg%3e";

const AngleDown = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(255,%20255,%20255)'%20d='M297.4%20438.6C309.9%20451.1%20330.2%20451.1%20342.7%20438.6L502.7%20278.6C515.2%20266.1%20515.2%20245.8%20502.7%20233.3C490.2%20220.8%20469.9%20220.8%20457.4%20233.3L320%20370.7L182.6%20233.4C170.1%20220.9%20149.8%20220.9%20137.3%20233.4C124.8%20245.9%20124.8%20266.2%20137.3%20278.7L297.3%20438.7z'/%3e%3c/svg%3e";

// composables/useDevice.js
const {ref: ref$2,onMounted: onMounted$2,onUnmounted: onUnmounted$2} = await importShared('vue');


function useIsMobile() {
  const isMobile = ref$2(window.innerWidth <= 768);

  const update = () => {
    isMobile.value = window.innerWidth <= 768;
  };
  // Ajouter un écouteur d'événement pour mettre à jour la valeur de isMobile lors du redimensionnement de la fenêtre
  onMounted$2(() => {
    window.addEventListener('resize', update);
  });
  // Nettoyer l'écouteur d'événement lorsque le composant est démonté
  onUnmounted$2(() => {
      window.removeEventListener('resize', update);
    });

  return { isMobile }
}
/* importer dans le composant :
 import { useIsMobile } from '../composables/useIsMobile.js'
  const { isMobile } = useIsMobile()
  */

const Delete = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(27,%2052,%2097)'%20d='M232.7%2069.9L224%2096L128%2096C110.3%2096%2096%20110.3%2096%20128C96%20145.7%20110.3%20160%20128%20160L512%20160C529.7%20160%20544%20145.7%20544%20128C544%20110.3%20529.7%2096%20512%2096L416%2096L407.3%2069.9C402.9%2056.8%20390.7%2048%20376.9%2048L263.1%2048C249.3%2048%20237.1%2056.8%20232.7%2069.9zM512%20208L128%20208L149.1%20531.1C150.7%20556.4%20171.7%20576%20197%20576L443%20576C468.3%20576%20489.3%20556.4%20490.9%20531.1L512%20208z'/%3e%3c/svg%3e";

const {createElementVNode:_createElementVNode$2,unref:_unref$1,openBlock:_openBlock$3,createElementBlock:_createElementBlock$3} = await importShared('vue');


const _hoisted_1$2 = { class: "transactions-box" };
const _hoisted_2$1 = ["value"];
const _hoisted_3$1 = ["value"];
const _hoisted_4$1 = ["value"];
const _hoisted_5$1 = ["src"];
//je créé des props pour pouvoir les utiliser dans le composant et les afficher dans le template

const _sfc_main$2 = {
  __name: 'transactions',
  props: {
    amount: {
        type: Number,
        required: true
    },
    named: {
        type: String,
        required: true
    },
    categorie: {
        type: String,
    },
},
  setup(__props) {

const props = __props;

return (_ctx, _cache) => {
  return (_openBlock$3(), _createElementBlock$3("div", _hoisted_1$2, [
    _createElementVNode$2("input", {
      class: "data",
      value: props.amount,
      type: "number"
    }, null, 8, _hoisted_2$1),
    _createElementVNode$2("input", {
      class: "data",
      value: props.named,
      type: "text"
    }, null, 8, _hoisted_3$1),
    _createElementVNode$2("input", {
      class: "data",
      value: props.categorie,
      type: "text"
    }, null, 8, _hoisted_4$1),
    _createElementVNode$2("img", {
      class: "icon-delete",
      src: _unref$1(Delete),
      alt: "delete"
    }, null, 8, _hoisted_5$1)
  ]))
}
}

};
const Transactions = /*#__PURE__*/_export_sfc(_sfc_main$2, [['__scopeId',"data-v-b27ec375"]]);

const {unref:_unref,createElementVNode:_createElementVNode$1,openBlock:_openBlock$2,createElementBlock:_createElementBlock$2,createCommentVNode:_createCommentVNode,toDisplayString:_toDisplayString,createVNode:_createVNode$2,createTextVNode:_createTextVNode,normalizeClass:_normalizeClass,renderList:_renderList,Fragment:_Fragment,createStaticVNode:_createStaticVNode} = await importShared('vue');


const _hoisted_1$1 = {
  key: 0,
  class: "back-arrow-box"
};
const _hoisted_2 = ["src"];
const _hoisted_3 = { class: "budget-results-title" };
const _hoisted_4 = { class: "content-list" };
const _hoisted_5 = { key: 0 };
const _hoisted_6 = {
  key: 1,
  class: "content-list"
};
const _hoisted_7 = { class: "incomes-box" };
const _hoisted_8 = { class: "entries-box" };
const _hoisted_9 = { class: "big-values" };
const _hoisted_10 = ["src"];
const _hoisted_11 = {
  key: 0,
  class: "entries-list"
};
const _hoisted_12 = { class: "add-incomes" };
const _hoisted_13 = ["src"];
const _hoisted_14 = { class: "incomes-box" };
const _hoisted_15 = { class: "entries-box" };
const _hoisted_16 = { class: "big-values" };
const _hoisted_17 = ["src"];
const _hoisted_18 = {
  key: 0,
  class: "entries-list"
};
const _hoisted_19 = { class: "add-incomes" };
const _hoisted_20 = ["src"];

const {computed,ref: ref$1,onMounted: onMounted$1,onUnmounted: onUnmounted$1} = await importShared('vue');


const _sfc_main$1 = {
  __name: 'BudgetResults',
  setup(__props) {

const { isMobile } = useIsMobile(); 
const budgetStore = useBudgetStore();
const transactions = [
  { _id: 1, type: 'incomes', amount: 1000, named: 'Salaire', categorie: 'Travail' },
  { _id: 2, type: 'outcomes', amount: 200, named: 'Loyer', categorie: 'Logement' },
  { _id: 3, type: 'incomes', amount: 500, named: 'Freelance', categorie: 'Travail' },
  { _id: 4, type: 'outcomes', amount: 50, named: 'Abonnement Netflix', categorie: 'Divertissement' },
];



ref$1(false);
onMounted$1(() => {
ref$1(false); // Variable réactive pour contrôler l'affichage des résultats de la liste (utilisée pour les mobiles)
});

const isOpen = ref$1(false); // Variable réactive pour contrôler l'ouverture des listes déroulantes (non utilisée dans ce code, mais peut être utilisée pour les listes déroulantes)
const isOpenOutcomes = ref$1(false); // Variable réactive pour contrôler l'ouverture des listes déroulantes (non utilisée dans ce code, mais peut être utilisée pour les listes déroulantes)





return (_ctx, _cache) => {
  return (_unref(isMobile) ? _unref(budgetStore).showBudgetResults  : _unref(isMobile) === false)
    ? (_openBlock$2(), _createElementBlock$2("div", {
        key: 0,
        class: _normalizeClass(_unref(isMobile) ? 'budget-results-mobile' : 'budget-results')
      }, [
        (_unref(isMobile))
          ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_1$1, [
              _createElementVNode$1("img", {
                src: _unref(arrowLeft),
                alt: "Retour",
                class: "back-arrow",
                onClick: _cache[0] || (_cache[0] = $event => (_unref(budgetStore).showBudgetResults = false))
              }, null, 8, _hoisted_2)
            ]))
          : _createCommentVNode("", true),
        _createElementVNode$1("h3", _hoisted_3, _toDisplayString(_unref(budgetStore).selectedBudget?.title || 'Aucune liste sélectionnée'), 1),
        _createVNode$2(StarBar),
        _createElementVNode$1("div", _hoisted_4, [
          (!_unref(budgetStore).selectedBudget)
            ? (_openBlock$2(), _createElementBlock$2("p", _hoisted_5, _cache[3] || (_cache[3] = [
                _createTextVNode("Faites un choix dans la barre latérale pour afficher ses résultats. "),
                _createElementVNode$1("br", null, null, -1),
                _createTextVNode("Ou créez un nouveau projet pour commencer à ajouter des éléments. "),
                _createElementVNode$1("br", null, null, -1),
                _createElementVNode$1("span", { class: "yellow-heart" }, "💛", -1)
              ])))
            : (_openBlock$2(), _createElementBlock$2("div", _hoisted_6, [
                _createElementVNode$1("div", _hoisted_7, [
                  _createElementVNode$1("div", _hoisted_8, [
                    _cache[4] || (_cache[4] = _createElementVNode$1("h4", { class: "entries-title" }, "Revenus", -1)),
                    _createElementVNode$1("p", _hoisted_9, _toDisplayString(_unref(budgetStore).selectedBudget?.incomes || '0,00 ') + "€", 1)
                  ]),
                  _createElementVNode$1("button", {
                    class: "see-more-box",
                    onClick: _cache[1] || (_cache[1] = $event => (isOpen.value = !isOpen.value))
                  }, [
                    _cache[5] || (_cache[5] = _createElementVNode$1("p", { class: "see-more" }, "Ici ajoute toutes tes entrées d'argents", -1)),
                    _createElementVNode$1("img", {
                      src: _unref(AngleDown),
                      alt: "Voir plus",
                      class: _normalizeClass(["angle-down", { rotated: isOpen.value }])
                    }, null, 10, _hoisted_10)
                  ]),
                  (isOpen.value)
                    ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_11, [
                        _createElementVNode$1("ul", null, [
                          _cache[6] || (_cache[6] = _createStaticVNode("<div class=\"transactions-header\" data-v-6021da98><p class=\"data-header\" data-v-6021da98>Montant</p><p class=\"data-header\" data-v-6021da98>Nom</p><p class=\"data-header\" data-v-6021da98>Catégorie</p><div class=\"data-header-blank\" data-v-6021da98></div></div>", 1)),
                          (_openBlock$2(true), _createElementBlock$2(_Fragment, null, _renderList(transactions.filter(transaction => transaction.type === 'incomes'), (item) => {
                            return (_openBlock$2(), _createElementBlock$2("li", {
                              key: item._id
                            }, [
                              _createVNode$2(Transactions, {
                                amount: item.amount,
                                named: item.named,
                                categorie: item.categorie
                              }, null, 8, ["amount", "named", "categorie"])
                            ]))
                          }), 128))
                        ]),
                        _createElementVNode$1("form", _hoisted_12, [
                          _cache[7] || (_cache[7] = _createElementVNode$1("input", {
                            class: "data",
                            type: "number",
                            name: "amount",
                            id: "amount",
                            placeholder: "Montant"
                          }, null, -1)),
                          _cache[8] || (_cache[8] = _createElementVNode$1("input", {
                            class: "data",
                            type: "text",
                            name: "name",
                            id: "name",
                            placeholder: "Nom"
                          }, null, -1)),
                          _cache[9] || (_cache[9] = _createElementVNode$1("input", {
                            class: "data",
                            type: "text",
                            name: "category",
                            id: "category",
                            placeholder: "Catégorie"
                          }, null, -1)),
                          _createElementVNode$1("img", {
                            src: _unref(sendImg),
                            alt: "Envoyer",
                            class: "send-entry"
                          }, null, 8, _hoisted_13)
                        ])
                      ]))
                    : _createCommentVNode("", true)
                ]),
                _createElementVNode$1("div", _hoisted_14, [
                  _createElementVNode$1("div", _hoisted_15, [
                    _cache[10] || (_cache[10] = _createElementVNode$1("h4", { class: "outcomes-title" }, "Dépenses", -1)),
                    _createElementVNode$1("p", _hoisted_16, _toDisplayString(_unref(budgetStore).selectedBudget?.outcomes || '0,00 ') + "€", 1)
                  ]),
                  _createElementVNode$1("button", {
                    class: "see-more-box",
                    onClick: _cache[2] || (_cache[2] = $event => (isOpenOutcomes.value = !isOpenOutcomes.value))
                  }, [
                    _cache[11] || (_cache[11] = _createElementVNode$1("p", { class: "see-more" }, "Ici ajoute toutes tes dépenses", -1)),
                    _createElementVNode$1("img", {
                      src: _unref(AngleDown),
                      alt: "Voir plus",
                      class: _normalizeClass(["angle-down", { rotated: isOpenOutcomes.value }])
                    }, null, 10, _hoisted_17)
                  ]),
                  (isOpenOutcomes.value)
                    ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_18, [
                        _createElementVNode$1("ul", null, [
                          _cache[12] || (_cache[12] = _createStaticVNode("<div class=\"transactions-header\" data-v-6021da98><p class=\"data-header\" data-v-6021da98>Montant</p><p class=\"data-header\" data-v-6021da98>Nom</p><p class=\"data-header\" data-v-6021da98>Catégorie</p><div class=\"data-header-blank\" data-v-6021da98></div></div>", 1)),
                          (_openBlock$2(true), _createElementBlock$2(_Fragment, null, _renderList(transactions.filter(transaction => transaction.type === 'outcomes'), (item) => {
                            return (_openBlock$2(), _createElementBlock$2("li", {
                              key: item._id
                            }, [
                              _createVNode$2(Transactions, {
                                amount: item.amount,
                                named: item.named,
                                categorie: item.categorie
                              }, null, 8, ["amount", "named", "categorie"])
                            ]))
                          }), 128))
                        ]),
                        _createElementVNode$1("form", _hoisted_19, [
                          _cache[13] || (_cache[13] = _createElementVNode$1("input", {
                            class: "data",
                            type: "number",
                            name: "amount",
                            id: "amount",
                            placeholder: "Montant"
                          }, null, -1)),
                          _cache[14] || (_cache[14] = _createElementVNode$1("input", {
                            class: "data",
                            type: "text",
                            name: "name",
                            id: "name",
                            placeholder: "Nom"
                          }, null, -1)),
                          _cache[15] || (_cache[15] = _createElementVNode$1("input", {
                            class: "data",
                            type: "text",
                            name: "category",
                            id: "category",
                            placeholder: "Catégorie"
                          }, null, -1)),
                          _createElementVNode$1("img", {
                            src: _unref(sendImg),
                            alt: "Envoyer",
                            class: "send-entry"
                          }, null, 8, _hoisted_20)
                        ])
                      ]))
                    : _createCommentVNode("", true)
                ])
              ]))
        ])
      ], 2))
    : _createCommentVNode("", true)
}
}

};
const BudgetResults = /*#__PURE__*/_export_sfc(_sfc_main$1, [['__scopeId',"data-v-6021da98"]]);

const {createVNode:_createVNode$1,openBlock:_openBlock$1,createElementBlock:_createElementBlock$1} = await importShared('vue');


const _hoisted_1 = { class: "budget-view" };

const {ref,onMounted,onUnmounted} = await importShared('vue');


const _sfc_main = {
  __name: 'BudgetView',
  setup(__props) {


return (_ctx, _cache) => {
  return (_openBlock$1(), _createElementBlock$1("div", _hoisted_1, [
    _createVNode$1(sidebar),
    _createVNode$1(BudgetResults)
  ]))
}
}

};
const BudgetView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-bb8adf59"]]);

const {createElementVNode:_createElementVNode,createVNode:_createVNode,openBlock:_openBlock,createElementBlock:_createElementBlock} = await importShared('vue');

const {createApp} = await importShared('vue');

const {createPinia} = await importShared('pinia');
function createMyApp(Component, el) {
  const app = createApp(Component);
  const pinia = createPinia();
  app.use(pinia);
  app.mount(el);
}
function mount(el) {
  if (!el) {
    console.error("❌ container manquant");
    return;
  }
  el.innerHTML = "";
  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.minHeight = "0";
  container.style.flex = "1";
  el.appendChild(container);
  createMyApp(BudgetView, container);
}
window.addEventListener("error", function(event) {
  console.error("Erreur JavaScript capturée :", event.message);
  console.log("Fichier :", event.filename);
  console.log("Ligne :", event.lineno);
  console.log("Colonne :", event.colno);
  console.log("Objet erreur complet :", event.error);
});

export { mount };
