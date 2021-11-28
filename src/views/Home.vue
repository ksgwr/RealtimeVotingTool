<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-text-field
            label="RoomID"
            v-model="roomId"
          ></v-text-field>
        </v-col>

        <v-btn
          class="mr-4"
          @click="submit">
          Open
          </v-btn>
        
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        roomId: 'abc'
      }
    },
    methods: {
      submit() {
        this.$router.push("/room/"+this.roomId);
      }
    }
  }
</script>

<style scoped>

</style>