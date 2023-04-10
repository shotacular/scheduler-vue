<template>
  <v-row align="center" justify="center">
    <v-col cols="12" md="4" class="text-center">
      <p class="display-1 py-12">
        プロフィール
      </p>
      <v-row>
        <v-col cols="12" md="4">
          <v-avatar :color="profile.themeColor" size="72">
            <span class="white--text body-2" v-text="profile.nickname" />
          </v-avatar>
        </v-col>
        <v-col>
          <v-file-input
            accept="image/png, image/jpeg, image/bmp"
            placeholder="画像を選択してください"
            prepend-icon="photo_camera"
            label="アバター"
            :error-count="Number.MAX_VALUE"
            :error-messages="avatarErrors"
            @change="saveFileContent"
          />
        </v-col>
      </v-row>
      <label class="v-label theme--light">テーマカラー※</label>
      <v-color-picker
        v-model="newThemeColor"
        class="mx-auto mb-4 mt-2"
        hide-canvas
        show-swatches
        swatches-max-height="120px"
      />
      <v-btn small rounded color="primary" @click="saveThemeColor">
        テーマカラーを決定する
      </v-btn>
      <v-text-field
        v-model="profile.userName"
        readonly
        label="ユーザー名※"
        append-outer-icon="edit"
        class="mt-4"
        @click:append-outer.stop="editUserName"
      />
      <v-dialog
        v-model="isOpenEditUserNameDialog"
        max-width="600"
        open-on-hover
      >
        <v-card>
          <ValidationObserver v-slot="{ invalid }">
            <ValidationProvider
              v-slot="{ errors }"
              name="ユーザ名"
              :rules="validationRules.userName"
            >
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-text-field
                      v-model="newUserName"
                      label="ユーザー名※"
                      :error-count="Number.MAX_VALUE"
                      :error-messages="errors"
                    />
                  </v-row>
                </v-container>
              </v-card-text>
            </ValidationProvider>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="blue darken-1"
                text
                @click="closeEditUserNameDialog"
              >
                キャンセル
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                :disabled="invalid"
                @click="saveUserName"
              >
                保存する
              </v-btn>
            </v-card-actions>
          </ValidationObserver>
        </v-card>
      </v-dialog>
      <v-text-field
        v-model="profile.nickname"
        readonly
        label="ニックネーム※"
        append-outer-icon="edit"
        class="mt-4"
        @click:append-outer.stop="editNickname"
      />
      <v-dialog
        v-model="isOpenEditNicknameDialog"
        max-width="600"
        open-on-hover
      >
        <v-card>
          <ValidationObserver v-slot="{ invalid }">
            <ValidationProvider
              v-slot="{ errors }"
              name="ニックネーム"
              :rules="validationRules.nickname"
            >
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-text-field
                      v-model="newNickname"
                      label="ニックネーム※"
                      :error-count="Number.MAX_VALUE"
                      :error-messages="errors"
                    />
                  </v-row>
                </v-container>
              </v-card-text>
            </ValidationProvider>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="blue darken-1"
                text
                @click="closeEditNicknameDialog"
              >
                キャンセル
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                :disabled="invalid"
                @click="saveNickname"
              >
                保存する
              </v-btn>
            </v-card-actions>
          </ValidationObserver>
        </v-card>
      </v-dialog>
      <v-text-field
        v-model="profile.mailAddress"
        readonly
        label="メールアドレス"
      />
      <small class="float-left">※必須フィールドを示します</small>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
} from '@vue/composition-api';
import {
  profileStore,
  updateThemeColor,
  updateUserNameAsync,
  updateNickname,
} from '@/store/profile';
import { ValidationObserver, ValidationProvider, validate } from 'vee-validate';

export default defineComponent({
  setup(prop, context) {
    const router = context.root.$router;
    const state = reactive({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      profile: profileStore.profile!,
      newUserName: null as string | null,
      newNickname: null as string | null,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      newThemeColor: profileStore.profile!.themeColor,
      isOpenEditUserNameDialog: false,
      isOpenEditNicknameDialog: false,
      avatarErrors: null as string[] | null,
      validationRules: computed(() => {
        return {
          nickname: {
            required: true,
            max: 15,
          },
          userName: {
            required: true,
            userNameAllowedCharacters: true,
            max: 15,
          },
          avatar: {
            ext: ['png', 'jpeg', 'bmp'],
            size: 300,
          },
        };
      }),
    });
    // アバターの画像ファイルを保存する
    const saveFileContent = (file: File) => {
      state.avatarErrors = null;
      if (!file) {
        return;
      }
      validate(file, state.validationRules.avatar, {
        name: 'アバター',
      }).then(result => {
        if (!result.valid) {
          state.avatarErrors = result.errors;
          return;
        }
      });
    };
    const saveThemeColor = () => {
      updateThemeColor(state.newThemeColor);
    };
    const editUserName = () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      state.newUserName = state.profile!.userName;
      state.isOpenEditUserNameDialog = true;
    };
    const closeEditUserNameDialog = () => {
      state.isOpenEditUserNameDialog = false;
    };
    // ユーザー名を保存する
    const saveUserName = async () => {
      try {
        if (state.newUserName) {
          await updateUserNameAsync(state.newUserName);
        }
        state.isOpenEditUserNameDialog = false;
      } catch (error) {
        console.log('error: ', error.response?.data?.title);
      }
    };
    const editNickname = () => {
      state.newNickname = state.profile.nickname;
      state.isOpenEditNicknameDialog = true;
    };
    const closeEditNicknameDialog = () => {
      state.isOpenEditNicknameDialog = false;
    };
    const saveNickname = () => {
      if (state.newNickname) {
        updateNickname(state.newNickname);
      }
      state.isOpenEditNicknameDialog = false;
    };
    return {
      ...toRefs(state),
      saveFileContent,
      saveThemeColor,
      editUserName,
      closeEditUserNameDialog,
      saveUserName,
      editNickname,
      closeEditNicknameDialog,
      saveNickname,
    };
  },
  components: { ValidationObserver, ValidationProvider },
});
</script>
