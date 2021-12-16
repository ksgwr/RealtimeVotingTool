<template>
    <span>
        <v-btn
          elevation="2"
          outlined
          :loading="modelValue == -2"
          :disabled="modelValue <= -2"
          color="success"
          @click="toggle"
          v-if="modelValue < 0">
            <v-icon left>mdi-pencil</v-icon>
            EDIT</v-btn>
        <v-btn
          elevation="2"
          outlined
          :loading="modelValue == 2"
          :disabled="modelValue >= 2"
          color="error"
          @click="toggle"
          v-else-if="modelValue > 0">
            <v-icon left>mdi-pencil</v-icon>
            EDIT DONE</v-btn>
    </span>
</template>

<script>
export default {
    name: 'EditButton',
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