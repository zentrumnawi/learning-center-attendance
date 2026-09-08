<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    v-model:return-value="time"
    lazy
    transition="scale-transition"
    offset-y
    :max-width="290"
    :disabled="disabled"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
        v-model="time"
        v-bind="props"
        :label="label"
        readonly
        prepend-icon="mdi-timelapse"
      ></v-text-field>
    </template>

    <v-time-picker
      v-if="menu"
      no-title
      v-model="time"
      format="24hr"
      @click:minute="$refs.menu.save(time)"
      :min="min"
      :max="max"
    ></v-time-picker>
  </v-menu>
</template>

<script>
import { format } from "date-fns";

export default {
  name: "TimeInput",
  data: () => ({
    menu: false,
  }),
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: null,
    },
    min: {
      type: String,
      default: "08:00",
    },
    max: {
      type: String,
      default: null,
    },
    rules: {
      type: Array,
      default: null,
    },
    modelValue: {
      type: Date,
      required: true,
    },
  },
  computed: {
    time: {
      get() {
        return format(this.modelValue, "HH:mm");
      },
      set(val) {
        const [year, month, day] = format(this.modelValue, "yyyy-MM-dd").split(
          "-",
        );
        const [hours, minutes] = val.split(":");
        const date = new Date(year, month - 1, day, hours, minutes);
        this.$emit("update:modelValue", date);
      },
    },
  },
};
</script>
