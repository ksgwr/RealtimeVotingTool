<template>
  <Vote :id="id"/>
</template>

<script>
// @ is an alias to /src
import Vote from '@/components/pages/Vote.vue'

export default {
  name: 'Room',
  props: ['id', 'history'],
  components: {
    Vote
  }
}
</script>
