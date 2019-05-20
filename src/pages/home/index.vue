<template>
    <div>
        <!-- <auth-home /> -->
        <template v-if="showType<0">
            <unauth-home />
        </template>
        <template v-else>
            <auth-home />
        </template>
    </div>
</template>

<script>

import api from '@/api/';
import { mapState } from 'vuex';
import { isNull, isEmpty } from 'lodash';
import localDb from '@/utils/localDb';
import UnAuthHome from './components/unAuthHome';
import AuthHome from './components/authHome';

export default {
    components: {
        'unauth-home': UnAuthHome,
        'auth-home': AuthHome
    },
    data(){
        return{
            showType: ''
        }
    },
    watch:{
        homeType(newVal){
            if(isEmpty(localDb.get('usInfo').permCodes)){
                this.showType = -1;
            }else{
                this.showType = localDb.get('usInfo').permCodes.indexOf('board_enter');
            }
        }
    },
    created(){
        if(isEmpty(localDb.get('usInfo').permCodes)){
                this.showType = -1;
        }else{
            this.showType = localDb.get('usInfo').permCodes.indexOf('board_enter');
        }
    },
    computed: mapState({
        userInfo: state => state.home.userInfo,
        homeType: state => state.home.homeType
    }),
}
</script>

<style lang="scss">
</style>
