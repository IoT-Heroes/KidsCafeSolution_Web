<template>
    <md-table v-model="users" :table-header-color="tableHeaderColor">
        <md-table-row slot="md-table-row" slot-scope="{ item }" @click="visited_log(item.startDate)">
        <md-table-cell md-label="방문일자">{{ item.startDate }}</md-table-cell>
        <md-table-cell md-label="이용요금">{{ item.amountPrice }}</md-table-cell>
        </md-table-row>
    </md-table>
    
</template>

<script>
import VueHighcharts from 'vue2-highcharts'
import Highcharts from 'highcharts';


var draw_state = false;

export default {
    components: {
        VueHighcharts,
        Highcharts
    },
    name: "simple-table",
    props: {
        tableHeaderColor: {
        type: String,
        default: ""
        }   
    },
    data() {
        return {
            users: [],
            userInfo: null,
            childInfo: null
        }
    },
    methods: {
        visited_log(date) {
            this.$EventBus.$emit('visited', true, date, this.childInfo.id);
        }
    },
    created() {
        this.userInfo = localStorage.getItem("userInfo");
        this.childInfo = JSON.parse(localStorage.getItem("childInfo"));
        const baseURI = 'http://192.168.0.4:7080/heroes/visitingrecord/management/select';
        this.$http.get(baseURI, {
            params: {
                childId: this.childInfo.id 
            }
        })
        .then(response => {
            if(response.data.result == "success")
            {
                this.users = response.data.data;
            }
        }).catch(error => {
            console.log(error);
        }); 
    }
};
</script>