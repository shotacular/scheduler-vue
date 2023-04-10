import Vue from 'vue';
// import Vuetify from 'vuetify/lib/framework';
import Vuetify from 'vuetify/lib';
// import ja from 'vuetify/lib/locale/ja';
import ja from 'vuetify/src/locale/ja';

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { ja },
    current: 'ja',
  },
  icons: {
    iconfont: 'md',
  },
});
