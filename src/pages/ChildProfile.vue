<template>
<div class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-40" >
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">자녀목록</h4>
          </md-card-header>
          <md-card-content>
            <md-table v-model="childs" :table-header-color="tableHeaderColor">
              <md-table-row slot="md-table-row" slot-scope="{ item }" @click="change_child(item)">
              <md-table-cell md-label="자녀이름">{{ item.name }}</md-table-cell>
              </md-table-row>
            </md-table>
          </md-card-content>
        </md-card>        
</div>

</template>

<script>

export default {
    props: {
      tableHeaderColor: {
        type: String,
        default: ""
      }
    },
    data() {
        return {
            childs: []
        }
    },
    methods: {
      change_child(child_info) {
        localStorage.setItem("childInfo", JSON.stringify(child_info));
        alert("변경완료");
      }
    },
    created() {
      var userInfo = localStorage.getItem("userInfo");
      var childInfo = localStorage.getItem("childInfo");
      this.childs = JSON.parse(userInfo).child;
      // alert(JSON.parse(childInfo).name);
    }
};
</script>
