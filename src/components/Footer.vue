<template>
  <v-footer v-if="signInUser" app class="pa-0">
    <v-bottom-navigation grow dark>
      <v-btn class="my-auto" height="56" @click="routerPush('/')">
        <span>home</span>
        <v-icon large>home</v-icon>
      </v-btn>
      <v-btn class="my-auto" height="56" @click="routerPush('/calendar/day')">
        <span>daily</span>
        <v-icon large>view_day</v-icon>
      </v-btn>
      <v-btn class="my-auto" height="56" @click="routerPush('/calendar/week')">
        <span>weekly</span>
        <v-icon large>view_week</v-icon>
      </v-btn>
      <v-btn class="my-auto" height="56" @click="routerPush('/calendar/month')">
        <span>monthly</span>
        <v-icon large>event_note</v-icon>
      </v-btn>
      <v-menu top open-on-hover offset-y>
        <template v-slot:activator="{ on }">
          <div :class="$style.profile" class="py-1 px-1 text-center" v-on="on">
            <v-avatar :color="signInUser.themeColor">
              <span class="white--text body-2" v-text="signInUser.nickname" />
            </v-avatar>
          </div>
        </template>
        <v-card>
          <v-list>
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              link
              @click="handleMethod(item.methodName)"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-card-actions>
            <v-btn block @click="signOut">サインアウト</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-bottom-navigation>
  </v-footer>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from '@vue/composition-api';
import { profileStore } from '@/store/profile';

export default defineComponent({
  setup(prop, context) {
    const router = context.root.$router;
    const state = reactive({
      // サブメニューアイテム
      items: [
        {
          title: 'プロフィール',
          icon: 'account_circle',
          methodName: 'profile',
        },
        {
          title: '共有する',
          icon: 'share',
          methodName: 'share',
        },
      ],
      signInUser: computed(() => {
        return profileStore.profile;
      }),
    });

    // メソッド名を指定してコンポーネントのメソッドを呼び出す
    const handleMethod = (methodName: string) => {
      eval(methodName)();
    };

    // 指定したパスに画面遷移する
    const routerPush = (path: string) => {
      router.push(
        path,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
      );
    };

    // プロフィール画面に遷移する
    const profile = () => {
      routerPush('/profile');
    };
    // 共有画面に遷移する
    const share = () => {
      routerPush('/share');
    };
    // サインアウトする
    const signOut = () => {
      profileStore.profile = null;
      routerPush('/sign-in');
    };

    return {
      ...toRefs(state),
      handleMethod,
      profile,
      share,
      signOut,
      routerPush,
    };
  },
});
</script>

<style lang="scss" module>
.profile {
  cursor: pointer;
  width: 168px;
}
</style>
