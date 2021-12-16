<template>
    <span>
        <v-btn
          elevation="2"
          outlined
          fab
          :loading="Math.abs(modelValue) != 0"
          :disabled="Math.abs(modelValue) != 0"
          @click="clickDelete"
          >
            <v-icon dark>mdi-minus</v-icon>
        </v-btn>
        <v-btn
          elevation="2"
          outlined
          fab
          :loading="Math.abs(modelValue) != 0"
          :disabled="Math.abs(modelValue) != 0"
          @click="clickAdd"
          >
            <v-icon dark>mdi-plus</v-icon>
            </v-btn>
    </span>
</template>

<script>
export default {
    name: 'CardControlButtons',
    props: {
        modelValue: Number
    },
    emits: [
        'update:modelValue'
    ],
    methods: {
        clickDelete() {
            this.$emit('update:modelValue', -1);
        },
        clickAdd() {
            this.$emit('update:modelValue', 1);
        }
    }
}
</script>