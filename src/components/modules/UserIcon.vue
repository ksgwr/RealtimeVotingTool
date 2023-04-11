<template>
    <v-avatar :size="iconSize">
    <v-icon :color="getColor()" :size="iconSize">
        mdi-account-circle
    </v-icon>
    <v-tooltip
            activator="parent"
            location="bottom"
            v-if="tooltip"
        >
        <span v-if="user.name == undefined || user.anonymous">
            Anonymous
        </span>
        <span v-else>
            {{user.name}}
        </span>
    </v-tooltip>
    </v-avatar>
    <span v-if="nameView && (user.name == undefined || user.anonymous)">
        Anonymous
    </span>
    <span v-else-if="nameView">
        {{user.name}}
    </span>
</template>

<script>
import AppUtil from '@/libs/AppUtil.js';

export default {
    props: {
        user: Object,
        tooltip : {
            type : Boolean,
            required: false,
            default: false
        },
        nameView : {
            type: Boolean,
            required: false,
            default: false
        },
        iconSize : {
            type: String,
            required: false,
            default: 'x-large'
        }
    },
    methods: {
        getColor() {
            return AppUtil.getUserColor(this.user.userId);
        }
    }
}
</script>
