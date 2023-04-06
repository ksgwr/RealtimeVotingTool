<template>
    <v-avatar>
    <v-icon :color="getColor()" size="x-large">
        mdi-account-circle
    </v-icon>
    <v-tooltip
            activator="parent"
            location="bottom"
            v-if="tooltip"
        >
        <span v-if="user.name == undefined">
            Anonymous
        </span>
        <span v-else>
            {{user.name}}
        </span>
    </v-tooltip>
    </v-avatar>
    <span v-if="nameView && user.name == undefined">
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
        }
    },
    methods: {
        getColor() {
            return AppUtil.getUserColor(this.user.userId);
        }
    }
}
</script>
