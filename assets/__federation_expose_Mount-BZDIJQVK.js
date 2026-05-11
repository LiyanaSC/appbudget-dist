import { importShared } from './__federation_fn_import-BMMB1g9W.js';

const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};

const _sfc_main = {  };
const {createElementVNode:_createElementVNode$1,openBlock:_openBlock$1,createElementBlock:_createElementBlock$1} = await importShared('vue');


const _hoisted_1 = { class: "budget-view" };

function _sfc_render(_ctx, _cache) {
  return (_openBlock$1(), _createElementBlock$1("div", _hoisted_1, _cache[0] || (_cache[0] = [
    _createElementVNode$1("p", null, "am comin", -1)
  ])))
}
const BudgetView = /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render],['__scopeId',"data-v-9713fbf2"]]);

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
