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

const API_URL = "https://app-simplifie-backend.onrender.com/api";
async function http(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}${path}`, {
    // Ajoute les autres options de la requête (méthode, corps, etc.) en écrasant les valeurs par défaut si nécessaire
    ...options,
    headers: {
      "Content-Type": "application/json",
      //boolean && objet retourne objet donc ici => Si un token est présent, l'ajoute à l'en-tête Authorization (les points: ...(null) => renvoit rien si token est null)
      ...token && { Authorization: `Bearer ${token}` },
      // Ajoute les en-têtes supplémentaires fournis dans les options, en écrasant les en-têtes par défaut si nécessaire
      ...options.headers || {}
    }
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API Error");
  }
  return res.json();
}

// GET /budgets
const getBudgets  = () => {
  return http('/budgets') // utilise uniquement le paramètre path de la fonction http
};

// POST /budgets
const createBudget = (data) => {
  return http('/budgets', { // utilise le paramètre path 
    //et options de la fonction http pour spécifier la méthode et le corps de la requête
    method: 'POST', 
    body: JSON.stringify(data)
  })
};

// PATCH /budgets/:id
const updateBudget = (id, data) => {
  return http(`/budgets/${id}`, { // utilise le paramètre path pour spécifier l'ID de la liste à mettre à jour
    //et options de la fonction http pour spécifier la méthode et le corps de la requête
    method: 'PATCH',
    body: JSON.stringify(data)
  })
};

const {defineStore} = await importShared('pinia');

const {ref: ref$5,computed: computed$2} = await importShared('vue');


const useBudgetStore = defineStore('budget', () => {
    //liste de tous les budgets disponibles
    const budgetsArray = ref$5([]);
    //budget sélectionné
    const selectedBudget = ref$5(null);
    // Variable pour contrôler l'affichage des résultats du budget
    const showBudgetResults = ref$5(false);
    //variable qui contient le texte des errers de validation 
    const errorValidation = ref$5({});
    //calcul des revenus à partir des transactions du budget sélectionné
    const incomes = computed$2(() => {

        if (!selectedBudget.value) {
            return 0
        } else if (selectedBudget.value.transactions.length === 0) {
            return 0
        }

        const total = selectedBudget.value.transactions

            .filter(
                transaction =>
                    transaction.type === 'incomes'
            )

            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );

        return Number(total.toFixed(2))


    });
    //calcul des dépenses à partir des transactions du budget sélectionné
    const outcomes = computed$2(() => {

        if (!selectedBudget.value) {
            return 0
        } else if (selectedBudget.value.transactions.length === 0) {
            return 0
        }

        const total = selectedBudget.value.transactions

            .filter(
                transaction =>
                    transaction.type === 'outcomes'
            )

            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );

        return Number(total.toFixed(2))
    });
    //calcul du reste à vivre à partir des revenus et des dépenses du budget sélectionné
    const balance = computed$2(() => {

        return Number((incomes.value - outcomes.value).toFixed(2))

    });
//----------------------------- Bugdget management functions -----------------------------
    //Innitialisation du model budget avec des valeurs par défaut
    const initializeBudget = async () => {
        // Vérifie si un budget existe déjà dans la BDD avec l'Id fourni
        const existingBudgets = await getBudgets();
        console.log("budgets existants", existingBudgets.data.length);
        if (existingBudgets.data.length > 0) {
            budgetsArray.value = existingBudgets.data;
            selectedBudget.value = budgetsArray.value[0]; // Sélectionne le premier budget de la liste
        } 
        else {
            // Si aucun budget n'existe, crée un nouveau budget avec des valeurs par défaut
            const firstBudget = {
                title: "Mon budget",
                type: 'budget',
                currency: 'EUR',
                month: new Date().toLocaleString('default', { month: 'long' }),
                year: new Date().getFullYear(),
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                transactions: [],
                accounts: [],
                goals: []
            };
            // Sauvegarde le nouveau budget dans la BDD
            const createdBudget = await createBudget(firstBudget);
            // Met à jour le tableau de budgets avec le budget créé
            budgetsArray.value.push(createdBudget);
            selectedBudget.value = createdBudget;
        }
    };

    //ajouter des transactions (incomes ou outcomes) au budget sélectionné  
    const addTransaction = async (transaction, budgetId) => {
        //Vérifie la présence de amount et name dans la transaction
        if (!transaction.amount || !transaction.named || transaction.named === undefined) {
            errorValidation.value = {
                amount: !transaction.amount ? "Le montant est requis." : "",
                name: !transaction.named ? "Le nom de la transaction est requis." : ""
            };
            console.log(errorValidation);
            return
        }
        // Validation des données de la transaction
        if (transaction.amount <= 0) {
            errorValidation.value.amount = "Le montant doit être supérieur à zéro.";
            console.log(errorValidation);
            return
        }
        if (transaction.named.trim() === '' ) {
            errorValidation.value.name = "Le nom de la transaction ne peut pas être vide.";
            console.log(errorValidation);
            return
        }
        if (transaction.amount > 0) {
            // s'assure que le montant est à deux décimales
            transaction.amount = Number(transaction.amount.toFixed(2));
        } 
        if (isNaN(transaction.amount)) {
            errorValidation.value.amount = "Le montant doit être un nombre valide.";
            console.log(errorValidation);
            return
        }
        const updatedTransactions = [...selectedBudget.value.transactions, transaction];
        // Si la validation est réussie, ajoute la transaction au budget sélectionné en BDD
        const transactionResult = await updateBudget(budgetId, {
            transactions: updatedTransactions
        });
        // Met à jour le budget sélectionné avec les nouvelles transactions
        selectedBudget.value.transactions = transactionResult.data.transactions;
    };

    // Mettre à jour une transaction du budget sélectionné
    const updateTransaction = async (updatedTransaction) => {
        console.log("Transaction mise à jour :", updatedTransaction);
        if (selectedBudget.value) {
            const index = selectedBudget.value.transactions.findIndex(t => t._id === updatedTransaction._id);
            if (index !== -1) {
                // Mettre à jour la transaction dans le budget sélectionné
                selectedBudget.value.transactions[index] = {
                    ...selectedBudget.value.transactions[index],
                    ...updatedTransaction,
                };
                const updatedTransactions = [...selectedBudget.value.transactions];
                console.log("Transactions mises à jour :", updatedTransactions, "et transaction", updatedTransaction);
                await updateBudget(selectedBudget.value._id, {
                transactions: updatedTransactions
                });
            }
        }
    };
    // supprimer une transaction du budget sélectionné
    const deleteTransaction =  async (transactionId) => {
        if (selectedBudget.value) {
            selectedBudget.value.transactions = selectedBudget.value.transactions.filter(t => t._id !== transactionId);
            await updateBudget(selectedBudget.value._id, {
            transactions: selectedBudget.value.transactions
            });
        }
    };
 
    // Retourne les données et les fonctions pour être utilisées dans les composants
    return {
    selectedBudget,
    showBudgetResults,
    errorValidation,
    incomes,
    outcomes,
    balance,
    initializeBudget,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    }       
});

const {createElementVNode:_createElementVNode$3,createVNode:_createVNode$3,unref:_unref$2,openBlock:_openBlock$4,createElementBlock:_createElementBlock$4} = await importShared('vue');


const _hoisted_1$3 = { class: "list-sidebar" };
const _hoisted_2$2 = { class: "add-list-button super-action-button" };
const _hoisted_3$2 = ["src"];
const {ref: ref$4,computed: computed$1,onMounted: onMounted$3,onUnmounted: onUnmounted$3} = await importShared('vue');


const _sfc_main$3 = {
  __name: 'Sidebar',
  setup(__props) {

const budgetStore = useBudgetStore(); // Utilisation du store pour accéder aux données et fonctions liées au budget

// -------------------------GESTION DU THÈME (SOMBRE/CLAIR)-------------------------
const isDark = ref$4(false); // Variable réactive pour stocker le thème (false = clair, true = sombre)

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

const showBudgetResult = () => { // Fonction pour afficher les résultats du budget
  budgetStore.showBudgetResults = true; // Met à jour la variable dans le store pour afficher les résultats du budget
  budgetStore.initializeBudget(); // Appelle la fonction pour initialiser le budget (peut être utilisée pour charger les données du budget sélectionné)
  console.log('Budget sélectionné :', budgetStore.selectedBudget); // Affiche dans la console le budget sélectionné (pour le débogage)
};

return (_ctx, _cache) => {
  return (_openBlock$4(), _createElementBlock$4("nav", _hoisted_1$3, [
    _cache[3] || (_cache[3] = _createElementVNode$3("h2", null, " Budget ", -1)),
    _cache[4] || (_cache[4] = _createElementVNode$3("p", { style: {"margin-bottom":"10px"} }, "(actuellement en cours de développement)", -1)),
    _createVNode$3(StarBar),
    (_openBlock$4(), _createElementBlock$4("button", {
      key: _unref$2(budgetStore).selectedBudget?.title === 'Mon budget' ? 'default' : _unref$2(budgetStore).selectedBudget?._id,
      class: "list-title-button",
      onClick: _cache[0] || (_cache[0] = $event => (showBudgetResult()))
    }, _cache[1] || (_cache[1] = [
      _createElementVNode$3("div", { class: "list-title-content" }, [
        _createElementVNode$3("p", { class: "button-text" }, "Mon Budget")
      ], -1)
    ]))),
    _createElementVNode$3("button", _hoisted_2$2, [
      _createElementVNode$3("img", {
        class: "icon-plus",
        src: isDark.value ? _unref$2(plusWhite) : _unref$2(plusBlack),
        alt: "ajouter un suivi de budget"
      }, null, 8, _hoisted_3$2),
      _cache[2] || (_cache[2] = _createElementVNode$3("p", { class: "button-text" }, "Créer", -1))
    ])
  ]))
}
}

};
const sidebar = /*#__PURE__*/_export_sfc(_sfc_main$3, [['__scopeId',"data-v-2611b410"]]);

const sendImg = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(255,%20255,%20255)'%20d='M568.4%2037.7C578.2%2034.2%20589%2036.7%20596.4%2044C603.8%2051.3%20606.2%2062.2%20602.7%2072L424.7%20568.9C419.7%20582.8%20406.6%20592%20391.9%20592C377.7%20592%20364.9%20583.4%20359.6%20570.3L295.4%20412.3C290.9%20401.3%20292.9%20388.7%20300.6%20379.7L395.1%20267.3C400.2%20261.2%20399.8%20252.3%20394.2%20246.7C388.6%20241.1%20379.6%20240.7%20373.6%20245.8L261.2%20340.1C252.1%20347.7%20239.6%20349.7%20228.6%20345.3L70.1%20280.8C57%20275.5%2048.4%20262.7%2048.4%20248.5C48.4%20233.8%2057.6%20220.7%2071.5%20215.7L568.4%2037.7z'/%3e%3c/svg%3e";

const arrowLeft = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(137,%20108,%20221)'%20d='M73.4%20297.4C60.9%20309.9%2060.9%20330.2%2073.4%20342.7L233.4%20502.7C245.9%20515.2%20266.2%20515.2%20278.7%20502.7C291.2%20490.2%20291.2%20469.9%20278.7%20457.4L173.3%20352L544%20352C561.7%20352%20576%20337.7%20576%20320C576%20302.3%20561.7%20288%20544%20288L173.3%20288L278.7%20182.6C291.2%20170.1%20291.2%20149.8%20278.7%20137.3C266.2%20124.8%20245.9%20124.8%20233.4%20137.3L73.4%20297.3z'/%3e%3c/svg%3e";

const AngleDown = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(255,%20255,%20255)'%20d='M297.4%20438.6C309.9%20451.1%20330.2%20451.1%20342.7%20438.6L502.7%20278.6C515.2%20266.1%20515.2%20245.8%20502.7%20233.3C490.2%20220.8%20469.9%20220.8%20457.4%20233.3L320%20370.7L182.6%20233.4C170.1%20220.9%20149.8%20220.9%20137.3%20233.4C124.8%20245.9%20124.8%20266.2%20137.3%20278.7L297.3%20438.7z'/%3e%3c/svg%3e";

// composables/useDevice.js
const {ref: ref$3,onMounted: onMounted$2,onUnmounted: onUnmounted$2} = await importShared('vue');


function useIsMobile() {
  const isMobile = ref$3(window.innerWidth <= 768);

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

const {vModelText:_vModelText$1,normalizeClass:_normalizeClass$1,createElementVNode:_createElementVNode$2,withDirectives:_withDirectives$1,vShow:_vShow,vModelSelect:_vModelSelect$1,unref:_unref$1,openBlock:_openBlock$3,createElementBlock:_createElementBlock$3} = await importShared('vue');


const _hoisted_1$2 = { class: "transactions-box" };
const _hoisted_2$1 = { value: "logement" };
const _hoisted_3$1 = { value: "courses" };
const _hoisted_4$1 = { value: "transport" };
const _hoisted_5$1 = { value: "santé" };
const _hoisted_6$1 = { value: "divertissement" };
const _hoisted_7$1 = { value: "enfants" };
const _hoisted_8$1 = { value: "credits" };
const _hoisted_9$1 = { value: "pro" };
const _hoisted_10$1 = { value: "perso" };
const _hoisted_11$1 = { value: "salaire" };
const _hoisted_12$1 = { value: "entreprise" };
const _hoisted_13$1 = { value: "freelance" };
const _hoisted_14$1 = { value: "pension" };
const _hoisted_15$1 = { value: "allocations" };
const _hoisted_16$1 = { value: "investissements" };
const _hoisted_17$1 = ["src"];

const {ref: ref$2} = await importShared('vue');


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
    category: {
        type: String,
    },
    incomes: {
        type: Boolean,
        required: true
    },
    _id: {
        type: [String, Number],
        required: true
    }


},
  setup(__props) {

const budgetStore = useBudgetStore(); // Utilisation du store pour accéder aux données et fonctions
//je créé des props pour pouvoir les utiliser dans le composant et les afficher dans le template
const props = __props;

const amountSelected = ref$2(props.amount); // Valeur initiale du montant de la transaction
const nameSelected = ref$2(props.named); // Valeur initiale du nom de la transaction
const categorySelected = ref$2(props.category===''? 'Sélectionner une catégorie' : props.category); // Valeur initiale de la catégorie de la transaction
ref$2(props.amount.toFixed(2)); // Affiche le montant avec deux décimales

const update = () => {
     budgetStore.updateTransaction({
        _id: props._id,
        amount: amountSelected.value,
        named: nameSelected.value,
        category: categorySelected.value,
        incomes: props.incomes
    });
      
};


return (_ctx, _cache) => {
  return (_openBlock$3(), _createElementBlock$3("div", _hoisted_1$2, [
    _withDirectives$1(_createElementVNode$2("input", {
      class: _normalizeClass$1(__props.incomes? 'data' : 'data-outcomes' ),
      type: "number",
      step: ".01",
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((amountSelected).value = $event)),
      onChange: _cache[1] || (_cache[1] = $event => (update()))
    }, null, 34), [
      [_vModelText$1, amountSelected.value]
    ]),
    _withDirectives$1(_createElementVNode$2("input", {
      class: _normalizeClass$1(__props.incomes? 'data' : 'data-outcomes' ),
      type: "text",
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((nameSelected).value = $event)),
      onChange: _cache[3] || (_cache[3] = $event => (update()))
    }, null, 34), [
      [_vModelText$1, nameSelected.value]
    ]),
    _withDirectives$1(_createElementVNode$2("select", {
      class: _normalizeClass$1(__props.incomes? 'data' : 'data-outcomes'),
      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((categorySelected).value = $event)),
      onChange: _cache[5] || (_cache[5] = $event => (update()))
    }, [
      _cache[7] || (_cache[7] = _createElementVNode$2("option", {
        disabled: "",
        value: ""
      }, " Choisir une catégorie ", -1)),
      _withDirectives$1(_createElementVNode$2("option", _hoisted_2$1, "Logement", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$1(_createElementVNode$2("option", _hoisted_3$1, "Courses", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$1(_createElementVNode$2("option", _hoisted_4$1, "Transport", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$1(_createElementVNode$2("option", _hoisted_5$1, "Santé", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$1(_createElementVNode$2("option", _hoisted_6$1, "Divertissement", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$1(_createElementVNode$2("option", _hoisted_7$1, "Enfants", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$1(_createElementVNode$2("option", _hoisted_8$1, "Crédits", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$1(_createElementVNode$2("option", _hoisted_9$1, "Pro", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$1(_createElementVNode$2("option", _hoisted_10$1, "Perso", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$1(_createElementVNode$2("option", _hoisted_11$1, "Salaire", 512), [
        [_vShow, __props.incomes]
      ]),
      _withDirectives$1(_createElementVNode$2("option", _hoisted_12$1, "Entreprise", 512), [
        [_vShow, __props.incomes]
      ]),
      _withDirectives$1(_createElementVNode$2("option", _hoisted_13$1, "Freelance", 512), [
        [_vShow, __props.incomes]
      ]),
      _withDirectives$1(_createElementVNode$2("option", _hoisted_14$1, "Pension", 512), [
        [_vShow, __props.incomes]
      ]),
      _withDirectives$1(_createElementVNode$2("option", _hoisted_15$1, "Allocations", 512), [
        [_vShow, __props.incomes]
      ]),
      _withDirectives$1(_createElementVNode$2("option", _hoisted_16$1, "Investissements", 512), [
        [_vShow, __props.incomes]
      ]),
      _cache[8] || (_cache[8] = _createElementVNode$2("option", { value: "autre" }, "Autre", -1))
    ], 34), [
      [_vModelSelect$1, categorySelected.value]
    ]),
    _createElementVNode$2("img", {
      class: "icon-delete",
      src: _unref$1(Delete),
      alt: "delete",
      onClick: _cache[6] || (_cache[6] = $event => (_unref$1(budgetStore).deleteTransaction(props._id)))
    }, null, 8, _hoisted_17$1)
  ]))
}
}

};
const Transactions = /*#__PURE__*/_export_sfc(_sfc_main$2, [['__scopeId',"data-v-4b2e1485"]]);

const wallet = "/appbudget-dist/assets/wallet-DnqqVq5N.png";

const {unref:_unref,createElementVNode:_createElementVNode$1,openBlock:_openBlock$2,createElementBlock:_createElementBlock$2,createCommentVNode:_createCommentVNode,toDisplayString:_toDisplayString,createVNode:_createVNode$2,createTextVNode:_createTextVNode,normalizeClass:_normalizeClass,renderList:_renderList,Fragment:_Fragment,createBlock:_createBlock,vModelText:_vModelText,withDirectives:_withDirectives,vModelSelect:_vModelSelect,createStaticVNode:_createStaticVNode} = await importShared('vue');


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
const _hoisted_7 = { class: "balance-box" };
const _hoisted_8 = { class: "entries-box balance-entries-box" };
const _hoisted_9 = { class: "balance-value" };
const _hoisted_10 = { class: "wallet-icon-box" };
const _hoisted_11 = ["src"];
const _hoisted_12 = { class: "incomes-box" };
const _hoisted_13 = { class: "entries-box" };
const _hoisted_14 = { class: "big-values" };
const _hoisted_15 = ["src"];
const _hoisted_16 = {
  key: 0,
  class: "entries-list"
};
const _hoisted_17 = { class: "add-incomes" };
const _hoisted_18 = ["src"];
const _hoisted_19 = { class: "incomes-box" };
const _hoisted_20 = { class: "entries-box" };
const _hoisted_21 = { class: "big-values" };
const _hoisted_22 = ["src"];
const _hoisted_23 = {
  key: 0,
  class: "entries-list"
};
const _hoisted_24 = { class: "add-incomes" };
const _hoisted_25 = ["src"];

const {computed,ref: ref$1,onMounted: onMounted$1,onUnmounted: onUnmounted$1} = await importShared('vue');

const _sfc_main$1 = {
  __name: 'BudgetResults',
  setup(__props) {

const { isMobile } = useIsMobile(); 
const budgetStore = useBudgetStore();
const transactions = computed(() => budgetStore.selectedBudget ? budgetStore.selectedBudget.transactions : []); // Computed pour obtenir les transactions du budget sélectionné (ou une liste vide si aucun budget n'est sélectionné)


onMounted$1(() => {
//pour la version mobile, on affiche les résultats de la liste sélectionnée seulement après le choix d'une liste dans la barre latérale
ref$1(false); // Variable réactive pour contrôler l'affichage des résultats de la liste (utilisée pour les mobiles)
console.log("vue result", budgetStore.selectedBudget);
});

//controle l'ouverture et la fermetures des affichages détaillés
const isOpen = ref$1(false); // Variable réactive pour contrôler l'ouverture des listes déroulantes (non utilisée dans ce code, mais peut être utilisée pour les listes déroulantes)
const isOpenOutcomes = ref$1(false); // Variable réactive pour contrôler l'ouverture des listes déroulantes (non utilisée dans ce code, mais peut être utilisée pour les listes déroulantes)

//-----------------------------Gestion des entrées----------------------------------
const amountIncomes = ref$1(0); // Variable réactive pour stocker le montant des revenus à ajouter
const namedIncomes = ref$1(''); // Variable réactive pour stocker le nom des revenus à ajouter
const categoryIncomes = ref$1(''); // Variable réactive pour stocker la catégorie des revenus à ajouter  
const amountOutcomes = ref$1(0); // Variable réactive pour stocker le montant des dépenses à ajouter
const namedOutcomes = ref$1(''); // Variable réactive pour stocker le nom des dépenses à ajouter
const categoryOutcomes = ref$1(''); // Variable réactive pour stocker la catégoriedes dépenses à ajouter

const balanceDisplay = computed(() => {
  return budgetStore.balance.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2}).replace(/\u202f/g, ' ') 
});

const incomesDisplay = computed(() => {
  return budgetStore.incomes.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2}).replace(/\u202f/g, ' ') 
});

const outcomesDisplay = computed(() => {
  return budgetStore.outcomes.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2}).replace(/\u202f/g, ' ') 
});


const addIncome = () => {
    budgetStore.addTransaction({
      type: 'incomes',
      amount: amountIncomes.value,
      named: namedIncomes.value,
      category: categoryIncomes.value
    }, budgetStore.selectedBudget._id);
    // Réinitialiser les champs après l'ajout
    amountIncomes.value = 0;
    namedIncomes.value = '';
    categoryIncomes.value = '';
  };

const addOutcome = () => {
    budgetStore.addTransaction({
      type: 'outcomes',
      amount: amountOutcomes.value,
      named: namedOutcomes.value,
      category: categoryOutcomes.value
    }, budgetStore.selectedBudget._id);
    // Réinitialiser les champs après l'ajout
    amountOutcomes.value = 0;
    namedOutcomes.value = '';
    categoryOutcomes.value = '';
  };



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
        _createElementVNode$1("h3", _hoisted_3, _toDisplayString(_unref(budgetStore).selectedBudget?.title || 'Aucun suivi sélectionné'), 1),
        _createVNode$2(StarBar),
        _createElementVNode$1("div", _hoisted_4, [
          (!_unref(budgetStore).selectedBudget)
            ? (_openBlock$2(), _createElementBlock$2("p", _hoisted_5, _cache[9] || (_cache[9] = [
                _createTextVNode("Faites un choix dans la barre latérale pour afficher ses résultats. "),
                _createElementVNode$1("br", null, null, -1),
                _createTextVNode("Ou créez un nouveau projet pour commencer à ajouter des éléments. "),
                _createElementVNode$1("br", null, null, -1),
                _createElementVNode$1("span", { class: "yellow-heart" }, "💛", -1)
              ])))
            : (_openBlock$2(), _createElementBlock$2("div", _hoisted_6, [
                _createElementVNode$1("div", _hoisted_7, [
                  _createElementVNode$1("div", _hoisted_8, [
                    _cache[10] || (_cache[10] = _createElementVNode$1("h4", { class: "balance-title" }, "Reste à vivre", -1)),
                    _cache[11] || (_cache[11] = _createElementVNode$1("p", { class: "balance-under-title" }, "disponible ce mois-ci", -1)),
                    _createElementVNode$1("p", _hoisted_9, _toDisplayString(balanceDisplay.value  + ' €'), 1)
                  ]),
                  _createElementVNode$1("div", _hoisted_10, [
                    _createElementVNode$1("img", {
                      src: _unref(wallet),
                      alt: "Portefeuille",
                      class: "wallet-icon"
                    }, null, 8, _hoisted_11)
                  ])
                ]),
                _createElementVNode$1("div", _hoisted_12, [
                  _createElementVNode$1("div", _hoisted_13, [
                    _cache[12] || (_cache[12] = _createElementVNode$1("h4", { class: "entries-title" }, "Revenus", -1)),
                    _createElementVNode$1("p", _hoisted_14, _toDisplayString('+ ' + incomesDisplay.value  + ' €'), 1)
                  ]),
                  _createElementVNode$1("button", {
                    class: "see-more-box",
                    onClick: _cache[1] || (_cache[1] = $event => (isOpen.value = !isOpen.value))
                  }, [
                    _cache[13] || (_cache[13] = _createElementVNode$1("p", { class: "see-more" }, "Ici ajoute toutes tes entrées d'argents", -1)),
                    _createElementVNode$1("img", {
                      src: _unref(AngleDown),
                      alt: "Voir plus",
                      class: _normalizeClass(["angle-down", { rotated: isOpen.value }])
                    }, null, 10, _hoisted_15)
                  ]),
                  (isOpen.value)
                    ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_16, [
                        _createElementVNode$1("ul", null, [
                          _cache[14] || (_cache[14] = _createStaticVNode("<div class=\"transactions-header\" data-v-030d4c99><p class=\"data-header\" data-v-030d4c99>Montant</p><p class=\"data-header\" data-v-030d4c99>Nom</p><p class=\"data-header\" data-v-030d4c99>Catégorie</p><div class=\"data-header-blank\" data-v-030d4c99></div></div>", 1)),
                          (_openBlock$2(true), _createElementBlock$2(_Fragment, null, _renderList(transactions.value.filter(transaction => transaction.type === 'incomes'), (item) => {
                            return (_openBlock$2(), _createElementBlock$2("li", {
                              key: item._id
                            }, [
                              (_openBlock$2(), _createBlock(Transactions, {
                                key: item._id,
                                incomes: true,
                                amount: item.amount,
                                named: item.named,
                                category: item.category,
                                _id: item._id
                              }, null, 8, ["amount", "named", "category", "_id"]))
                            ]))
                          }), 128))
                        ]),
                        _createElementVNode$1("form", _hoisted_17, [
                          _withDirectives(_createElementVNode$1("input", {
                            class: "data",
                            type: "number",
                            "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((amountIncomes).value = $event)),
                            name: "amount",
                            step: ".01"
                          }, null, 512), [
                            [_vModelText, amountIncomes.value]
                          ]),
                          _withDirectives(_createElementVNode$1("input", {
                            class: "data",
                            type: "text",
                            "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((namedIncomes).value = $event)),
                            name: "name",
                            id: "name",
                            placeholder: "Nom"
                          }, null, 512), [
                            [_vModelText, namedIncomes.value]
                          ]),
                          _withDirectives(_createElementVNode$1("select", {
                            class: "data",
                            "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((categoryIncomes).value = $event))
                          }, _cache[15] || (_cache[15] = [
                            _createStaticVNode("<option value=\"salaire\" data-v-030d4c99>Salaire</option><option value=\"freelance\" data-v-030d4c99>Freelance</option><option value=\"entreprise\" data-v-030d4c99>Entreprise</option><option value=\"pension\" data-v-030d4c99>Pension</option><option value=\"allocations\" data-v-030d4c99>Allocations</option><option value=\"investissements\" data-v-030d4c99>Investissements</option><option value=\"autre\" data-v-030d4c99>Autre</option>", 7)
                          ]), 512), [
                            [_vModelSelect, categoryIncomes.value]
                          ]),
                          _createElementVNode$1("img", {
                            src: _unref(sendImg),
                            alt: "Envoyer",
                            class: "send-entry",
                            onClick: addIncome
                          }, null, 8, _hoisted_18)
                        ])
                      ]))
                    : _createCommentVNode("", true)
                ]),
                _createElementVNode$1("div", _hoisted_19, [
                  _createElementVNode$1("div", _hoisted_20, [
                    _cache[16] || (_cache[16] = _createElementVNode$1("h4", { class: "outcomes-title" }, "Dépenses", -1)),
                    _createElementVNode$1("p", _hoisted_21, _toDisplayString('- ' + outcomesDisplay.value  + ' €'), 1)
                  ]),
                  _createElementVNode$1("button", {
                    class: "see-more-box",
                    onClick: _cache[5] || (_cache[5] = $event => (isOpenOutcomes.value = !isOpenOutcomes.value))
                  }, [
                    _cache[17] || (_cache[17] = _createElementVNode$1("p", { class: "see-more" }, "Ici ajoute toutes tes dépenses", -1)),
                    _createElementVNode$1("img", {
                      src: _unref(AngleDown),
                      alt: "Voir plus",
                      class: _normalizeClass(["angle-down-outcomes", { rotated: isOpenOutcomes.value }])
                    }, null, 10, _hoisted_22)
                  ]),
                  (isOpenOutcomes.value)
                    ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_23, [
                        _createElementVNode$1("ul", null, [
                          _cache[18] || (_cache[18] = _createStaticVNode("<div class=\"transactions-header-outcomes\" data-v-030d4c99><p class=\"data-header\" data-v-030d4c99>Montant</p><p class=\"data-header\" data-v-030d4c99>Nom</p><p class=\"data-header\" data-v-030d4c99>Catégorie</p><div class=\"data-header-blank\" data-v-030d4c99></div></div>", 1)),
                          (_openBlock$2(true), _createElementBlock$2(_Fragment, null, _renderList(transactions.value.filter(transaction => transaction.type === 'outcomes'), (item) => {
                            return (_openBlock$2(), _createElementBlock$2("li", {
                              key: item._id
                            }, [
                              (_openBlock$2(), _createBlock(Transactions, {
                                incomes: false,
                                key: item._id,
                                amount: item.amount,
                                named: item.named,
                                category: item.category,
                                _id: item._id
                              }, null, 8, ["amount", "named", "category", "_id"]))
                            ]))
                          }), 128))
                        ]),
                        _createElementVNode$1("form", _hoisted_24, [
                          _withDirectives(_createElementVNode$1("input", {
                            class: "data",
                            type: "number",
                            "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((amountOutcomes).value = $event)),
                            name: "amount",
                            step: ".01"
                          }, null, 512), [
                            [_vModelText, amountOutcomes.value]
                          ]),
                          _withDirectives(_createElementVNode$1("input", {
                            class: "data",
                            type: "text",
                            "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((namedOutcomes).value = $event)),
                            name: "name",
                            placeholder: "Nom"
                          }, null, 512), [
                            [_vModelText, namedOutcomes.value]
                          ]),
                          _withDirectives(_createElementVNode$1("select", {
                            class: "data",
                            "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((categoryOutcomes).value = $event))
                          }, _cache[19] || (_cache[19] = [
                            _createStaticVNode("<option value=\"logement\" data-v-030d4c99>Logement</option><option value=\"courses\" data-v-030d4c99>Courses</option><option value=\"transport\" data-v-030d4c99>Transport</option><option value=\"santé\" data-v-030d4c99>Santé</option><option value=\"divertissement\" data-v-030d4c99>Divertissement</option><option value=\"enfants\" data-v-030d4c99>Enfants</option><option value=\"credits\" data-v-030d4c99>Crédits</option><option value=\"pro\" data-v-030d4c99>Pro</option><option value=\"perso\" data-v-030d4c99>Perso</option><option value=\"autre\" data-v-030d4c99>Autre</option>", 10)
                          ]), 512), [
                            [_vModelSelect, categoryOutcomes.value]
                          ]),
                          _createElementVNode$1("img", {
                            src: _unref(sendImg),
                            alt: "Envoyer",
                            class: "send-entry",
                            onClick: addOutcome
                          }, null, 8, _hoisted_25)
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
const BudgetResults = /*#__PURE__*/_export_sfc(_sfc_main$1, [['__scopeId',"data-v-030d4c99"]]);

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
const BudgetView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-1b3d9750"]]);

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
