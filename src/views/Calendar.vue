<template>
  <v-row class="fill-height">
    <v-col class="pt-0">
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>chevron_left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>chevron_right</v-icon>
          </v-btn>
          <v-toolbar-title v-text="title" />
        </v-toolbar>
      </v-sheet>
      <v-sheet height="580">
        <!-- v-if="visible" -->
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="filteredEvents"
          :event-color="getEventColor"
          :now="today"
          :type="type"
          :day-format="formatDay"
          :month-format="formatMonth"
          event-more-text="他{0}件"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="startAddEvent"
          @change="updateRange"
        />
      </v-sheet>
      <v-sheet>
        <v-row align="center" justify="center">
          <v-switch
            v-for="(sharedUser, index) in sharedUsers"
            :key="index"
            v-model="sharedUser.display"
            class="ml-4 pt-0"
            :color="sharedUser.themeColor"
            :label="sharedUser.nickname"
            hide-details
          />
        </v-row>
      </v-sheet>
      <v-menu
        v-model="isOpenEventMenu"
        :close-on-content-click="false"
        :activator="menuActivatorElement"
        bottom
        max-width="350"
        min-width="350"
      >
        <v-card v-if="selectedEvent" color="grey lighten-4" flat>
          <v-toolbar :color="getEventColor(selectedEvent)" dark>
            <v-toolbar-title v-text="selectedEvent.name" />
            <v-spacer />
            <v-btn
              icon
              :disabled="isNotOwner(selectedEvent.userId)"
              @click.stop="startEditEvent"
            >
              <v-icon>edit</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <p class="mb-0" v-text="`開始： ${selectedEvent.start}`" />
            <p v-text="formatEndDateTime" />
            <p :class="$style.memo" v-text="selectedEvent.memo" />
          </v-card-text>
        </v-card>
      </v-menu>
      <v-dialog
        v-model="isOpenEventDialog"
        persistent
        max-width="600"
        open-on-hover
      >
        <v-card v-if="newEvent">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="newEvent.name" label="タイトル※" />
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-dialog
                        ref="startDatePickerDialog"
                        v-model="isOpenStartDatePicker"
                        :return-value.sync="startDate"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="startDate"
                            label="開始日※"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="startDate"
                          scrollable
                          :day-format="formatDayForDatePicker"
                        >
                          <v-spacer />
                          <v-btn
                            text
                            color="primary"
                            @click="closeStartDatePicker"
                          >
                            キャンセル
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.startDatePickerDialog.save(startDate)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-dialog
                        ref="startTimePickerDialog"
                        v-model="isOpenStartTimePicker"
                        :return-value.sync="startTime"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="startTime"
                            label="開始時刻※"
                            prepend-icon="access_time"
                            readonly
                            clearable
                            @click:clear="clearStartTime"
                            v-on="on"
                          />
                        </template>
                        <v-time-picker
                          v-if="isOpenStartTimePicker"
                          v-model="startTime"
                          full-width
                        >
                          <v-spacer />
                          <v-btn
                            text
                            color="primary"
                            @click="closeStartTimePicker"
                          >
                            キャンセル
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.startTimePickerDialog.save(startTime)"
                          >
                            OK
                          </v-btn>
                        </v-time-picker>
                      </v-dialog>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-dialog
                        ref="endDatePickerDialog"
                        v-model="isOpenEndDatePicker"
                        :return-value.sync="endDate"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="endDate"
                            label="終了日"
                            prepend-icon="event"
                            readonly
                            clearable
                            @click:clear="clearEndDate"
                            v-on="on"
                          />
                        </template>
                        <v-date-picker
                          v-model="endDate"
                          scrollable
                          :day-format="formatDayForDatePicker"
                        >
                          <v-spacer />
                          <v-btn
                            text
                            color="primary"
                            @click="closeEndDatePicker"
                          >
                            キャンセル
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.endDatePickerDialog.save(endDate)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-dialog
                        ref="endTimePickerDialog"
                        v-model="isOpenEndTimePicker"
                        :return-value.sync="endTime"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="endTime"
                            label="終了時刻"
                            prepend-icon="access_time"
                            readonly
                            :disabled="disabledEndTime"
                            clearable
                            @click:clear="clearEndTime"
                            v-on="on"
                          />
                        </template>
                        <v-time-picker
                          v-if="isOpenEndTimePicker"
                          v-model="endTime"
                          full-width
                        >
                          <v-spacer />
                          <v-btn
                            text
                            color="primary"
                            @click="closeEndTimePicker"
                          >
                            キャンセル
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.endTimePickerDialog.save(endTime)"
                          >
                            OK
                          </v-btn>
                        </v-time-picker>
                      </v-dialog>
                    </v-col>
                  </v-row>
                  <v-textarea
                    v-model="newEvent.memo"
                    rows="1"
                    auto-grow
                    label="メモ"
                  />
                  <v-switch
                    v-model="newEvent.shared"
                    label="共有"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-container>
            <small>※必須フィールドを示します</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="closeEventDialog">
              キャンセル
            </v-btn>
            <v-btn color="blue darken-1" text @click="save">
              保存する
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  nextTick,
  toRefs,
  onUpdated,
} from '@vue/composition-api';
import {
  parseDate,
  parseTimestamp,
} from 'vuetify/lib/components/VCalendar/util/timestamp';
import { calendarEventStore, add, update } from '@/store/calendar-event';
import { sharedUserStore, getThemeColor } from '@/store/shared-user';
import { profileStore } from '@/store/profile';
import { CalendarTimestamp, CalendarEvent } from 'vuetify';
import {
  CalendarEventDetail,
  NewCalendarEvent,
} from '@/store/calendar-event.model';

interface VCalendar {
  scrollToTime(time: string): void;
  prev(): void;
  next(): void;
}

export default defineComponent({
  props: {
    type: {
      type: String,
      required: true,
      validator: (value: string) => {
        return ['month', 'week', 'day'].includes(value);
      },
    },
  },
  setup(props, context) {
    const router = context.root.$router;
    const state = reactive({
      calendar: null as VCalendar | null,
      start: null as CalendarTimestamp | null,
      end: null as CalendarTimestamp | null,
      visible: true,
      // カレンダー上でフォーカスする日付
      focus: '',
      today: parseDate(new Date()).date,
      // カレンダーを共有しているユーザー
      sharedUsers: sharedUserStore.sharedUsers,
      isOpenEventMenu: false,
      menuActivatorElement: null as HTMLElement | null,
      selectedEvent: null as CalendarEvent | null,
      isOpenEventDialog: false,
      newEvent: null as NewCalendarEvent | null,
      isOpenStartDatePicker: false,
      startDate: null as string | null,
      isOpenStartTimePicker: false,
      startTime: null as string | null,
      isOpenEndDatePicker: false,
      endDate: null as string | null,
      isOpenEndTimePicker: false,
      endTime: null as string | null,
      // カレンダー上部に表示する日付
      title: computed((): string => {
        if (!state.start || !state.end) {
          return '';
        }
        if (props.type === 'week') {
          return state.start.month === state.end.month
            ? `${state.start.year}年${state.start.month}月`
            : `${state.start.year}年${state.start.month}月～${state.end.month}月`;
        }
        return `${state.start.year}年${state.start.month}月`;
      }),
      // カレンダーに表示するイベント
      filteredEvents: computed((): CalendarEventDetail[] => {
        const displayUserIds = state.sharedUsers
          .filter(user => user.display)
          .map(user => user.userId);

        return calendarEventStore.calendarEvents.filter(event =>
          displayUserIds.includes(event.userId),
        );
      }),
      // 終了時刻を表示用にフォーマット
      formatEndDateTime: computed((): string => {
        return !state.selectedEvent || !state.selectedEvent.end
          ? ''
          : `終了： ${state.selectedEvent.end}`;
      }),
      // イベント終了時刻の入力可否
      disabledEndTime: computed((): boolean => {
        return !state.endDate || !state.startTime;
      }),
    });
    //  ライフサイクルフック
    onUpdated(() => {
      if (props.type === 'month') {
        return;
      }
      nextTick(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        state.calendar!.scrollToTime('07:00');
      });
    });
    const methods = {
      // カレンダーを本日の日付に移動する
      setToday: () => {
        state.focus = state.today;
      },
      prev: () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        state.calendar!.prev();
      },
      next: () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        state.calendar!.next();
      },
      getEventColor: (event: CalendarEvent) => {
        if (!event) {
          return;
        }
        return getThemeColor(event.userId);
      },
      formatDay: (timestamp: CalendarTimestamp) => {
        return new Date(timestamp.date).getDate();
      },
      formatMonth: (timestamp: CalendarTimestamp) => {
        return `${new Date(timestamp.date).getMonth() + 1} /`;
      },
      // イベント詳細を表示する
      showEvent: ({
        nativeEvent,
        event,
      }: {
        nativeEvent: Event;
        event: CalendarEvent;
      }) => {
        const open = () => {
          state.selectedEvent = event;
          state.menuActivatorElement = nativeEvent.target as HTMLInputElement;
          // 遅延させないとメニューを正しく表示できない
          setTimeout(() => {
            state.isOpenEventMenu = true;
          }, 10);
        };
        if (state.isOpenEventMenu) {
          state.isOpenEventMenu = false;
          setTimeout(open, 10);
        } else {
          open();
        }
        // クリックイベントの伝搬を抑止する
        nativeEvent.stopPropagation();
      },
      viewDay: ({ date }: { date: string }) => {
        state.focus = date;
        router.push('/calendar/day');
      },
      // イベントの新規登録を開始する
      startAddEvent: ({ date }: { date: string }) => {
        state.newEvent = {
          id: null,
          userId: null,
          name: null,
          start: date,
          end: null,
          memo: null,
          shared: true,
        };
        state.startDate = parseTimestamp(state.newEvent.start).date;
        state.isOpenEventDialog = true;
        // クリックイベントの伝搬を抑止する
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        event!.stopPropagation();
      },
      updateRange: ({
        start,
        end,
      }: {
        start: CalendarTimestamp;
        end: CalendarTimestamp;
      }) => {
        state.start = start;
        state.end = end;
      },
      isNotOwner: (userId: string) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return userId !== profileStore.profile!.userId;
      },
      // イベントの編集を開始する
      startEditEvent: () => {
        if (!state.selectedEvent) {
          return;
        }
        const startTimestamp = parseTimestamp(state.selectedEvent.start);
        state.startDate = startTimestamp.date;
        state.startTime = startTimestamp.time;
        if (state.selectedEvent.end) {
          const endTimestamp = parseTimestamp(state.selectedEvent.end);
          state.endDate = endTimestamp.date;
          state.endTime = endTimestamp.time;
        }
        state.newEvent = { ...state.selectedEvent } as NewCalendarEvent;
        state.isOpenEventMenu = false;
        state.isOpenEventDialog = true;
      },
      // イベント日付選択ダイアログに表示する日付のフォーマット
      formatDayForDatePicker: (date: string) => {
        return new Date(date).getDate();
      },
      closeStartDatePicker: () => {
        state.isOpenStartDatePicker = false;
      },
      clearPickerBindValue: () => {
        state.startDate = null;
        state.startTime = null;
        state.endDate = null;
        state.endTime = null;
      },
      // カレンダーを再描画する
      refresh: () => {
        state.visible = false;
        nextTick(() => {
          state.visible = true;
        });
      },
      // イベントの変更内容を保存する
      save: () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const newEvent = state.newEvent!;
        newEvent.start = !state.startTime
          ? `${state.startDate}`
          : `${state.startDate} ${state.startTime}`;
        if (state.endDate) {
          newEvent.end = !state.endTime
            ? `${state.endDate}`
            : `${state.endDate} ${state.endTime}`;
        }
        if (!newEvent.id) {
          add(newEvent);
        } else {
          update(newEvent);
        }
        methods.clearPickerBindValue();
        state.isOpenEventDialog = false;
        methods.refresh();
      },
      // イベント開始時刻の値をクリアする
      clearStartTime: () => {
        state.startTime = null;
        state.endTime = null;
      },
      closeStartTimePicker: () => {
        state.isOpenStartTimePicker = false;
      },
      clearEndDate: () => {
        state.endDate = null;
        state.endTime = null;
      },
      closeEndDatePicker: () => {
        state.isOpenEndDatePicker = false;
      },
      clearEndTime: () => {
        state.endTime = null;
      },
      closeEndTimePicker: () => {
        state.isOpenEndTimePicker = false;
      },
      closeEventDialog: () => {
        methods.clearPickerBindValue();
        state.isOpenEventDialog = false;
      },
    };
    return {
      ...toRefs(state),
      ...methods,
    };
  },
});
</script>

<style lang="scss" module>
.memo {
  white-space: pre-wrap;
}
</style>
