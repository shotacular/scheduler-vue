<template>
  <v-row align="center" justify="center">
    <v-col cols="12" md="6" class="text-center">
      <p class="display-1 py-12">
        Schedulingアプリにサインインする
      </p>
      <div>
        <v-btn
          width="300"
          large
          color="#1DA1F2"
          class="white--text text-none"
          @click="signIn"
        >
          Sign in with Google
        </v-btn>
      </div>
      <div class="mt-3">
        <v-btn
          width="300"
          large
          color="#DD2A7B"
          class="white--text text-none"
          @click="signIn"
        >
          Sign in with Facebook
        </v-btn>
      </div>
      <div class="mt-3">
        <v-btn
          width="300"
          large
          color="#3B5998"
          class="white--text text-none"
          @click="signIn"
        >
          Sign in with Twitter
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { signInAsync } from '@/store/profile';

export default defineComponent({
  setup(prop, context) {
    const router = context.root.$router;
    const signIn = async () => {
      try {
        await signInAsync();
        router.push('/');
      } catch (error) {
        console.log('error: ', error);
      }
    };

    return {
      signIn,
    };
  },
});
</script>
