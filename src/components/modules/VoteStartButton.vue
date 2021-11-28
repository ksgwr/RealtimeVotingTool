<template>
    <span>
        <v-btn
          elevation="2"
          outlined
          :loading="modelValue == -2"
          :disabled="modelValue == -2"
          color="primary"
          @click="toggle"
          v-if="modelValue < 0">
            START VOTE</v-btn>
        <v-btn
          elevation="2"
          outlined
          :loading="modelValue == 2"
          :disabled="modelValue == 2"
          color="error"
          @click="toggle"
          v-else-if="items.length > 0">
            CANCEL VOTE</v-btn>
        <v-btn
          elevation="2"
          outlined
          :loading="modelValue == 0"
          :disabled="modelValue == 0"
          color="error"
          @click="toggle"
          v-else>
            OPEN RESULTS</v-btn>
    </span>
</template>

<script>
export default {
    name: 'VoteStartButton',
    props: {
        modelValue: Number,
        edit: Number,
        items : Array
    },
    emits: [
        'update:modelValue'
    ],
    methods: {
        toggle() {
            this.$emit('update:modelValue', this.modelValue * 2);
        }
    }
}
</script>