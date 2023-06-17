<template>
<div id="container">
  <h2 id="logo">
    RealTimeVotingTool
  </h2>
  <span id="user-icon" @click="dialog = true">
    <UserIcon :user="{userId: openUserId, name: name, anonymous: anonymous}" :nameView="true" />
  </span>
</div>
<v-dialog
      v-model="dialog"
      width="300px"
>
  <v-card>
    <v-card-text>
      <v-layout row align-center>
        <UserIcon :user="{userId: openUserId, name: name}" iconSize="5em" />
        <v-text-field v-model="name" label="Name"></v-text-field>
      </v-layout>
      <v-layout row justify-end>
        <v-checkbox v-model="anonymous" label="Anonymous Mode"></v-checkbox>
      </v-layout>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" block @click="dialog = false">Close</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
import UserIcon from '@/components/modules/UserIcon.vue';

export default {
    name: 'PageHeader',
    components: {
      UserIcon
    },
    data() {
      return {
        userId : '',
        openUserId : '',
        name : undefined,
        anonymous: false,
        dialog : false,
        update : false
      }
    },
    mounted() {
      if (localStorage.uid) {
        this.userId = localStorage.uid;
      } else {
        this.axios.post('/issueUserId')
          .then((res) => {
            localStorage.uid = res.data;
            this.userId = res.data;
          })
      }
      if (localStorage.name && localStorage.name != "") {
        this.name = localStorage.name;
      }
      if (localStorage.anon) {
        this.anonymous = JSON.parse(localStorage.anon);
      } else {
        localStorage.anon = this.anonymous;
      }
      this.update = false;
    },
    watch: {
      $route(to) {
        const url = to.path;
        if (!url.match("/room/")) {
          this.openUserId = '';
          return;
        }
        const lastIndex = url.match("/results/[0-9]+") ? url.lastIndexOf("/results/") : url.length;
        const roomId = url.substring(url.lastIndexOf("/room/")+6, lastIndex);

        this.axios.post('/roomUserId', {
          roomId : roomId,
          userId : this.userId
        }).then((res) => {
          this.openUserId = res.data;
        });
      },
      name(newName) {
        if (localStorage.name != newName) {
          localStorage.name = newName;
          this.update = true;
        }
      },
      anonymous(newAnon) {
        if (localStorage.name != new Boolean(newAnon).toString()) {
          localStorage.anon = newAnon;
          this.update = true;
        }
      },
      dialog(newDialog) {
        if (this.update && !newDialog) {
          const url = this.$route.path
          if (!url.match("/room/")) {
            return;
          }
          this.update = false;
          this.$router.go({path: this.$router.currentRoute.path, force: true});
        }
      }
    }
}
</script>

<style scoped>
#container {
  position: relative;
  margin-bottom: 20px;
}

#logo {
  margin-left: 20px;
  margin-bottom: 0;
  text-align: left;
}

#user-icon {
  position: absolute;
  right: 0;
  bottom: 0;
  margin-right: 20px;
}
</style>