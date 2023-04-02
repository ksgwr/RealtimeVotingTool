<template>
  
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Results History
        </v-card-title>
        <Result :id="id" :history="history" />

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="close()"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import Result from '@/components/pages/Result.vue'

export default {
  name: 'RoomResults',
  props: ['id', 'history'],
  components: {
    Result
  },
  data () {
      return {
          dialog: true,
      }
  },
  methods: {
    close () {
      this.$router.push(`/room/${this.id}`);
    }
  }
}
</script>

<style lang="scss">
</style>