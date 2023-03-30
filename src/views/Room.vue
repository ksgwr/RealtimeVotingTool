<template>
  Room
  <Vote />
</template>

<script>
// @ is an alias to /src
import Vote from '@/components/pages/Vote.vue'

export default {
  name: 'Room',
  props: ['id', 'history'], // dummy props
  components: {
    Vote
  }
}
</script>
