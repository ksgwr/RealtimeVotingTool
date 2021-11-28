<template>
    <span>
        <v-btn
          elevation="5"
          outlined
          :loading="modelValue == -2"
          :disabled="modelValue == -2"
          color="primary"
          @click="toggle"
          v-if="modelValue < 0">
            READY</v-btn>
        <v-btn
          elevation="5"
          outlined
          :loading="modelValue == 2"
          :disabled="modelValue == 2"
          color="primary"
          @click="toggle"
          v-else-if="modelValue > 0">
            NOT READY</v-btn>
    </span>
</template>

<script>
export default {
    name: 'VoteButton',
    props: {
        modelValue: Number
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