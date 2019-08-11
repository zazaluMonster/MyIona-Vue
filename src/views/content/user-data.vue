<style scoped>
.time {
  font-size: 14px;
  font-weight: bold;
}
.content {
  padding-left: 5px;
}

.uploadPanel {
  position: absolute;
  bottom: 50%;
  left: 13%;
}

.avatarCover {
  height: auto;
  width: fit-content;
}

.show {
  opacity: 1;
}

.showCover {
  opacity: 0.3;
}

img {
  width: 180px;
  height: 180px;
}

.editButton {
  display:block;
  margin:0 auto;
  margin-top: 7%;
}
</style>
<template>
  <Content class="IonaContent">
    <Row>
      <i-col span="6">
        <div style="width: fit-content">
          <div class="avatarCover" @mouseenter="onAvatarFocus" @mouseleave="onAvatarBlur">
            <img :class="avatarClass" :src="avatarSrc" />
            <Button
              v-if="uploadButtonSwitch"
              class="uploadPanel"
              icon="ios-cloud-upload-outline"
              @click="handleAvatarCropper"
              type="info"
              ghost
            >上传头像</Button>
          </div>
          <div>
            <Button
              class="editButton"
              type="info"
              icon="md-create"
              ghost
              @click="openEditPanel"
            >编辑个人资料</Button>
          </div>
        </div>
      </i-col>
      <i-col span="6">
        <Timeline>
          <TimelineItem v-for="item in items" :key="item.title">
            <p class="time">{{item.title}}</p>
            <p class="content">{{item.value}}</p>
          </TimelineItem>
        </Timeline>

        <div>
          <button ref="cropperTrigger" id="pick-avatar" style="display:none">Select an image</button>
          <avatar-cropper trigger="#pick-avatar" :upload-handler="uploadAvatarHandle" />
        </div>
      </i-col>
    </Row>
    <user-edit ref="userEdit" @on-success-valid="handleEdit"></user-edit>
    <Spin fix v-if="loading"></Spin>
  </Content>
</template>
<script>
import { post, getCookie } from "@/util/httpUtil.js";
import sleep from "sleepjs";
import AvatarCropper from "vue-avatar-cropper";
import UserEdit from "../../components/user/user-edit";

export default {
  components: {
    AvatarCropper,
    UserEdit
  },
  data() {
    return {
      avatarClass: "",
      classes: {
        show: "show",
        showCover: "showCover"
      },
      uploadButtonSwitch: false,
      loading: true,
      items: [
        {
          title: "暂无数据",
          value: "暂无数据"
        }
      ],
      avatarOption: {
        width: 180,
        height: 180
      }
    };
  },
  computed: {
    avatarSrc: function() {
      return this.$store.state.avatarUrl;
    }
  },
  created: function() {
    //获取用户信息
    this.initUserData();
  },
  methods: {
    handleEdit(data) {
      post(global.$prop.URL.update, data, this.editResponse);
    },
    async editResponse(responseData) {
      global.$util.successNotice("修改成功,2秒后自动刷新");
      this.closeEditPanel();
      //刷新页面加载新的用户数据
      await sleep(2000);
      window.location.reload();
    },
    handleAvatarCropper() {
      this.$refs.cropperTrigger.click();
    },
    uploadAvatarHandle(cropper) {
      global.$util.logger("向服务器发送图片数据");
      let response = this.uploadResponse;
      cropper.getCroppedCanvas().toBlob(blob => {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function(e) {
          let imgBase64 = e.target.result;
          global.$util.logger("图片上传中...");
          global.$util.logger(imgBase64.substring(0, 100));
          post(
            global.$prop.URL.uploadAvatar,
            {
              crewName: getCookie(global.$prop.COOKIE_USERNAME),
              avatarImgCode: imgBase64
            },
            response
          );
        };
      });
    },
    uploadResponse(responseData) {
      //更新头像url引用
      global.$util.updateAvatarUrl(this.$store, responseData.avatarURL);
    },
    onAvatarFocus: function() {
      //显示上传头像按钮
      this.showUploadAvatarPannel();
    },
    onAvatarBlur: function() {
      this.closeUploadAvatarPannel();
    },
    showUploadAvatarPannel: function() {
      this.avatarClass = this.classes.showCover;
      this.uploadButtonSwitch = true;
    },
    closeUploadAvatarPannel: function() {
      this.avatarClass = this.classes.show;
      this.uploadButtonSwitch = false;
    },
    initUserData: function() {
      let userData = this.$store.state.userData;
      let userItems = [
        {
          title: "用户UID",
          value: userData.id
        },
        {
          title: "用户名",
          value: userData.crewName
        },
        {
          title: "手机",
          value: userData.phoneNum
        },
        {
          title: "邮箱",
          value: userData.mail
        },
        {
          title: "自我介绍",
          value: userData.crewMessage
        },
        {
          title: "创建时间",
          value: userData.createTime
        },
        {
          title: "最后上线时间",
          value: userData.lastOfflineTime
        }
      ];
      this.items = userItems;
      this.loading = false;
    },
    openEditPanel() {
      this.$refs.userEdit.show = true;
    },
    closeEditPanel() {
      this.$refs.userEdit.show = false;
    }
  }
};
</script>