<template>
<div id="container">
  <h2 id="logo">
    RealTimeVotingTool
  </h2>
  <span id="user-icon">
    <UserIcon :user="{userId: openUserId, name: name}" :nameView="true" />
  </span>
</div>
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
        name: undefined
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