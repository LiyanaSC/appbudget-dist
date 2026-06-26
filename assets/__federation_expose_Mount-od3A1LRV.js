import { importShared } from './__federation_fn_import-BMMB1g9W.js';

// tableau de types de listes disponibles

const typeOfBudget = [
  {
    type: 'simulation',
    label: 'Simulation',
    image: new URL("/appbudget-dist/assets/simulation-BrV5sTOb.png", import.meta.url).href,
    color: 'linear-gradient(45deg, rgb(80, 104, 229), rgb(159, 164, 253) 90%)',
    description: 'Fais des simulations à partir de ton budget actuel',
    alt: 'Fais des simulations à partir de ton budget actuel'
  },
   {
    type: 'budget',
    label: 'Nouveau Budget',
    image: new URL("/appbudget-dist/assets/new-budget-CLTXVw2D.png", import.meta.url).href,
    color: 'linear-gradient(45deg, rgb(126, 140, 247), rgb(196, 199, 254) 90%)',
    description: 'Crée un nouveau budget à partir de zéro pour gérer tes finances de manière personnalisée.',
    alt: 'Crée un nouveau budget à partir de zéro pour gérer tes finances de manière personnalisée.'
  }
];

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
  console.log("Response from API:", res);
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

// DELETE /budgets/:id
const deleteBudget = (id) => {
  return http(`/budgets/${id}`, { // utilise le paramètre path pour spécifier l'ID de la liste à supprimer
    //et options de la fonction http pour spécifier la méthode
    method: 'DELETE'
  })
};

const {defineStore} = await importShared('pinia');

const {ref: ref$a,computed: computed$7} = await importShared('vue');


const useBudgetStore = defineStore('budget', () => {
    const isDarkMode = ref$a('dark');
    const updateTheme = () => {
        isDarkMode.value =
        document.documentElement.dataset.theme === "dark";
    };
    //liste de tous les budgets disponibles
    const budgetsArray = ref$a([]);
    //variable pour afficher le bouton créé
    const showCreateButton = ref$a(false);
    const initializeShowCreateButton = async () => {

        const budgets = await getBudgets();
        budgetsArray.value = budgets.data;
        console.log("budgetsArray", budgetsArray.value);
        showCreateButton.value = budgets.data.length > 0;

    };
    //budget sélectionné
    const selectedBudget = ref$a(null);
    // Variable pour contrôler l'affichage du formulaire de création de budget
    const creatingBudget = ref$a(false);
    // Variable pour contrôler l'affichage des résultats du budget
    const showBudgetResults = ref$a(false);
    //variable qui contient le texte des errers de validation 
    const errorValidation = ref$a({});
    //calcul des revenus à partir des transactions du budget sélectionné
    const incomes = computed$7(() => {

        if (
        !selectedBudget.value ||
        !selectedBudget.value.transactions ||
        selectedBudget.value.transactions.length === 0
        ) {
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
    const outcomes = computed$7(() => {

        if (
        !selectedBudget.value ||
        !selectedBudget.value.transactions ||
        selectedBudget.value.transactions.length === 0
        ) {
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
    const balance = computed$7(() => {

        return Number((incomes.value - outcomes.value).toFixed(2))

    });
    //tableau des revenus par catégorie à partir des transactions du budget sélectionné
    const incomesByCategory = computed$7(() => {
        if (!selectedBudget.value) {
            return []
        } else if (selectedBudget.value.transactions.length === 0) {
            return []
        }

        const categories = [...new Set(selectedBudget.value.transactions
            .filter(transaction => transaction.type === 'incomes')
            .map(transaction => transaction.category))];

        return categories.map(category => {
            const total = selectedBudget.value.transactions
                .filter(transaction => transaction.type === 'incomes' && transaction.category === category)
                .reduce((total, transaction) => total + Number(transaction.amount), 0);

            return {
                category,
                total: Number(total.toFixed(2))
            }
        })
    });
    //tableau des dépenses par catégorie à partir des transactions du budget sélectionné
    const outcomesByCategory = computed$7(() => {
        if (!selectedBudget.value) {
            return []
        } else if (selectedBudget.value.transactions.length === 0) {
            return []
        }

        const categories = [...new Set(selectedBudget.value.transactions
            .filter(transaction => transaction.type === 'outcomes')
            .map(transaction => transaction.category))];

        return categories.map(category => {
            const total = selectedBudget.value.transactions
                .filter(transaction => transaction.type === 'outcomes' && transaction.category === category)
                .reduce((total, transaction) => total + Number(transaction.amount), 0);

            return {
                category,
                total: Number(total.toFixed(2))
            }
        })
    });
    //tableau des outcomes sans compte associé à partir des transactions du budget sélectionné
    const outcomesArrayAvailable = computed$7(() => {
        if (!selectedBudget.value) {
            return []
        } else if (selectedBudget.value.transactions.length === 0) {
            return []
        }

        return selectedBudget.value.transactions
            .filter(transaction => transaction.type === 'outcomes' && transaction.accountAssociated === null)
    });
    //tableau des outcomes avec compte associé à partir des transactions du budget sélectionné
    const outcomesArrayUnavailable = computed$7(() => {
        if (!selectedBudget.value) {
            return []
        } else if (selectedBudget.value.transactions.length === 0) {
            return []
        }

        return selectedBudget.value.transactions
            .filter(transaction => transaction.type === 'outcomes' && transaction.accountAssociated !== null)
    });
    // Variable pour contrôler l'affichage de la confirmation de suppression d'un budget
    const showDeleteConfirmationBudget = ref$a(false); 
    // Variable pour contrôler l'affichage de la confirmation de suppression d'une transaction
    const showDeleteConfirmationTransaction = ref$a(false);
    // Variable pour contrôler l'affichage de la confirmation de suppression d'un compte
    const showDeleteConfirmationAccount = ref$a(false);
    // Variable pour stocker l'ID du budget à supprimer
    const IdToDelete = ref$a('');
    // Variable pour stocker le nom de la chose à supprimer (budget ou transaction) dans le message de confirmation
    const nameToDelete = ref$a('');
//----------------------------- Bugdget management functions -----------------------------
    //Innitialisation du model budget avec des valeurs par défaut
    const initializeBudget = async () => {
        if (budgetsArray.value.length > 0) {
            selectedBudget.value = budgetsArray.value[0]; // Sélectionne le premier budget de la liste
            console.log("Budget sélectionné :", selectedBudget.value);
        } 
        else if (!budgetsArray.value || budgetsArray.value.length === 0 ) {
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
            const res = await createBudget(firstBudget);
            // Met à jour le tableau de budgets avec le budget créé
            budgetsArray.value.push(res.data);
            selectedBudget.value = res.data;
            console.log("Budget de base 'Mon budget' créé :", res.data);
        }
    };

    //Crée un nouveau budget à partir du formulaire de création de budget
    const createBudget$1 = async (type, budgetName) => {
        if (budgetsArray.value.length < 1) {
            errorValidation.value = 'Veuillez initialiser votre budget de base "Mon budget" avant de créer un nouveau budget.';
            console.log(errorValidation.value);
            return
        }
        const newBudget = {
            title: budgetName,
            type: type,
            currency: 'EUR',
            month: new Date().toLocaleString('default', { month: 'long' }),
            year: new Date().getFullYear(),
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            goals: []
        };
        // Vérifie que le type de budget est valide
        if (type !== 'simulation' && type !== 'budget') {
            console.log('Type de budget invalide :', type);
            errorValidation.value = 'Type de budget invalide.';
            console.log(errorValidation.value);
            return
        }
        // Validation simple pour s'assurer que le titre n'est pas vide
        if (budgetName.trim() === '') {
            errorValidation.value = 'Veuillez entrer un nom pour votre projet.';
            console.log(errorValidation.value);
            return
        }
        // Si le type de budget est "simulation", initialise le budget les donnée de 'Mon budget' pour faire une simulation à partir de ce budget
        if (type === 'simulation') {
            const baseBudget = budgetsArray.value.find(budget => budget.title === 'Mon budget');
            if (!baseBudget) {
                errorValidation.value = 'Le budget de base "Mon budget" est introuvable.';
                console.log(errorValidation.value);
                return
            }
            newBudget.transactions = JSON.parse(JSON.stringify(baseBudget.transactions));
            newBudget.accounts = JSON.parse(JSON.stringify(baseBudget.accounts));
            //je retire les _id des transactions et des comptes pour éviter les conflits avec les nouveaux budgets
            newBudget.transactions.forEach(transaction => transaction._id = undefined);
            newBudget.transactions.forEach(transaction => transaction.accountAssociated = undefined);
            newBudget.accounts.forEach(account => account._id = undefined);
            console.log("Nouveau budget de simulation créé à partir de 'Mon budget' :", newBudget);
        }
        if (type === 'budget') {
            newBudget.transactions = [];
            newBudget.accounts = [];
        }
        // Sauvegarde le nouveau budget dans la BDD
        const res = await createBudget(newBudget);
        newBudget._id = res.data._id;
        // Met à jour le tableau de budgets avec le budget créé et sélectionne le nouveau budget
        budgetsArray.value.push(res.data);
        selectedBudget.value = res.data;
        console.log("Nouveau budget créé :", res.data);
    };   
    const selectBudget = async (budgetId) => {
        const budget = budgetsArray.value.find(budget => budget._id === budgetId);
        if (budget) {
            selectedBudget.value = budget;
            console.log("Budget sélectionné :", selectedBudget.value);
        } else {
            console.log("Budget non trouvé avec l'ID :", budgetId);
        }
    };
    const editBudgetTitle = async (budgetId, newTitle) => {
        event.stopPropagation(); // Empêche la propagation de l'événement de clic pour éviter de sélectionner la liste avant de la supprimer
        try {
            const updatedBudget = await updateBudget(budgetId, { title: newTitle });
            const index = budgetsArray.value.findIndex(budget => budget._id === budgetId);
            if (index !== -1) {
                budgetsArray.value[index].title = updatedBudget.data.title;
                if (selectedBudget.value && selectedBudget.value._id === budgetId) {
                    selectedBudget.value.title = updatedBudget.data.title;
                }
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du titre du budget :", error);
        }
    };
    const deleteBudget$1 = async (budgetId) => {
        event.stopPropagation(); // Empêche la propagation de l'événement de clic pour éviter de sélectionner la liste avant de la supprimer
        try {
            await deleteBudget(budgetId);
            budgetsArray.value = budgetsArray.value.filter(budget => budget._id !== budgetId);
            if (selectedBudget.value && selectedBudget.value._id === budgetId) {
                selectedBudget.value = null;
            }
            showDeleteConfirmationBudget.value = false;
            IdToDelete.value = '';
            nameToDelete.value = '';
        } catch (error) {
            console.error("Erreur lors de la suppression du budget :", error);
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
        console.log("Updated transactions:", updatedTransactions);
        // Si la validation est réussie, ajoute la transaction au budget sélectionné en BDD
        const transactionResult = await updateBudget(budgetId, {
            transactions: updatedTransactions
        });
        // Met à jour le budget sélectionné avec les nouvelles transactions
        selectedBudget.value.transactions = transactionResult.data.transactions;
    };

    // Mettre à jour une transaction du budget sélectionné
    const updateTransaction = async (updatedTransaction) => {
        console.log("Updating transaction:", updatedTransaction);
        if (selectedBudget.value) {
            const index = selectedBudget.value.transactions.findIndex(t => t._id === updatedTransaction._id);
            if (index !== -1) {
                // Mettre à jour la transaction dans le budget sélectionné
                selectedBudget.value.transactions[index] = {
                    ...selectedBudget.value.transactions[index],
                    ...updatedTransaction,
                };
                const updatedTransactions = [...selectedBudget.value.transactions];
                await updateBudget(selectedBudget.value._id, {
                transactions: updatedTransactions
                });
            }
        }
    };

    //Ajouter un compte au budget sélectionné
    const addAccount = async (account) => {
        if (selectedBudget.value) {
            const updatedAccounts = [...selectedBudget.value.accounts, account];
            console.log(updatedAccounts);
            const accountResult = await updateBudget(selectedBudget.value._id, {
            accounts: updatedAccounts
            });
            selectedBudget.value.accounts = accountResult.data.accounts;
        }
    };  
    
    // Mettre à jour un compte du budget sélectionné
    const updateAccount = async (updatedAccount) => {
        console.log("Updating account:", updatedAccount);
        if (selectedBudget.value) {
            const index = selectedBudget.value.accounts.findIndex(a => a._id === updatedAccount._id);
            if (index !== -1) {
                // Mettre à jour le compte dans le budget sélectionné
                selectedBudget.value.accounts[index] = {
                    ...selectedBudget.value.accounts[index],
                    ...updatedAccount,
                };
                const updatedAccounts = [...selectedBudget.value.accounts];
                await updateBudget(selectedBudget.value._id, {
                accounts: updatedAccounts
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
            showDeleteConfirmationTransaction.value = false;
            IdToDelete.value = '';
            nameToDelete.value = '';
        }
    };

    // supprimer un compte du budget sélectionné
    const deleteAccount =  async (accountId) => {
        if (selectedBudget.value) {
            // Met à jour la liste des comptes du budget sélectionné en filtrant le compte à supprimer
            selectedBudget.value.accounts = selectedBudget.value.accounts.filter(a => a._id !== accountId);
            await updateBudget(selectedBudget.value._id, {
            accounts: selectedBudget.value.accounts
            });
            showDeleteConfirmationAccount.value = false;
            IdToDelete.value = '';
            nameToDelete.value = '';
        }
    };
 
    // Retourne les données et les fonctions pour être utilisées dans les composants
    return {
    isDarkMode,
    updateTheme,
    budgetsArray,
    creatingBudget,
    selectedBudget,
    showBudgetResults,
    showCreateButton,
    initializeShowCreateButton,
    errorValidation,
    incomes,
    outcomes,
    balance,
    incomesByCategory,
    outcomesByCategory,
    outcomesArrayAvailable,
    outcomesArrayUnavailable,
    showDeleteConfirmationBudget,
    showDeleteConfirmationTransaction,
    showDeleteConfirmationAccount,
    IdToDelete,
    nameToDelete,
    initializeBudget,
    createBudget: createBudget$1,
    selectBudget,
    editBudgetTitle,
    deleteBudget: deleteBudget$1,
    addTransaction,
    updateTransaction,
    addAccount,
    updateAccount,
    deleteTransaction,
    deleteAccount
    }       
});

const whitecheck = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(255,%20255,%20255)'%20d='M530.8%20134.1C545.1%20144.5%20548.3%20164.5%20537.9%20178.8L281.9%20530.8C276.4%20538.4%20267.9%20543.1%20258.5%20543.9C249.1%20544.7%20240%20541.2%20233.4%20534.6L105.4%20406.6C92.9%20394.1%2092.9%20373.8%20105.4%20361.3C117.9%20348.8%20138.2%20348.8%20150.7%20361.3L252.2%20462.8L486.2%20141.1C496.6%20126.8%20516.6%20123.6%20530.9%20134z'/%3e%3c/svg%3e";

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const {createElementVNode:_createElementVNode$a,vModelText:_vModelText$5,withDirectives:_withDirectives$5,unref:_unref$8,renderList:_renderList$5,Fragment:_Fragment$5,openBlock:_openBlock$a,createElementBlock:_createElementBlock$a,toDisplayString:_toDisplayString$5,normalizeClass:_normalizeClass$4,createCommentVNode:_createCommentVNode$7,withModifiers:_withModifiers$3,normalizeStyle:_normalizeStyle} = await importShared('vue');


const _hoisted_1$9 = { class: "input-group" };
const _hoisted_2$8 = {
  key: 0,
  class: "input-group"
};
const _hoisted_3$6 = { class: "type-select" };
const _hoisted_4$6 = ["onClick"];
const _hoisted_5$6 = { class: "type-name" };
const _hoisted_6$6 = { class: "selection-style" };
const _hoisted_7$6 = ["src"];
const _hoisted_8$5 = ["src", "alt"];
const _hoisted_9$4 = { class: "type-description" };
const _hoisted_10$4 = { class: "action-buttons" };

const {computed: computed$6,ref: ref$9} = await importShared('vue');



const _sfc_main$9 = {
  __name: 'createBudget',
  setup(__props) {


const budgetStore = useBudgetStore();
const newProjectTitle = ref$9(''); // Variable pour stocker le titre du nouveau projet
const selectedType = ref$9(typeOfBudget[0].type); // Variable pour stocker le type de budget sélectionné, initialisée au premier type disponible
const selectColor = ref$9(typeOfBudget[0].color); // Variable pour stocker la couleur du type de budget sélectionné
//Fermeture du formulaire de création de budget

const closeForm = () => {
  newProjectTitle.value = '';
  selectedType.value = typeOfBudget[0].type;
  selectColor.value = typeOfBudget[0].color;
  budgetStore.creatingBudget = false;
};

const createBudget = () => {
    console.log('Création du budget avec le titre :', newProjectTitle.value, 'et le type :', selectedType.value);
  budgetStore.createBudget(selectedType.value, newProjectTitle.value); // Appelle la fonction de création de budget du store avec le titre et le type sélectionnés
    
  closeForm(); // Ferme le formulaire après la création du budget
};


return (_ctx, _cache) => {
  return (_openBlock$a(), _createElementBlock$a("div", {
    class: "choose-list-title-form",
    style: _normalizeStyle({ background: selectColor.value || 'white' })
  }, [
    _cache[6] || (_cache[6] = _createElementVNode$a("div", { class: "form-header" }, [
      _createElementVNode$a("h3", { class: "form-title" }, "Créer un nouveau projet: ✨")
    ], -1)),
    _cache[7] || (_cache[7] = _createElementVNode$a("p", { class: "form-subtitle" }, "Donnez un nom à votre projet pour mieux vous organiser ✨", -1)),
    _createElementVNode$a("form", {
      onSubmit: _cache[2] || (_cache[2] = _withModifiers$3($event => (createBudget()), ["prevent"]))
    }, [
      _createElementVNode$a("div", _hoisted_1$9, [
        _cache[3] || (_cache[3] = _createElementVNode$a("label", {
          class: "subtitle",
          for: "title"
        }, "Nom du projet:", -1)),
        _withDirectives$5(_createElementVNode$a("input", {
          class: "title-input",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((newProjectTitle).value = $event)),
          type: "text",
          placeholder: "Mon super projet"
        }, null, 512), [
          [_vModelText$5, newProjectTitle.value]
        ])
      ]),
      (_unref$8(typeOfBudget).length > 1)
        ? (_openBlock$a(), _createElementBlock$a("div", _hoisted_2$8, [
            _cache[4] || (_cache[4] = _createElementVNode$a("p", {
              class: "subtitle",
              for: "type"
            }, "Type de projet:", -1)),
            _createElementVNode$a("div", _hoisted_3$6, [
              (_openBlock$a(true), _createElementBlock$a(_Fragment$5, null, _renderList$5(_unref$8(typeOfBudget), (item) => {
                return (_openBlock$a(), _createElementBlock$a("div", {
                  class: "type-option",
                  key: item.type,
                  onClick: $event => (selectedType.value = item.type, selectColor.value = item.color)
                }, [
                  _createElementVNode$a("p", _hoisted_5$6, _toDisplayString$5(item.label), 1),
                  _createElementVNode$a("div", _hoisted_6$6, [
                    _createElementVNode$a("img", {
                      class: _normalizeClass$4(item.type === selectedType.value ? 'checked-selection' : 'not-checked-selection'),
                      src: _unref$8(whitecheck),
                      alt: "icône de validation"
                    }, null, 10, _hoisted_7$6),
                    _createElementVNode$a("img", {
                      class: _normalizeClass$4(item.type === selectedType.value ? 'type-image-selected' : 'type-image'),
                      src: item.image,
                      alt: item.alt
                    }, null, 10, _hoisted_8$5)
                  ])
                ], 8, _hoisted_4$6))
              }), 128))
            ]),
            _createElementVNode$a("p", _hoisted_9$4, _toDisplayString$5(_unref$8(typeOfBudget).find(item => item.type === selectedType.value)?.description), 1)
          ]))
        : _createCommentVNode$7("", true),
      _createElementVNode$a("div", _hoisted_10$4, [
        _createElementVNode$a("button", {
          class: "secondary-button",
          type: "button",
          onClick: _cache[1] || (_cache[1] = $event => (closeForm()))
        }, " Annuler "),
        _cache[5] || (_cache[5] = _createElementVNode$a("button", {
          class: "super-action-button submit-button",
          type: "submit"
        }, " Créer ", -1))
      ])
    ], 32)
  ], 4))
}
}

};
const CreateBudget = /*#__PURE__*/_export_sfc(_sfc_main$9, [['__scopeId',"data-v-61e37806"]]);

const {toDisplayString:_toDisplayString$4,openBlock:_openBlock$9,createElementBlock:_createElementBlock$9,createCommentVNode:_createCommentVNode$6,vModelText:_vModelText$4,unref:_unref$7,withKeys:_withKeys$3,withDirectives:_withDirectives$4,createElementVNode:_createElementVNode$9} = await importShared('vue');


const _hoisted_1$8 = { class: "budget-title-content" };
const _hoisted_2$7 = {
  key: 0,
  class: "button-text"
};
const _hoisted_3$5 = {
  key: 0,
  class: "icon-list"
};
const _hoisted_4$5 = ["src"];
const _hoisted_5$5 = ["src"];
const _hoisted_6$5 = {
  key: 1,
  class: "icon-list"
};
const _hoisted_7$5 = ["src"];
const _hoisted_8$4 = ["src"];

const {computed: computed$5,ref: ref$8,onMounted: onMounted$4} = await importShared('vue');




const _sfc_main$8 = {
  __name: 'budgetTitle',
  props: {
  title: {
    type: String,
    required: true,
      },
  budgetId: {
    type: [String, Number],
    required: true
      },

  type: {
    type: String, // 
    required: true,
    validator: (value) => {
      return typeOfBudget.some(item => item.type === value) // Vérifie que le type est valide en comparant avec les types définis dans typeBudget
    }
  }
},
  setup(__props) {

const budgetStore = useBudgetStore(); // Utilisation du store pour accéder aux données et fonctions liées aux budgets

//--------------------------Base du template-------------------------
const pencil = new URL("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(255,%20255,%20255)'%20d='M100.4%20417.2C104.5%20402.6%20112.2%20389.3%20123%20378.5L304.2%20197.3L338.1%20163.4C354.7%20180%20389.4%20214.7%20442.1%20267.4L476%20301.3L442.1%20335.2L260.9%20516.4C250.2%20527.1%20236.8%20534.9%20222.2%20539L94.4%20574.6C86.1%20576.9%2077.1%20574.6%2071%20568.4C64.9%20562.2%2062.6%20553.3%2064.9%20545L100.4%20417.2zM156%20413.5C151.6%20418.2%20148.4%20423.9%20146.7%20430.1L122.6%20517L209.5%20492.9C215.9%20491.1%20221.7%20487.8%20226.5%20483.2L155.9%20413.5zM510%20267.4C493.4%20250.8%20458.7%20216.1%20406%20163.4L372%20129.5C398.5%20103%20413.4%2088.1%20416.9%2084.6C430.4%2071%20448.8%2063.4%20468%2063.4C487.2%2063.4%20505.6%2071%20519.1%2084.6L554.8%20120.3C568.4%20133.9%20576%20152.3%20576%20171.4C576%20190.5%20568.4%20209%20554.8%20222.5C551.3%20226%20536.4%20240.9%20509.9%20267.4z'/%3e%3c/svg%3e", import.meta.url).href;
const trash = new URL("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(255,%20255,%20255)'%20d='M232.7%2069.9L224%2096L128%2096C110.3%2096%2096%20110.3%2096%20128C96%20145.7%20110.3%20160%20128%20160L512%20160C529.7%20160%20544%20145.7%20544%20128C544%20110.3%20529.7%2096%20512%2096L416%2096L407.3%2069.9C402.9%2056.8%20390.7%2048%20376.9%2048L263.1%2048C249.3%2048%20237.1%2056.8%20232.7%2069.9zM512%20208L128%20208L149.1%20531.1C150.7%20556.4%20171.7%20576%20197%20576L443%20576C468.3%20576%20489.3%20556.4%20490.9%20531.1L512%20208z'/%3e%3c/svg%3e", import.meta.url).href;
const pencilDark = new URL("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(27,%2052,%2097)'%20d='M100.4%20417.2C104.5%20402.6%20112.2%20389.3%20123%20378.5L304.2%20197.3L338.1%20163.4C354.7%20180%20389.4%20214.7%20442.1%20267.4L476%20301.3L442.1%20335.2L260.9%20516.4C250.2%20527.1%20236.8%20534.9%20222.2%20539L94.4%20574.6C86.1%20576.9%2077.1%20574.6%2071%20568.4C64.9%20562.2%2062.6%20553.3%2064.9%20545L100.4%20417.2zM156%20413.5C151.6%20418.2%20148.4%20423.9%20146.7%20430.1L122.6%20517L209.5%20492.9C215.9%20491.1%20221.7%20487.8%20226.5%20483.2L155.9%20413.5zM510%20267.4C493.4%20250.8%20458.7%20216.1%20406%20163.4L372%20129.5C398.5%20103%20413.4%2088.1%20416.9%2084.6C430.4%2071%20448.8%2063.4%20468%2063.4C487.2%2063.4%20505.6%2071%20519.1%2084.6L554.8%20120.3C568.4%20133.9%20576%20152.3%20576%20171.4C576%20190.5%20568.4%20209%20554.8%20222.5C551.3%20226%20536.4%20240.9%20509.9%20267.4z'/%3e%3c/svg%3e", import.meta.url).href;
const trashDark = new URL("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(27,%2052,%2097)'%20d='M232.7%2069.9L224%2096L128%2096C110.3%2096%2096%20110.3%2096%20128C96%20145.7%20110.3%20160%20128%20160L512%20160C529.7%20160%20544%20145.7%20544%20128C544%20110.3%20529.7%2096%20512%2096L416%2096L407.3%2069.9C402.9%2056.8%20390.7%2048%20376.9%2048L263.1%2048C249.3%2048%20237.1%2056.8%20232.7%2069.9zM512%20208L128%20208L149.1%20531.1C150.7%20556.4%20171.7%20576%20197%20576L443%20576C468.3%20576%20489.3%20556.4%20490.9%20531.1L512%20208z'/%3e%3c/svg%3e", import.meta.url).href;
const check = new URL("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='%234caf8d'%20d='M530.8%20134.1C545.1%20144.5%20548.3%20164.5%20537.9%20178.8L281.9%20530.8C276.4%20538.4%20267.9%20543.1%20258.5%20543.9C249.1%20544.7%20240%20541.2%20233.4%20534.6L105.4%20406.6C92.9%20394.1%2092.9%20373.8%20105.4%20361.3C117.9%20348.8%20138.2%20348.8%20150.7%20361.3L252.2%20462.8L486.2%20141.1C496.6%20126.8%20516.6%20123.6%20530.9%20134z'/%3e%3c/svg%3e", import.meta.url).href;
const cross = new URL("data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='%23e35d6a'%20d='M183.1%20137.4C170.6%20124.9%20150.3%20124.9%20137.8%20137.4C125.3%20149.9%20125.3%20170.2%20137.8%20182.7L275.2%20320L137.9%20457.4C125.4%20469.9%20125.4%20490.2%20137.9%20502.7C150.4%20515.2%20170.7%20515.2%20183.2%20502.7L320.5%20365.3L457.9%20502.6C470.4%20515.1%20490.7%20515.1%20503.2%20502.6C515.7%20490.1%20515.7%20469.8%20503.2%20457.3L365.8%20320L503.1%20182.6C515.6%20170.1%20515.6%20149.8%20503.1%20137.3C490.6%20124.8%20470.3%20124.8%20457.8%20137.3L320.5%20274.7L183.1%20137.4z'/%3e%3c/svg%3e", import.meta.url).href;

const props = __props;



//---------------------------GESTION DE L'ÉDITION ET DE LA SUPPRESSION DE LISTE-------------------------

computed$5(() => props.title); // Computed pour le titre de la budget
const newTitle = ref$8(props.title); // Variable réactive pour stocker le nouveau titre lors de l'édition
computed$5(() => { // Computed pour déterminer la couleur de fond en fonction du type de budget
  const typeInfo = typeOfBudget.find(item => item.type === props.type); // Trouve les informations du type de budget dans le tableau typeOfBudget
  return typeInfo ? typeInfo.color : 'var(--light-pink)' // Retourne la couleur correspondante ou transparent si le type n'est pas trouvé
});
const isEditing = ref$8(false); // Variable réactive pour contrôler le mode édition
const stopPropagation = () => {
  event.stopPropagation(); // Empêche la propagation de l'événement de clic pour éviter de sélectionner la budget avant de la supprimer
};
// Emit pour les actions d'édition et de suppression

const updatemode = () => {
  event.stopPropagation(); // Empêche la propagation de l'événement de clic pour éviter de sélectionner la budget avant de la supprimer
  isEditing.value = true; // Bascule le mode édition
};

const endUpdatemode = () => {
  event.stopPropagation(); // Empêche la propagation de l'événement de clic pour éviter de sélectionner la budget avant de la supprimer
  isEditing.value = false; // Désactive le mode édition
  newTitle.value = props.title; // Réinitialise le titre à l'original en cas d'annulation
};
const closeEditMode = () => {
  event.stopPropagation(); // Empêche la propagation de l'événement de clic pour éviter de sélectionner la budget avant de la supprimer
  isEditing.value = false; // Désactive le mode édition
};
function SelectBudget() {
  budgetStore.selectBudget(props.budgetId); // Appelle la fonction de sélection du budget dans le store avec l'ID de la budget
}


return (_ctx, _cache) => {
  return (_openBlock$9(), _createElementBlock$9("button", {
    class: "budget-title-button",
    onClick: SelectBudget
  }, [
    _createElementVNode$9("div", _hoisted_1$8, [
      (!isEditing.value)
        ? (_openBlock$9(), _createElementBlock$9("p", _hoisted_2$7, _toDisplayString$4(newTitle.value), 1))
        : _withDirectives$4((_openBlock$9(), _createElementBlock$9("input", {
            key: 1,
            class: "input-edit",
            type: "text",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((newTitle).value = $event)),
            onKeyup: _cache[1] || (_cache[1] = _withKeys$3($event => {_unref$7(budgetStore).editBudgetTitle(__props.budgetId, newTitle.value); closeEditMode();}, ["enter"])),
            onClick: _cache[2] || (_cache[2] = $event => (stopPropagation()))
          }, null, 544)), [
            [_vModelText$4, newTitle.value]
          ])
    ]),
    (!isEditing.value)
      ? (_openBlock$9(), _createElementBlock$9("div", _hoisted_3$5, [
          _createElementVNode$9("img", {
            class: "icon-edit",
            src: _unref$7(budgetStore).isDarkMode ? _unref$7(pencil) : _unref$7(pencilDark),
            alt: "modifier",
            onClick: _cache[3] || (_cache[3] = $event => (updatemode()))
          }, null, 8, _hoisted_4$5),
          _createElementVNode$9("img", {
            class: "icon-edit",
            src: _unref$7(budgetStore).isDarkMode ? _unref$7(trash) : _unref$7(trashDark),
            alt: "supprimer",
            onClick: _cache[4] || (_cache[4] = $event => {stopPropagation(); _unref$7(budgetStore).showDeleteConfirmationBudget = true; _unref$7(budgetStore).IdToDelete = __props.budgetId; _unref$7(budgetStore).nameToDelete = newTitle.value;})
          }, null, 8, _hoisted_5$5)
        ]))
      : (_openBlock$9(), _createElementBlock$9("div", _hoisted_6$5, [
          _createElementVNode$9("img", {
            class: "icon-edit",
            src: _unref$7(check),
            alt: "valider",
            onClick: _cache[5] || (_cache[5] = $event => {_unref$7(budgetStore).editBudgetTitle(__props.budgetId, newTitle.value); closeEditMode();})
          }, null, 8, _hoisted_7$5),
          _createElementVNode$9("img", {
            class: "icon-edit",
            src: _unref$7(cross),
            alt: "annuler",
            onClick: endUpdatemode
          }, null, 8, _hoisted_8$4)
        ]))
  ]))
}
}

};
const BudgetTitle = /*#__PURE__*/_export_sfc(_sfc_main$8, [['__scopeId',"data-v-de8c4921"]]);

const _sfc_main$7 = {  };
const {createElementVNode:_createElementVNode$8,openBlock:_openBlock$8,createElementBlock:_createElementBlock$8} = await importShared('vue');


const _hoisted_1$7 = { class: "starbar" };

function _sfc_render(_ctx, _cache) {
  return (_openBlock$8(), _createElementBlock$8("div", _hoisted_1$7, _cache[0] || (_cache[0] = [
    _createElementVNode$8("div", { class: "left-bar" }, null, -1),
    _createElementVNode$8("p", null, "⭐️", -1),
    _createElementVNode$8("div", { class: "right-bar" }, null, -1)
  ])))
}
const StarBar = /*#__PURE__*/_export_sfc(_sfc_main$7, [['render',_sfc_render],['__scopeId',"data-v-3600db60"]]);

const {createElementVNode:_createElementVNode$7,createVNode:_createVNode$3,renderList:_renderList$4,Fragment:_Fragment$4,openBlock:_openBlock$7,createElementBlock:_createElementBlock$7,createBlock:_createBlock$2,unref:_unref$6,createCommentVNode:_createCommentVNode$5} = await importShared('vue');


const _hoisted_1$6 = { class: "preserve-display-style" };
const _hoisted_2$6 = {
  key: 0,
  class: "button-background"
};

const {ref: ref$7,computed: computed$4,onMounted: onMounted$3,onUnmounted: onUnmounted$3,nextTick} = await importShared('vue');


const _sfc_main$6 = {
  __name: 'Sidebar',
  setup(__props) {


const budgetStore = useBudgetStore(); // Utilisation du store pour accéder aux données et fonctions liées au budget

// -------------------------GESTION DU THÈME (SOMBRE/CLAIR)-------------------------
computed$4(() => budgetStore.isDarkMode); // Variable réactive pour stocker le thème (false = clair, true = sombre)

onMounted$3(() => { // Exécuté quand le composant est monté

   budgetStore.updateTheme();
  const observer = new MutationObserver(() => {
      budgetStore.updateTheme();
    });
  observer.observe(document.documentElement,{attributes: true, attributeFilter: ["data-theme"]});
  onUnmounted$3(() => { // Exécuté quand le composant est détruit
      observer.disconnect();
  });

  budgetStore.initializeShowCreateButton();



});
// ------------------------- Gestions de liste de budget-------------------------

const showBudgetResult = () => { // Fonction pour afficher les résultats du budget
  budgetStore.showBudgetResults = true; // Met à jour la variable dans le store pour afficher les résultats du budget
  budgetStore.initializeBudget(); // Appelle la fonction pour initialiser le budget (peut être utilisée pour charger les données du budget sélectionné)
  console.log('Budget sélectionné :', budgetStore.selectedBudget); // Affiche dans la console le budget sélectionné (pour le débogage)
};
const showOthersBudget = () => { // Fonction pour afficher les autres budgets
  budgetStore.showBudgetResults = true; // Met à jour la variable dans le store pour masquer les résultats du budget et afficher la liste des budgets
  console.log('Affichage de la liste des budgets'); // Affiche dans la console un message indiquant que la liste des budgets est affichée (pour le débogage)
};
//je créer une computed pour récupérer la liste des budgets depuis le store en lui enlevant le budget à l'index 0
const budgets = computed$4(() => budgetStore.budgetsArray.slice(1)); // Computed pour obtenir la liste des budgets depuis le store, en excluant le budget par défaut (index 0)

const sidebar = ref$7(null); // Référence au conteneur de la barre latérale pour le défilement
const goDown = async () => {
  budgetStore.creatingBudget = true;
  await nextTick();
  sidebar.value.scrollTop = sidebar.value.scrollHeight;
};

return (_ctx, _cache) => {
  return (_openBlock$7(), _createElementBlock$7("nav", {
    ref_key: "sidebar",
    ref: sidebar,
    class: "list-sidebar"
  }, [
    _cache[5] || (_cache[5] = _createElementVNode$7("h2", null, " Budget ", -1)),
    _createVNode$3(StarBar),
    (_openBlock$7(true), _createElementBlock$7(_Fragment$4, null, _renderList$4(budgets.value, (item) => {
      return (_openBlock$7(), _createBlock$2(BudgetTitle, {
        key: item._id,
        budgetId: item._id,
        title: item.title,
        type: item.type,
        onClick: _cache[0] || (_cache[0] = $event => (showOthersBudget()))
      }, null, 8, ["budgetId", "title", "type"]))
    }), 128)),
    _createElementVNode$7("div", _hoisted_1$6, [
      (!_unref$6(budgetStore).creatingBudget && _unref$6(budgetStore).showCreateButton)
        ? (_openBlock$7(), _createElementBlock$7("div", _hoisted_2$6, [
            (_openBlock$7(), _createElementBlock$7("button", {
              key: _unref$6(budgetStore).selectedBudget?.title === 'Mon budget' ? 'default' : _unref$6(budgetStore).selectedBudget?._id,
              class: "list-title-button",
              onClick: _cache[1] || (_cache[1] = $event => (showBudgetResult()))
            }, _cache[3] || (_cache[3] = [
              _createElementVNode$7("div", { class: "list-title-content" }, [
                _createElementVNode$7("p", { class: "button-text" }, "Mon Budget")
              ], -1)
            ]))),
            _createElementVNode$7("button", {
              class: "super-action-button",
              onClick: _cache[2] || (_cache[2] = $event => (_unref$6(budgetStore).creatingBudget = true, goDown()))
            }, _cache[4] || (_cache[4] = [
              _createElementVNode$7("p", { class: "button-text" }, "Créer", -1)
            ]))
          ]))
        : _createCommentVNode$5("", true)
    ]),
    (_unref$6(budgetStore).creatingBudget)
      ? (_openBlock$7(), _createBlock$2(CreateBudget, { key: 0 }))
      : _createCommentVNode$5("", true)
  ], 512))
}
}

};
const sidebar = /*#__PURE__*/_export_sfc(_sfc_main$6, [['__scopeId',"data-v-24d16fe5"]]);

const sendImg = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(255,%20255,%20255)'%20d='M568.4%2037.7C578.2%2034.2%20589%2036.7%20596.4%2044C603.8%2051.3%20606.2%2062.2%20602.7%2072L424.7%20568.9C419.7%20582.8%20406.6%20592%20391.9%20592C377.7%20592%20364.9%20583.4%20359.6%20570.3L295.4%20412.3C290.9%20401.3%20292.9%20388.7%20300.6%20379.7L395.1%20267.3C400.2%20261.2%20399.8%20252.3%20394.2%20246.7C388.6%20241.1%20379.6%20240.7%20373.6%20245.8L261.2%20340.1C252.1%20347.7%20239.6%20349.7%20228.6%20345.3L70.1%20280.8C57%20275.5%2048.4%20262.7%2048.4%20248.5C48.4%20233.8%2057.6%20220.7%2071.5%20215.7L568.4%2037.7z'/%3e%3c/svg%3e";

const arrowLeft = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(137,%20108,%20221)'%20d='M73.4%20297.4C60.9%20309.9%2060.9%20330.2%2073.4%20342.7L233.4%20502.7C245.9%20515.2%20266.2%20515.2%20278.7%20502.7C291.2%20490.2%20291.2%20469.9%20278.7%20457.4L173.3%20352L544%20352C561.7%20352%20576%20337.7%20576%20320C576%20302.3%20561.7%20288%20544%20288L173.3%20288L278.7%20182.6C291.2%20170.1%20291.2%20149.8%20278.7%20137.3C266.2%20124.8%20245.9%20124.8%20233.4%20137.3L73.4%20297.3z'/%3e%3c/svg%3e";

const AngleDown = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(255,%20255,%20255)'%20d='M297.4%20438.6C309.9%20451.1%20330.2%20451.1%20342.7%20438.6L502.7%20278.6C515.2%20266.1%20515.2%20245.8%20502.7%20233.3C490.2%20220.8%20469.9%20220.8%20457.4%20233.3L320%20370.7L182.6%20233.4C170.1%20220.9%20149.8%20220.9%20137.3%20233.4C124.8%20245.9%20124.8%20266.2%20137.3%20278.7L297.3%20438.7z'/%3e%3c/svg%3e";

// composables/useDevice.js
const {ref: ref$6,onMounted: onMounted$2,onUnmounted: onUnmounted$2} = await importShared('vue');


function useIsMobile() {
  const isMobile = ref$6(window.innerWidth <= 768);

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

const trashDark = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(27,%2052,%2097)'%20d='M232.7%2069.9L224%2096L128%2096C110.3%2096%2096%20110.3%2096%20128C96%20145.7%20110.3%20160%20128%20160L512%20160C529.7%20160%20544%20145.7%20544%20128C544%20110.3%20529.7%2096%20512%2096L416%2096L407.3%2069.9C402.9%2056.8%20390.7%2048%20376.9%2048L263.1%2048C249.3%2048%20237.1%2056.8%20232.7%2069.9zM512%20208L128%20208L149.1%20531.1C150.7%20556.4%20171.7%20576%20197%20576L443%20576C468.3%20576%20489.3%20556.4%20490.9%20531.1L512%20208z'/%3e%3c/svg%3e";

const {vModelText:_vModelText$3,normalizeClass:_normalizeClass$3,createElementVNode:_createElementVNode$6,withDirectives:_withDirectives$3,vShow:_vShow,vModelSelect:_vModelSelect$2,unref:_unref$5,openBlock:_openBlock$6,createElementBlock:_createElementBlock$6} = await importShared('vue');


const _hoisted_1$5 = { class: "transactions-box" };
const _hoisted_2$5 = { value: "assurance" };
const _hoisted_3$4 = { value: "courses" };
const _hoisted_4$4 = { value: "credits" };
const _hoisted_5$4 = { value: "divertissement" };
const _hoisted_6$4 = { value: "enfants" };
const _hoisted_7$4 = { value: "impots" };
const _hoisted_8$3 = { value: "internet" };
const _hoisted_9$3 = { value: "logement" };
const _hoisted_10$3 = { value: "perso" };
const _hoisted_11$3 = { value: "pro" };
const _hoisted_12$3 = { value: "santé" };
const _hoisted_13$3 = { value: "transport" };
const _hoisted_14$3 = { value: "salaire" };
const _hoisted_15$3 = { value: "entreprise" };
const _hoisted_16$1 = { value: "freelance" };
const _hoisted_17$1 = { value: "pension" };
const _hoisted_18$1 = { value: "allocations" };
const _hoisted_19$1 = { value: "investissements" };
const _hoisted_20$1 = ["src"];

const {ref: ref$5} = await importShared('vue');


const _sfc_main$5 = {
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
    },
    checked: {
        type: Boolean,
        required: true
    },
    associatedAccount: {
        type: [String, Number],
    }


},
  setup(__props) {

const budgetStore = useBudgetStore(); // Utilisation du store pour accéder aux données et fonctions
//je créé des props pour pouvoir les utiliser dans le composant et les afficher dans le template
const props = __props;

const amountSelected = ref$5(props.amount); // Valeur initiale du montant de la transaction
const nameSelected = ref$5(props.named); // Valeur initiale du nom de la transaction
const categorySelected = ref$5(props.category===''? 'Sélectionner une catégorie' : props.category); // Valeur initiale de la catégorie de la transaction
ref$5(props.amount.toFixed(2)); // Affiche le montant avec deux décimales

const update = () => {
     budgetStore.updateTransaction({
        _id: props._id,
        amount: amountSelected.value,
        named: nameSelected.value,
        category: categorySelected.value,
        incomes: props.incomes,
        checked: props.checked,
        accountAssociated: props.associatedAccount
    });
      
};


return (_ctx, _cache) => {
  return (_openBlock$6(), _createElementBlock$6("div", _hoisted_1$5, [
    _withDirectives$3(_createElementVNode$6("input", {
      class: _normalizeClass$3(__props.incomes? 'data' : 'data-outcomes' ),
      type: "number",
      step: ".01",
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((amountSelected).value = $event)),
      onChange: _cache[1] || (_cache[1] = $event => (update()))
    }, null, 34), [
      [_vModelText$3, amountSelected.value]
    ]),
    _withDirectives$3(_createElementVNode$6("input", {
      class: _normalizeClass$3(__props.incomes? 'data' : 'data-outcomes' ),
      type: "text",
      "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((nameSelected).value = $event)),
      onChange: _cache[3] || (_cache[3] = $event => (update()))
    }, null, 34), [
      [_vModelText$3, nameSelected.value]
    ]),
    _withDirectives$3(_createElementVNode$6("select", {
      class: _normalizeClass$3(__props.incomes? 'data' : 'data-outcomes'),
      "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((categorySelected).value = $event)),
      onChange: _cache[5] || (_cache[5] = $event => (update()))
    }, [
      _cache[7] || (_cache[7] = _createElementVNode$6("option", {
        disabled: "",
        value: ""
      }, " Choisir une catégorie ", -1)),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_2$5, "Assurance", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_3$4, "Courses", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_4$4, "Crédits", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_5$4, "Divertissement", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_6$4, "Enfants", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_7$4, "Impôts", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_8$3, "Internet & téléphonie", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_9$3, "Logement", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_10$3, "Perso", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_11$3, "Pro", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_12$3, "Santé", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_13$3, "Transport", 512), [
        [_vShow, !__props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_14$3, "Salaire", 512), [
        [_vShow, __props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_15$3, "Entreprise", 512), [
        [_vShow, __props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_16$1, "Freelance", 512), [
        [_vShow, __props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_17$1, "Pension", 512), [
        [_vShow, __props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_18$1, "Allocations", 512), [
        [_vShow, __props.incomes]
      ]),
      _withDirectives$3(_createElementVNode$6("option", _hoisted_19$1, "Investissements", 512), [
        [_vShow, __props.incomes]
      ]),
      _cache[8] || (_cache[8] = _createElementVNode$6("option", { value: "autre" }, "Autre", -1))
    ], 34), [
      [_vModelSelect$2, categorySelected.value]
    ]),
    _createElementVNode$6("img", {
      class: "icon-delete",
      src: _unref$5(trashDark),
      alt: "delete",
      onClick: _cache[6] || (_cache[6] = $event => {_unref$5(budgetStore).showDeleteConfirmationTransaction = true; _unref$5(budgetStore).IdToDelete = props._id; _unref$5(budgetStore).nameToDelete = nameSelected.value;})
    }, null, 8, _hoisted_20$1)
  ]))
}
}

};
const Transactions = /*#__PURE__*/_export_sfc(_sfc_main$5, [['__scopeId',"data-v-564edb5d"]]);

const IconAnalysis = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(135,%20110,%20193)'%20d='M160%2096C124.7%2096%2096%20124.7%2096%20160L96%20480C96%20515.3%20124.7%20544%20160%20544L480%20544C515.3%20544%20544%20515.3%20544%20480L544%20160C544%20124.7%20515.3%2096%20480%2096L160%2096zM216%20288C229.3%20288%20240%20298.7%20240%20312L240%20424C240%20437.3%20229.3%20448%20216%20448C202.7%20448%20192%20437.3%20192%20424L192%20312C192%20298.7%20202.7%20288%20216%20288zM400%20376C400%20362.7%20410.7%20352%20424%20352C437.3%20352%20448%20362.7%20448%20376L448%20424C448%20437.3%20437.3%20448%20424%20448C410.7%20448%20400%20437.3%20400%20424L400%20376zM320%20192C333.3%20192%20344%20202.7%20344%20216L344%20424C344%20437.3%20333.3%20448%20320%20448C306.7%20448%20296%20437.3%20296%20424L296%20216C296%20202.7%20306.7%20192%20320%20192z'/%3e%3c/svg%3e";

const {createElementVNode:_createElementVNode$5,unref:_unref$4,normalizeClass:_normalizeClass$2,toDisplayString:_toDisplayString$3,renderList:_renderList$3,Fragment:_Fragment$3,openBlock:_openBlock$5,createElementBlock:_createElementBlock$5,createCommentVNode:_createCommentVNode$4} = await importShared('vue');


const _hoisted_1$4 = ["src"];
const _hoisted_2$4 = {
  key: 0,
  class: "analysis-results-box"
};
const _hoisted_3$3 = { class: "box" };
const _hoisted_4$3 = { class: "analysis-header" };
const _hoisted_5$3 = ["src"];
const _hoisted_6$3 = { class: "savings" };
const _hoisted_7$3 = { class: "saving" };
const _hoisted_8$2 = { class: "saving" };
const _hoisted_9$2 = { class: "saving" };
const _hoisted_10$2 = { class: "box" };
const _hoisted_11$2 = { class: "categories" };
const _hoisted_12$2 = { class: "income-outcome-text" };
const _hoisted_13$2 = { class: "box" };
const _hoisted_14$2 = { class: "categories" };
const _hoisted_15$2 = { class: "income-outcome-text" };

const {ref: ref$4,computed: computed$3} = await importShared('vue');

const _sfc_main$4 = {
  __name: 'analysis',
  setup(__props) {

const budgetStore = useBudgetStore();

const balanceDisplay = computed$3(() => {
  return budgetStore.balance.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2}).replace(/\u202f/g, ' ') 
});
//balance fois douze pour les prévisions sur un an
const balanceDisplayOneYear = computed$3(() => {
  return (budgetStore.balance * 12).toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2}).replace(/\u202f/g, ' ') 
});
//balance fois soixante pour les prévisions sur cinq ans
const balanceDisplayFiveYears = computed$3(() => {
  return (budgetStore.balance * 60).toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2}).replace(/\u202f/g, ' ') 
});
//catégories de dépenses et de revenus pour les graphiques rangé du plus élevé au moins élevé
const outcomesByCategoryDisplay = computed$3(() => {
  return budgetStore.outcomesByCategory.sort((a, b) => b.total - a.total)
});
const incomesByCategoryDisplay = computed$3(() => {
  return budgetStore.incomesByCategory.sort((a, b) => b.total - a.total)
});
const isOpen = ref$4(false);

return (_ctx, _cache) => {
  return (_openBlock$5(), _createElementBlock$5("div", null, [
    _createElementVNode$5("div", {
      class: "analysis-title-box",
      onClick: _cache[0] || (_cache[0] = $event => (isOpen.value = !isOpen.value))
    }, [
      _cache[1] || (_cache[1] = _createElementVNode$5("h4", { class: "analysis-title" }, "Et si on regardait ton budget d’un peu plus près ?", -1)),
      _createElementVNode$5("img", {
        src: _unref$4(AngleDown),
        alt: "Voir plus",
        class: _normalizeClass$2(["angle-down", { rotated: isOpen.value }])
      }, null, 10, _hoisted_1$4)
    ]),
    (isOpen.value)
      ? (_openBlock$5(), _createElementBlock$5("div", _hoisted_2$4, [
          _createElementVNode$5("div", _hoisted_3$3, [
            _createElementVNode$5("div", _hoisted_4$3, [
              _createElementVNode$5("img", {
                src: _unref$4(IconAnalysis),
                alt: "Analyse",
                class: "icon-analysis"
              }, null, 8, _hoisted_5$3),
              _cache[2] || (_cache[2] = _createElementVNode$5("div", { class: "analysis-title" }, [
                _createElementVNode$5("h5", null, "Prévisions:"),
                _createElementVNode$5("p", { class: "text" }, "estimation de tes économies futures")
              ], -1))
            ]),
            _createElementVNode$5("div", _hoisted_6$3, [
              _createElementVNode$5("div", _hoisted_7$3, [
                _cache[3] || (_cache[3] = _createElementVNode$5("p", { class: "text" }, "Résultat ce mois-ci :", -1)),
                _createElementVNode$5("p", {
                  class: _normalizeClass$2(_unref$4(budgetStore).selectedBudget ? _unref$4(budgetStore).balance > 0 ? 'positive' : 'negative' : 'neutral')
                }, _toDisplayString$3(_unref$4(budgetStore).selectedBudget ? balanceDisplay.value : 0) + "€", 3)
              ]),
              _createElementVNode$5("div", _hoisted_8$2, [
                _cache[4] || (_cache[4] = _createElementVNode$5("p", { class: "text" }, "Si tu continue sur 1 an :", -1)),
                _createElementVNode$5("p", {
                  class: _normalizeClass$2(_unref$4(budgetStore).selectedBudget ? _unref$4(budgetStore).balance * 12 > 0 ? 'positive' : 'negative' : 'neutral')
                }, _toDisplayString$3(_unref$4(budgetStore).selectedBudget ? balanceDisplayOneYear.value : 0) + "€", 3)
              ]),
              _createElementVNode$5("div", _hoisted_9$2, [
                _cache[5] || (_cache[5] = _createElementVNode$5("p", { class: "text" }, "Si tu continue sur 5 ans :", -1)),
                _createElementVNode$5("p", {
                  class: _normalizeClass$2(_unref$4(budgetStore).selectedBudget ? _unref$4(budgetStore).balance * 60 > 0 ? 'positive' : 'negative' : 'neutral')
                }, _toDisplayString$3(_unref$4(budgetStore).selectedBudget ? balanceDisplayFiveYears.value : 0) + "€", 3)
              ])
            ])
          ]),
          _createElementVNode$5("div", _hoisted_10$2, [
            _cache[7] || (_cache[7] = _createElementVNode$5("h5", null, "Dépenses par catégorie:", -1)),
            _createElementVNode$5("div", _hoisted_11$2, [
              (_openBlock$5(true), _createElementBlock$5(_Fragment$3, null, _renderList$3(outcomesByCategoryDisplay.value, (category) => {
                return (_openBlock$5(), _createElementBlock$5("div", {
                  class: "category",
                  key: category.category
                }, [
                  _cache[6] || (_cache[6] = _createElementVNode$5("div", { class: "circle-outcome" }, null, -1)),
                  _createElementVNode$5("p", _hoisted_12$2, _toDisplayString$3(category.category), 1),
                  _createElementVNode$5("p", {
                    class: _normalizeClass$2(category.total > 0 ? 'negative' : 'neutral')
                  }, _toDisplayString$3(category.total) + "€", 3)
                ]))
              }), 128))
            ])
          ]),
          _createElementVNode$5("div", _hoisted_13$2, [
            _cache[9] || (_cache[9] = _createElementVNode$5("h5", null, "Revenus par catégorie:", -1)),
            _createElementVNode$5("div", _hoisted_14$2, [
              (_openBlock$5(true), _createElementBlock$5(_Fragment$3, null, _renderList$3(incomesByCategoryDisplay.value, (category) => {
                return (_openBlock$5(), _createElementBlock$5("div", {
                  class: "category",
                  key: category.category
                }, [
                  _cache[8] || (_cache[8] = _createElementVNode$5("div", { class: "circle-income" }, null, -1)),
                  _createElementVNode$5("p", _hoisted_15$2, _toDisplayString$3(category.category), 1),
                  _createElementVNode$5("p", {
                    class: _normalizeClass$2(category.total > 0 ? 'positive' : 'neutral')
                  }, _toDisplayString$3(category.total) + "€", 3)
                ]))
              }), 128))
            ])
          ])
        ]))
      : _createCommentVNode$4("", true)
  ]))
}
}

};
const Analysis = /*#__PURE__*/_export_sfc(_sfc_main$4, [['__scopeId',"data-v-e98300f3"]]);

const xMark = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(255,%20255,%20255)'%20d='M183.1%20137.4C170.6%20124.9%20150.3%20124.9%20137.8%20137.4C125.3%20149.9%20125.3%20170.2%20137.8%20182.7L275.2%20320L137.9%20457.4C125.4%20469.9%20125.4%20490.2%20137.9%20502.7C150.4%20515.2%20170.7%20515.2%20183.2%20502.7L320.5%20365.3L457.9%20502.6C470.4%20515.1%20490.7%20515.1%20503.2%20502.6C515.7%20490.1%20515.7%20469.8%20503.2%20457.3L365.8%20320L503.1%20182.6C515.6%20170.1%20515.6%20149.8%20503.1%20137.3C490.6%20124.8%20470.3%20124.8%20457.8%20137.3L320.5%20274.7L183.1%20137.4z'/%3e%3c/svg%3e";

const pencilDark = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20640%20640'%3e%3c!--!Font%20Awesome%20Free%207.2.0%20by%20@fontawesome%20-%20https://fontawesome.com%20License%20-%20https://fontawesome.com/license/free%20Copyright%202026%20Fonticons,%20Inc.--%3e%3cpath%20fill='rgb(27,%2052,%2097)'%20d='M100.4%20417.2C104.5%20402.6%20112.2%20389.3%20123%20378.5L304.2%20197.3L338.1%20163.4C354.7%20180%20389.4%20214.7%20442.1%20267.4L476%20301.3L442.1%20335.2L260.9%20516.4C250.2%20527.1%20236.8%20534.9%20222.2%20539L94.4%20574.6C86.1%20576.9%2077.1%20574.6%2071%20568.4C64.9%20562.2%2062.6%20553.3%2064.9%20545L100.4%20417.2zM156%20413.5C151.6%20418.2%20148.4%20423.9%20146.7%20430.1L122.6%20517L209.5%20492.9C215.9%20491.1%20221.7%20487.8%20226.5%20483.2L155.9%20413.5zM510%20267.4C493.4%20250.8%20458.7%20216.1%20406%20163.4L372%20129.5C398.5%20103%20413.4%2088.1%20416.9%2084.6C430.4%2071%20448.8%2063.4%20468%2063.4C487.2%2063.4%20505.6%2071%20519.1%2084.6L554.8%20120.3C568.4%20133.9%20576%20152.3%20576%20171.4C576%20190.5%20568.4%20209%20554.8%20222.5C551.3%20226%20536.4%20240.9%20509.9%20267.4z'/%3e%3c/svg%3e";

const {toDisplayString:_toDisplayString$2,openBlock:_openBlock$4,createElementBlock:_createElementBlock$4,createCommentVNode:_createCommentVNode$3,unref:_unref$3,vModelText:_vModelText$2,withKeys:_withKeys$2,withDirectives:_withDirectives$2,createElementVNode:_createElementVNode$4,renderList:_renderList$2,Fragment:_Fragment$2,vModelCheckbox:_vModelCheckbox,vModelSelect:_vModelSelect$1} = await importShared('vue');


const _hoisted_1$3 = { class: "card-box" };
const _hoisted_2$3 = { class: "header" };
const _hoisted_3$2 = { class: "title-card" };
const _hoisted_4$2 = {
  key: 0,
  class: "sweet-bleu"
};
const _hoisted_5$2 = ["src"];
const _hoisted_6$2 = ["src"];
const _hoisted_7$2 = { class: "border-card" };
const _hoisted_8$1 = { class: "transcations-displayed-text" };
const _hoisted_9$1 = { class: "transcations-displayed-span sweet-bleu" };
const _hoisted_10$1 = { class: "transcations-displayed-span sweet-bleu" };
const _hoisted_11$1 = ["onUpdate:modelValue", "onChange"];
const _hoisted_12$1 = ["src", "onClick"];
const _hoisted_13$1 = ["value"];
const _hoisted_14$1 = { class: "ended-style" };
const _hoisted_15$1 = { class: "sweet-bleu" };

const {computed: computed$2,ref: ref$3} = await importShared('vue');

const _sfc_main$3 = {
  __name: 'card',
  props: {
    name: {
        type: String,
        required: true
    },
    _id: {
        type: [String, Number],
        required: true
    }
},
  setup(__props) {

const budgetStore = useBudgetStore();

const props = __props;

const accounts = computed$2(() => budgetStore.selectedBudget.accounts); // Récupère la liste des comptes depuis le store
const outcomes = computed$2(() => budgetStore.outcomesArrayAvailable); // Récupère la liste des outcomes depuis le store    
const selectedOutcome = ref$3('null'); // Stocke l'outcome sélectionné dans le select
const transactionAssociated = computed$2(() => {
    return budgetStore.selectedBudget.transactions.filter(transaction => transaction.accountAssociated === props._id)
}); // Stocke la transaction sélectionnée pour l'association avec le compte
const showInput = computed$2(() => outcomes.value.length > 0);
//je calcul le total des outcomes associés en occultant les outcomes avec un checked à true (déjà pris en compte dans le calcul du solde du compte)
const totalRemaining = computed$2(() => {
    return transactionAssociated.value
        .filter(
            transaction =>
                transaction.checked !== true
        )

        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        )
        .toFixed(2)
});

const update = () => {     
    const transactionSelected = budgetStore.selectedBudget.transactions.find(transaction => transaction._id === selectedOutcome.value);
    const newAssociation = {
        ...transactionSelected,
        accountAssociated: props._id.toString()
    };
    budgetStore.updateTransaction(newAssociation);
    };
const updatingTitleCard = ref$3(false);
const newNameCard = ref$3(props.name);
const updateNameCard = () => {
    const accountToUpdate = accounts.value.find(account => account._id === props._id);
    const updatedAccount = {
        ...accountToUpdate,
        name: newNameCard.value
    };
    budgetStore.updateAccount(updatedAccount);
    updatingTitleCard.value = false;
};

const checkTransaction = (transactionId) => {
    const transactionToCheck = budgetStore.selectedBudget.transactions.find(transaction => transaction._id === transactionId);
    console.log("Transaction to check:", transactionToCheck, budgetStore.selectedBudget.transactions);
    const updatedTransaction = {
        ...transactionToCheck
    };
    //j'update les transactions dans le store pour que les transactions cochées soient prises en compte dans le calcul du solde du compte et que les transactions décochées soient à nouveau prises en compte dans le calcul du solde du compte
    console.log("Transaction checked:", updatedTransaction);
    budgetStore.updateTransaction(updatedTransaction);
};

const deleteTransaction = (transactionId) => {
    //je dissocie la transaction du compte en mettant son accountAssociated à null
    const transactionToDelete = budgetStore.selectedBudget.transactions.find(transaction => transaction._id === transactionId);
    const updatedTransaction = {
        ...transactionToDelete,
        accountAssociated: null
    };
    budgetStore.updateTransaction(updatedTransaction);
};
const deleteCard = () => {
    const accountToDelete = accounts.value.find(account => account._id === props._id);
    //je dissocie les transactions associées à ce compte en mettant leur accountAssociated à null
    const transactionsToUpdate = budgetStore.selectedBudget.transactions.filter(transaction => transaction.accountAssociated === props._id);
    transactionsToUpdate.forEach(transaction => {   
        const updatedTransaction = {
            ...transaction,
            accountAssociated: null
        };
        budgetStore.updateTransaction(updatedTransaction);
    });
    //j'affiche le pop-up de confirmation de suppression du compte
    budgetStore.nameToDelete = accountToDelete.name;
    budgetStore.IdToDelete = accountToDelete._id;
    budgetStore.showDeleteConfirmationAccount = true;
    console.log("Account to delete:", accountToDelete);
};

return (_ctx, _cache) => {
  return (_openBlock$4(), _createElementBlock$4("div", _hoisted_1$3, [
    _createElementVNode$4("div", _hoisted_2$3, [
      _createElementVNode$4("div", _hoisted_3$2, [
        (!updatingTitleCard.value)
          ? (_openBlock$4(), _createElementBlock$4("h5", _hoisted_4$2, _toDisplayString$2(_ctx.$props.name), 1))
          : _createCommentVNode$3("", true),
        (!updatingTitleCard.value)
          ? (_openBlock$4(), _createElementBlock$4("img", {
              key: 1,
              src: _unref$3(pencilDark),
              alt: "modifier le nom du compte",
              class: "icon",
              onClick: _cache[0] || (_cache[0] = $event => (updatingTitleCard.value = !updatingTitleCard.value))
            }, null, 8, _hoisted_5$2))
          : _createCommentVNode$3("", true),
        (updatingTitleCard.value)
          ? _withDirectives$2((_openBlock$4(), _createElementBlock$4("input", {
              key: 2,
              type: "text",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((newNameCard).value = $event)),
              onKeyup: _cache[2] || (_cache[2] = _withKeys$2($event => (updateNameCard()), ["enter"]))
            }, null, 544)), [
              [_vModelText$2, newNameCard.value]
            ])
          : _createCommentVNode$3("", true)
      ]),
      _createElementVNode$4("img", {
        class: "icon",
        src: _unref$3(trashDark),
        alt: "fermer",
        onClick: _cache[3] || (_cache[3] = $event => (deleteCard()))
      }, null, 8, _hoisted_6$2)
    ]),
    _createElementVNode$4("ul", _hoisted_7$2, [
      (_openBlock$4(true), _createElementBlock$4(_Fragment$2, null, _renderList$2(transactionAssociated.value, (value) => {
        return (_openBlock$4(), _createElementBlock$4("li", {
          key: value._id,
          class: "transcations-displayed"
        }, [
          _createElementVNode$4("p", _hoisted_8$1, [
            _createElementVNode$4("span", _hoisted_9$1, _toDisplayString$2(value.named), 1),
            _createElementVNode$4("span", _hoisted_10$1, _toDisplayString$2(value.amount) + " €", 1)
          ]),
          _withDirectives$2(_createElementVNode$4("input", {
            type: "checkbox",
            "onUpdate:modelValue": $event => ((value.checked) = $event),
            onChange: $event => (checkTransaction(value._id))
          }, null, 40, _hoisted_11$1), [
            [_vModelCheckbox, value.checked]
          ]),
          _createElementVNode$4("img", {
            src: _unref$3(xMark),
            alt: "supprimer la transaction",
            class: "remove-transactions-icon",
            onClick: $event => (deleteTransaction(value._id))
          }, null, 8, _hoisted_12$1)
        ]))
      }), 128))
    ]),
    (showInput.value)
      ? _withDirectives$2((_openBlock$4(), _createElementBlock$4("select", {
          key: 0,
          class: "select",
          name: "outcomes",
          id: "outcomes-select",
          "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((selectedOutcome).value = $event)),
          onChange: _cache[5] || (_cache[5] = $event => (update()))
        }, [
          _cache[6] || (_cache[6] = _createElementVNode$4("option", { value: "" }, "Choisie une option", -1)),
          (_openBlock$4(true), _createElementBlock$4(_Fragment$2, null, _renderList$2(outcomes.value, (outcome) => {
            return (_openBlock$4(), _createElementBlock$4("option", {
              key: outcome._id,
              value: outcome._id
            }, _toDisplayString$2(outcome.named), 9, _hoisted_13$1))
          }), 128))
        ], 544)), [
          [_vModelSelect$1, selectedOutcome.value]
        ])
      : _createCommentVNode$3("", true),
    _createElementVNode$4("div", _hoisted_14$1, [
      _createElementVNode$4("p", _hoisted_15$1, "Total à laisser sur le compte: " + _toDisplayString$2(totalRemaining.value) + " €", 1)
    ])
  ]))
}
}

};
const Card = /*#__PURE__*/_export_sfc(_sfc_main$3, [['__scopeId',"data-v-14850931"]]);

const {createElementVNode:_createElementVNode$3,unref:_unref$2,normalizeClass:_normalizeClass$1,vModelText:_vModelText$1,withKeys:_withKeys$1,withDirectives:_withDirectives$1,withModifiers:_withModifiers$2,renderList:_renderList$1,Fragment:_Fragment$1,openBlock:_openBlock$3,createElementBlock:_createElementBlock$3,createBlock:_createBlock$1,createCommentVNode:_createCommentVNode$2} = await importShared('vue');


const _hoisted_1$2 = ["src"];
const _hoisted_2$2 = { key: 0 };

const {computed: computed$1,ref: ref$2} = await importShared('vue');

const _sfc_main$2 = {
  __name: 'cards',
  setup(__props) {

const budgetStore = useBudgetStore();

const isOpen = ref$2(false);
const newAccountName = ref$2('');




const addAccount = () => {
  if (newAccountName.value.trim() !== '') {
    budgetStore.addAccount({ name: newAccountName.value }); // Appelle la fonction d'ajout de compte dans le store avec le nom du compte
    newAccountName.value = ''; // Réinitialise le champ de saisie après l'ajout
  }
 
};



return (_ctx, _cache) => {
  return (_openBlock$3(), _createElementBlock$3(_Fragment$1, null, [
    _createElementVNode$3("div", {
      class: "cards-title-box",
      onClick: _cache[0] || (_cache[0] = $event => (isOpen.value = !isOpen.value))
    }, [
      _cache[4] || (_cache[4] = _createElementVNode$3("h4", { class: "cards-title" }, "Mes comptes", -1)),
      _createElementVNode$3("img", {
        src: _unref$2(AngleDown),
        alt: "Voir plus",
        class: _normalizeClass$1(["angle-down", { rotated: isOpen.value }])
      }, null, 10, _hoisted_1$2)
    ]),
    (isOpen.value)
      ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_2$2, [
          _createElementVNode$3("form", {
            onSubmit: _cache[3] || (_cache[3] = _withModifiers$2($event => (addAccount()), ["prevent"]))
          }, [
            _cache[5] || (_cache[5] = _createElementVNode$3("p", { class: "text" }, "Visualisez plus simplement ce qu’il devrait vous rester sur chacun de vos comptes au fil du mois.", -1)),
            _withDirectives$1(_createElementVNode$3("input", {
              class: "new-account-input",
              type: "text",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((newAccountName).value = $event)),
              placeholder: "Ajouter un nom au compte à suivre",
              onKeyup: _cache[2] || (_cache[2] = _withKeys$1($event => (addAccount()), ["enter"]))
            }, null, 544), [
              [_vModelText$1, newAccountName.value]
            ])
          ], 32),
          _createElementVNode$3("ul", null, [
            (_openBlock$3(true), _createElementBlock$3(_Fragment$1, null, _renderList$1(_unref$2(budgetStore).selectedBudget.accounts, (account) => {
              return (_openBlock$3(), _createElementBlock$3("li", {
                key: account.name
              }, [
                (_openBlock$3(), _createBlock$1(Card, {
                  name: account.name,
                  _id: account._id,
                  key: account._id
                }, null, 8, ["name", "_id"]))
              ]))
            }), 128))
          ])
        ]))
      : _createCommentVNode$2("", true)
  ], 64))
}
}

};
const Cards = /*#__PURE__*/_export_sfc(_sfc_main$2, [['__scopeId',"data-v-d415610a"]]);

const {unref:_unref$1,createElementVNode:_createElementVNode$2,openBlock:_openBlock$2,createElementBlock:_createElementBlock$2,createCommentVNode:_createCommentVNode$1,toDisplayString:_toDisplayString$1,createVNode:_createVNode$2,createTextVNode:_createTextVNode$1,normalizeClass:_normalizeClass,renderList:_renderList,Fragment:_Fragment,createBlock:_createBlock,withKeys:_withKeys,vModelText:_vModelText,withDirectives:_withDirectives,vModelSelect:_vModelSelect,withModifiers:_withModifiers$1,createStaticVNode:_createStaticVNode} = await importShared('vue');


const _hoisted_1$1 = {
  key: 0,
  class: "back-arrow-box"
};
const _hoisted_2$1 = ["src"];
const _hoisted_3$1 = { class: "budget-results-title sweet-bleu" };
const _hoisted_4$1 = { class: "content-list" };
const _hoisted_5$1 = {
  key: 0,
  class: "sweet-bleu"
};
const _hoisted_6$1 = {
  key: 1,
  class: "content-list"
};
const _hoisted_7$1 = { class: "balance-box" };
const _hoisted_8 = { class: "entries-box balance-entries-box" };
const _hoisted_9 = { class: "balance-value sweet-bleu" };
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
const _hoisted_17 = ["src"];
const _hoisted_18 = { class: "incomes-box" };
const _hoisted_19 = { class: "entries-box" };
const _hoisted_20 = { class: "big-values" };
const _hoisted_21 = ["src"];
const _hoisted_22 = {
  key: 0,
  class: "entries-list"
};
const _hoisted_23 = ["src"];
const _hoisted_24 = { class: "incomes-box" };
const _hoisted_25 = { class: "incomes-box" };

const {computed,ref: ref$1,onMounted: onMounted$1,onUnmounted: onUnmounted$1} = await importShared('vue');


const _sfc_main$1 = {
  __name: 'BudgetResults',
  setup(__props) {

const { isMobile } = useIsMobile(); 
const budgetStore = useBudgetStore();
const transactions = computed(() => budgetStore.selectedBudget ? budgetStore.selectedBudget.transactions : []); // Computed pour obtenir les transactions du budget sélectionné (ou une liste vide si aucun budget n'est sélectionné)
const wallet = new URL("/appbudget-dist/assets/wallet-DnqqVq5N.png", import.meta.url).href; // Import de l'image de portefeuille (non utilisé dans ce code, mais peut être utilisé pour l'affichage du portefeuille)

onMounted$1(() => {
//pour la version mobile, on affiche les résultats de la liste sélectionnée seulement après le choix d'une liste dans la barre latérale
ref$1(false); // Variable réactive pour contrôler l'affichage des résultats de la liste (utilisée pour les mobiles)
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

//gestion des focus pour les entrées d'incomes
const nextInputCategory = ref$1(null);
const nextInputName = ref$1(null);

const focusNextIncomeName = () => {

  nextInputName.value.focus();

};
const focusNextIncomeCategory = () => {

  nextInputCategory.value.focus();

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

//gestion des focus pour les entrées d'outcomes
const nextInputOutcomeName = ref$1(null);
const nextInputOutcomeCategory = ref$1(null);

const focusNextOutcomeName = () => {
  nextInputOutcomeName.value.focus();
};

const focusNextOutcomeCategory = () => {
  nextInputOutcomeCategory.value.focus();
};

return (_ctx, _cache) => {
  return (_unref$1(isMobile) ? _unref$1(budgetStore).showBudgetResults  : _unref$1(isMobile) === false)
    ? (_openBlock$2(), _createElementBlock$2("div", {
        key: 0,
        class: _normalizeClass(_unref$1(isMobile) ? 'budget-results-mobile' : 'budget-results')
      }, [
        (_unref$1(isMobile))
          ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_1$1, [
              _createElementVNode$2("img", {
                src: _unref$1(arrowLeft),
                alt: "Retour",
                class: "back-arrow",
                onClick: _cache[0] || (_cache[0] = $event => (_unref$1(budgetStore).showBudgetResults = false))
              }, null, 8, _hoisted_2$1)
            ]))
          : _createCommentVNode$1("", true),
        _createElementVNode$2("h3", _hoisted_3$1, _toDisplayString$1(_unref$1(budgetStore).selectedBudget?.title || 'Aucun suivi sélectionné'), 1),
        _createVNode$2(StarBar),
        _createElementVNode$2("div", _hoisted_4$1, [
          (!_unref$1(budgetStore).selectedBudget)
            ? (_openBlock$2(), _createElementBlock$2("p", _hoisted_5$1, _cache[9] || (_cache[9] = [
                _createTextVNode$1("Faites un choix dans la barre latérale pour afficher ses résultats. "),
                _createElementVNode$2("br", null, null, -1),
                _createTextVNode$1("Ou créez un nouveau projet pour commencer à ajouter des éléments. "),
                _createElementVNode$2("br", null, null, -1),
                _createElementVNode$2("span", { class: "yellow-heart" }, "💛", -1)
              ])))
            : (_openBlock$2(), _createElementBlock$2("div", _hoisted_6$1, [
                _createElementVNode$2("div", _hoisted_7$1, [
                  _createElementVNode$2("div", _hoisted_8, [
                    _cache[10] || (_cache[10] = _createElementVNode$2("h4", { class: "balance-title" }, "Reste à vivre", -1)),
                    _cache[11] || (_cache[11] = _createElementVNode$2("p", { class: "balance-under-title" }, "disponible ce mois-ci", -1)),
                    _createElementVNode$2("p", _hoisted_9, _toDisplayString$1(balanceDisplay.value  + ' €'), 1)
                  ]),
                  _createElementVNode$2("div", _hoisted_10, [
                    _createElementVNode$2("img", {
                      src: _unref$1(wallet),
                      alt: "Portefeuille",
                      class: "wallet-icon"
                    }, null, 8, _hoisted_11)
                  ])
                ]),
                _createElementVNode$2("div", _hoisted_12, [
                  _createElementVNode$2("div", _hoisted_13, [
                    _cache[12] || (_cache[12] = _createElementVNode$2("h4", { class: "entries-title" }, "Revenus", -1)),
                    _createElementVNode$2("p", _hoisted_14, _toDisplayString$1('+ ' + incomesDisplay.value  + ' €'), 1)
                  ]),
                  _createElementVNode$2("button", {
                    class: "see-more-box",
                    onClick: _cache[1] || (_cache[1] = $event => (isOpen.value = !isOpen.value))
                  }, [
                    _cache[13] || (_cache[13] = _createElementVNode$2("p", { class: "see-more" }, "Ici ajoute toutes tes entrées d'argents", -1)),
                    _createElementVNode$2("img", {
                      src: _unref$1(AngleDown),
                      alt: "Voir plus",
                      class: _normalizeClass(["angle-down", { rotated: isOpen.value }])
                    }, null, 10, _hoisted_15)
                  ]),
                  (isOpen.value)
                    ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_16, [
                        _createElementVNode$2("ul", null, [
                          _cache[14] || (_cache[14] = _createStaticVNode("<div class=\"transactions-header\" data-v-41ba6a6b><p class=\"data-header\" data-v-41ba6a6b>Montant</p><p class=\"data-header\" data-v-41ba6a6b>Nom</p><p class=\"data-header\" data-v-41ba6a6b>Catégorie</p><div class=\"data-header-blank\" data-v-41ba6a6b></div></div>", 1)),
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
                                _id: item._id,
                                checked: item.checked
                              }, null, 8, ["amount", "named", "category", "_id", "checked"]))
                            ]))
                          }), 128))
                        ]),
                        _createElementVNode$2("form", {
                          class: "add-incomes",
                          onSubmit: _withModifiers$1(addIncome, ["prevent"])
                        }, [
                          _withDirectives(_createElementVNode$2("input", {
                            onKeyup: _withKeys(focusNextIncomeName, ["enter"]),
                            class: "data",
                            type: "number",
                            "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((amountIncomes).value = $event)),
                            name: "amount",
                            step: ".01"
                          }, null, 544), [
                            [_vModelText, amountIncomes.value]
                          ]),
                          _withDirectives(_createElementVNode$2("input", {
                            onKeyup: _withKeys(focusNextIncomeCategory, ["enter"]),
                            ref_key: "nextInputName",
                            ref: nextInputName,
                            class: "data",
                            type: "text",
                            "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((namedIncomes).value = $event)),
                            name: "name",
                            id: "name",
                            placeholder: "Nom"
                          }, null, 544), [
                            [_vModelText, namedIncomes.value]
                          ]),
                          _withDirectives(_createElementVNode$2("select", {
                            onKeyup: _withKeys(addIncome, ["enter"]),
                            class: "data",
                            "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((categoryIncomes).value = $event)),
                            ref_key: "nextInputCategory",
                            ref: nextInputCategory
                          }, _cache[15] || (_cache[15] = [
                            _createStaticVNode("<option value=\"salaire\" data-v-41ba6a6b>Salaire</option><option value=\"freelance\" data-v-41ba6a6b>Freelance</option><option value=\"entreprise\" data-v-41ba6a6b>Entreprise</option><option value=\"pension\" data-v-41ba6a6b>Pension</option><option value=\"allocations\" data-v-41ba6a6b>Allocations</option><option value=\"investissements\" data-v-41ba6a6b>Investissements</option><option value=\"autre\" data-v-41ba6a6b>Autre</option>", 7)
                          ]), 544), [
                            [_vModelSelect, categoryIncomes.value]
                          ]),
                          _createElementVNode$2("img", {
                            src: _unref$1(sendImg),
                            alt: "Envoyer",
                            class: "send-entry",
                            onClick: addIncome
                          }, null, 8, _hoisted_17)
                        ], 32)
                      ]))
                    : _createCommentVNode$1("", true)
                ]),
                _createElementVNode$2("div", _hoisted_18, [
                  _createElementVNode$2("div", _hoisted_19, [
                    _cache[16] || (_cache[16] = _createElementVNode$2("h4", { class: "outcomes-title" }, "Dépenses", -1)),
                    _createElementVNode$2("p", _hoisted_20, _toDisplayString$1('- ' + outcomesDisplay.value  + ' €'), 1)
                  ]),
                  _createElementVNode$2("button", {
                    class: "see-more-box",
                    onClick: _cache[5] || (_cache[5] = $event => (isOpenOutcomes.value = !isOpenOutcomes.value))
                  }, [
                    _cache[17] || (_cache[17] = _createElementVNode$2("p", { class: "see-more" }, "Ici ajoute toutes tes dépenses", -1)),
                    _createElementVNode$2("img", {
                      src: _unref$1(AngleDown),
                      alt: "Voir plus",
                      class: _normalizeClass(["angle-down-outcomes", { rotated: isOpenOutcomes.value }])
                    }, null, 10, _hoisted_21)
                  ]),
                  (isOpenOutcomes.value)
                    ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_22, [
                        _createElementVNode$2("ul", null, [
                          _cache[18] || (_cache[18] = _createStaticVNode("<div class=\"transactions-header-outcomes\" data-v-41ba6a6b><p class=\"data-header\" data-v-41ba6a6b>Montant</p><p class=\"data-header\" data-v-41ba6a6b>Nom</p><p class=\"data-header\" data-v-41ba6a6b>Catégorie</p><div class=\"data-header-blank\" data-v-41ba6a6b></div></div>", 1)),
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
                                _id: item._id,
                                checked: item.checked,
                                associatedAccount: item.accountAssociated
                              }, null, 8, ["amount", "named", "category", "_id", "checked", "associatedAccount"]))
                            ]))
                          }), 128))
                        ]),
                        _createElementVNode$2("form", {
                          class: "add-incomes",
                          onSubmit: _withModifiers$1(addOutcome, ["prevent"])
                        }, [
                          _withDirectives(_createElementVNode$2("input", {
                            onKeyup: _withKeys(focusNextOutcomeName, ["enter"]),
                            class: "data",
                            type: "number",
                            "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((amountOutcomes).value = $event)),
                            name: "amount",
                            step: ".01"
                          }, null, 544), [
                            [_vModelText, amountOutcomes.value]
                          ]),
                          _withDirectives(_createElementVNode$2("input", {
                            onKeyup: _withKeys(focusNextOutcomeCategory, ["enter"]),
                            ref_key: "nextInputOutcomeName",
                            ref: nextInputOutcomeName,
                            class: "data",
                            type: "text",
                            "onUpdate:modelValue": _cache[7] || (_cache[7] = $event => ((namedOutcomes).value = $event)),
                            name: "name",
                            placeholder: "Nom"
                          }, null, 544), [
                            [_vModelText, namedOutcomes.value]
                          ]),
                          _withDirectives(_createElementVNode$2("select", {
                            onKeyup: _withKeys(addOutcome, ["enter"]),
                            class: "data",
                            "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((categoryOutcomes).value = $event)),
                            ref_key: "nextInputOutcomeCategory",
                            ref: nextInputOutcomeCategory
                          }, _cache[19] || (_cache[19] = [
                            _createStaticVNode("<option value=\"assurance\" data-v-41ba6a6b>Assurance</option><option value=\"courses\" data-v-41ba6a6b>Courses</option><option value=\"credits\" data-v-41ba6a6b>Crédits</option><option value=\"divertissement\" data-v-41ba6a6b>Divertissement</option><option value=\"enfants\" data-v-41ba6a6b>Enfants</option><option value=\"impots\" data-v-41ba6a6b>Impôts</option><option value=\"internet\" data-v-41ba6a6b>Internet &amp; téléphonie</option><option value=\"logement\" data-v-41ba6a6b>Logement</option><option value=\"perso\" data-v-41ba6a6b>Perso</option><option value=\"pro\" data-v-41ba6a6b>Pro</option><option value=\"santé\" data-v-41ba6a6b>Santé</option><option value=\"transport\" data-v-41ba6a6b>Transport</option><option value=\"autre\" data-v-41ba6a6b>Autre</option>", 13)
                          ]), 544), [
                            [_vModelSelect, categoryOutcomes.value]
                          ]),
                          _createElementVNode$2("img", {
                            src: _unref$1(sendImg),
                            alt: "Envoyer",
                            class: "send-entry",
                            onClick: addOutcome
                          }, null, 8, _hoisted_23)
                        ], 32)
                      ]))
                    : _createCommentVNode$1("", true)
                ]),
                _createElementVNode$2("div", _hoisted_24, [
                  _createVNode$2(Analysis)
                ]),
                _createElementVNode$2("div", _hoisted_25, [
                  _createVNode$2(Cards)
                ])
              ]))
        ])
      ], 2))
    : _createCommentVNode$1("", true)
}
}

};
const BudgetResults = /*#__PURE__*/_export_sfc(_sfc_main$1, [['__scopeId',"data-v-41ba6a6b"]]);

const {createVNode:_createVNode$1,unref:_unref,createElementVNode:_createElementVNode$1,toDisplayString:_toDisplayString,createTextVNode:_createTextVNode,withModifiers:_withModifiers,openBlock:_openBlock$1,createElementBlock:_createElementBlock$1,createCommentVNode:_createCommentVNode} = await importShared('vue');


const _hoisted_1 = { class: "budget-view" };
const _hoisted_2 = { class: "to-delete-name" };
const _hoisted_3 = { class: "buttons" };
const _hoisted_4 = { class: "to-delete-name" };
const _hoisted_5 = { class: "buttons" };
const _hoisted_6 = { class: "to-delete-name" };
const _hoisted_7 = { class: "buttons" };

const {ref,onMounted,onUnmounted} = await importShared('vue');


const _sfc_main = {
  __name: 'BudgetView',
  setup(__props) {

const budgetStore = useBudgetStore(); // Utilisation du store pour accéder aux données et fonctions liées aux budgets
const goback = (event) => {
  if (event.target.classList.contains('background-deletion')) {
    budgetStore.showDeleteConfirmationBudget = false;
    budgetStore.showDeleteConfirmationTransaction = false;
    budgetStore.showDeleteConfirmationAccount = false;
  }
};

return (_ctx, _cache) => {
  return (_openBlock$1(), _createElementBlock$1("div", _hoisted_1, [
    _createVNode$1(sidebar),
    _createVNode$1(BudgetResults),
    (_unref(budgetStore).showDeleteConfirmationBudget || _unref(budgetStore).showDeleteConfirmationTransaction || _unref(budgetStore).showDeleteConfirmationAccount)
      ? (_openBlock$1(), _createElementBlock$1("div", {
          key: 0,
          class: "background-deletion",
          onClick: _cache[9] || (_cache[9] = $event => (goback($event)))
        }, [
          (_unref(budgetStore).showDeleteConfirmationBudget)
            ? (_openBlock$1(), _createElementBlock$1("div", {
                key: 0,
                class: "pop-up-delete",
                onClick: _cache[2] || (_cache[2] = _withModifiers(() => {}, ["stop"]))
              }, [
                _createElementVNode$1("p", null, [
                  _cache[10] || (_cache[10] = _createTextVNode("Supprimer ")),
                  _cache[11] || (_cache[11] = _createElementVNode$1("br", null, null, -1)),
                  _cache[12] || (_cache[12] = _createTextVNode()),
                  _createElementVNode$1("span", _hoisted_2, _toDisplayString(_unref(budgetStore).nameToDelete), 1),
                  _cache[13] || (_cache[13] = _createTextVNode(" ?"))
                ]),
                _createElementVNode$1("div", _hoisted_3, [
                  _createElementVNode$1("button", {
                    class: "danger-button",
                    onClick: _cache[0] || (_cache[0] = $event => ( _unref(budgetStore).deleteBudget(_unref(budgetStore).IdToDelete)))
                  }, "Oui"),
                  _createElementVNode$1("button", {
                    class: "cancel",
                    onClick: _cache[1] || (_cache[1] = $event => (_unref(budgetStore).showDeleteConfirmationBudget = false))
                  }, "Non")
                ])
              ]))
            : _createCommentVNode("", true),
          (_unref(budgetStore).showDeleteConfirmationTransaction)
            ? (_openBlock$1(), _createElementBlock$1("div", {
                key: 1,
                class: "pop-up-delete",
                onClick: _cache[5] || (_cache[5] = _withModifiers(() => {}, ["stop"]))
              }, [
                _createElementVNode$1("p", null, [
                  _cache[14] || (_cache[14] = _createTextVNode("Supprimer ")),
                  _cache[15] || (_cache[15] = _createElementVNode$1("br", null, null, -1)),
                  _cache[16] || (_cache[16] = _createTextVNode()),
                  _createElementVNode$1("span", _hoisted_4, _toDisplayString(_unref(budgetStore).nameToDelete), 1),
                  _cache[17] || (_cache[17] = _createTextVNode(" ?"))
                ]),
                _createElementVNode$1("div", _hoisted_5, [
                  _createElementVNode$1("button", {
                    class: "danger-button",
                    onClick: _cache[3] || (_cache[3] = $event => ( _unref(budgetStore).deleteTransaction(_unref(budgetStore).IdToDelete)))
                  }, "Oui"),
                  _createElementVNode$1("button", {
                    class: "cancel",
                    onClick: _cache[4] || (_cache[4] = $event => (_unref(budgetStore).showDeleteConfirmationTransaction = false))
                  }, "Non")
                ])
              ]))
            : _createCommentVNode("", true),
          (_unref(budgetStore).showDeleteConfirmationAccount)
            ? (_openBlock$1(), _createElementBlock$1("div", {
                key: 2,
                class: "pop-up-delete",
                onClick: _cache[8] || (_cache[8] = _withModifiers(() => {}, ["stop"]))
              }, [
                _createElementVNode$1("p", null, [
                  _cache[18] || (_cache[18] = _createTextVNode("Supprimer ")),
                  _cache[19] || (_cache[19] = _createElementVNode$1("br", null, null, -1)),
                  _cache[20] || (_cache[20] = _createTextVNode()),
                  _createElementVNode$1("span", _hoisted_6, _toDisplayString(_unref(budgetStore).nameToDelete), 1),
                  _cache[21] || (_cache[21] = _createTextVNode(" ?"))
                ]),
                _createElementVNode$1("div", _hoisted_7, [
                  _createElementVNode$1("button", {
                    class: "danger-button",
                    onClick: _cache[6] || (_cache[6] = $event => ( _unref(budgetStore).deleteAccount(_unref(budgetStore).IdToDelete)))
                  }, "Oui"),
                  _createElementVNode$1("button", {
                    class: "cancel",
                    onClick: _cache[7] || (_cache[7] = $event => (_unref(budgetStore).showDeleteConfirmationAccount = false))
                  }, "Non")
                ])
              ]))
            : _createCommentVNode("", true)
        ]))
      : _createCommentVNode("", true)
  ]))
}
}

};
const BudgetView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-393adec2"]]);

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
