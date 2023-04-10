import '@/plugins/composition-api';
import { reactive } from '@vue/composition-api';
import { Profile } from '@/store/profile.model';
import { update } from '@/store/shared-user';
import axios from 'axios';

// export const profileMockData: Profile = {
//   userId: '66006d29-727e-4ed8-a3c8-95d4438f66d4',
//   userName: 'shota',
//   nickname: '翔太',
//   themeColor: '#4caf50',
//   hasAvatar: false,
//   mailAddress: 'shota@example.com',
// };

export const profileStore = reactive({ profile: null as Profile | null });

// ユーザ名を更新する
export const updateUserNameAsync = async (userName: string) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const profile = profileStore.profile!;
  const data = { userName: userName };

  // eslint-disable-next-line no-useless-catch
  try {
    await axios.patch('profile', data);
    profile.userName = userName;
    update(profile);
  } catch (error) {
    throw error;
  }
};

// ニックネームを更新する
export const updateNickname = (nickname: string) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  profileStore.profile!.nickname = nickname;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  update(profileStore.profile!);
};

// テーマカラーを更新する
export const updateThemeColor = (themeColor: string) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  profileStore.profile!.themeColor = themeColor;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  update(profileStore.profile!);
};

// サインインする
export const signInAsync = async () => {
  // ここに外部認証などの実装が必要

  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.get<Profile>('profile');
    profileStore.profile = response.data;
  } catch (error) {
    throw error;
  }
};
