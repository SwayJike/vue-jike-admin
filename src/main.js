import Vue from 'vue';
import App from './App';
import router from './router';
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'font-awesome/css/font-awesome.min.css';

Vue.config.productionTip = false;
Vue.use(ElementUI,{
  // size: 'small',
  zIndex: 3000
});

/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
