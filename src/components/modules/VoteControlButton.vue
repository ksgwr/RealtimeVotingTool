<template>
    <span>
        <v-btn
          elevation="2"
          outlined
          :loading="voteStart == -2"
          :disabled="voteStart <= -2"
          color="primary"
          @click="toggleVoteStart"
          v-if="voteStart < 0">
            START VOTE</v-btn>
        <v-btn
          elevation="2"
          outlined
          :loading="voteStart == 2"
          :disabled="voteStart >= 2"
          color="error"
          @click="toggleVoteStart"
          v-else-if="voteStart > 0">
            CANCEL VOTE</v-btn>
        <v-btn
          elevation="2"
          outlined
          :loading="openResults == -2"
          :disabled="openResults <= -2"
          color="error"
          @click="toggleOpenResults"
          v-else>
            OPEN RESULTS</v-btn>
    </span>
</template>

<script>
export default {
    name: 'VoteControlButton',
    props: {
        voteStart: Number,
        openResults : Number
    },
    emits: [
        'update:voteStart',
        'update:openResults'
    ],
    methods: {
        toggleVoteStart() {
            this.$emit('update:voteStart', this.voteStart * 2);
        },
        toggleOpenResults() {
            this.$emit('update:openResults', this.openResults * 2);
        }
    }
}
</script>