<style scoped>
.postButton {
  width: 10%;
  border-radius: 20px;
  margin-right: 20px;
}
.iMessageCard {
  margin-bottom: 10px;
  cursor: pointer;
}

.iMessage {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", sans-serif;
  font-size: 17px;
  overflow-wrap: break-word;
  margin-top: 5px;
  white-space: pre-wrap;
}
.toolGroup {
  margin-top: 10px;
}

.toolButton span {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", sans-serif;
  font-size: 15px;
  position: relative;
  bottom: 2px;
}

.toolIcon {
  font-size: 20px;
  margin-right: 5px;
  transition: font-size 0.5s;
  -moz-transition: font-size 0.5s; /* Firefox 4 */
  -webkit-transition: font-size 0.5s; /* Safari 和 Chrome */
  -o-transition: font-size 0.5s;
}

.toolIcon:hover {
  color: #57a3f3;
  font-size: 25px;
}

.toolSpan {
  margin-right: 30px;
}

.crewName-little {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Ubuntu, "Helvetica Neue", sans-serif;
  font-size: 17px;
  overflow-wrap: break-word;
  color: black;
}
.creatorNameSpan:hover {
  text-decoration: underline;
}
</style>
<template>
  <Card class="iMessageCard" style="width:100%;">
      <div>
        <Row>
          <i-col span="2">
            <img class="iMessageAvatar" v-bind:src="curMessageItems.avatarUrl" />
          </i-col>
          <i-col span="21" style="margin-left: 10px">
            <p class="crewName-little">
              <span class="creatorNameSpan">{{curMessageItems.creatorName}}</span>
              ·
              <span
                style="color: rgb(101, 119, 134);font-size: 15px;" v-if="curMessageItems.createTime"
              >{{curMessageItems.createTime.substring(0,4)}}.{{curMessageItems.createTime.substring(4,6)}}.{{curMessageItems.createTime.substring(6,8)}} {{curMessageItems.createTime.substring(8,10)}}:{{curMessageItems.createTime.substring(10,12)}}</span>
              <span style="float: right">
                <Icon :size="18" type="md-arrow-dropdown"></Icon>
              </span>
            </p>
            <p class="iMessage" v-html="curMessageItems.html"></p>
          </i-col>
        </Row>
      </div>
    </Card>
</template>
<script>
// import HeaderBar from "../../components/header/header-bar";
export default {
  components: {
  },
  props: {
    curMessageItems: {
      type: Object,
      default: () => {
        return {
            createTime:"300011111111"
        }
      }
    }
  },
  data() {
    return {
    };
  },
  created: function() {
  },
  methods: {
  }
};
</script>