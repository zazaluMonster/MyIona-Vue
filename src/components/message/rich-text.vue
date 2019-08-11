<style scoped>
.text {
  border: 1px solid rgb(29, 161, 242);
  height: 235px;
  border-radius: calc(16px);
  overflow: auto;
}
.toolbar {
  margin-bottom: 10px;
}
.placeholder {
  color: #9197a3;
  position: absolute;
  z-index: 1;
  top: 72px;
  left: 27px;
  font-size: 20px;
}

.show {
  display: block;
}

.close {
  display: none;
}

.limit {
  color: #9197a3;
  z-index: 1;
  float: right;
  margin-right: 11px;
  position: relative;
  top: -40px;
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 20px;
  color: black;
}

.limit-red {
  color: red;
}

.limit-normal {
}
.postButton {
  width: 15%;
  border-radius: 20px;
}
.w-e-text-container {
  height: 100px;
}
</style>
<template>
  <div>
    <div ref="placeholder" v-if="showPostButton" class="placeholder" :class="phSwitch">有什么新鲜事?</div>
    <div ref="placeholder" v-if="showReplyButton" class="placeholder" :class="phSwitch">reply</div>
    <div ref="headerBar" class="toolbar"></div>
    <div ref="editor" class="text" style="text-align:left"></div>
    <div ref="limit" class="limit" :class="lAction">{{curTextLength}}</div>

    <div style="margin-top: 10px">
      <Button v-if="showPostButton" class="postButton" type="primary" @click="handlePost">发文</Button>
      <Button v-if="showReplyButton" class="postButton" type="primary" @click="handleReply">reply</Button>
    </div>

    <!-- <button v-on:click="getContent">查看内容</button> -->
    <!-- <button v-on:click="getText">查看文本</button> -->
  </div>
</template>
<script>
import E from "wangeditor";
import xss from "xss";
import { type } from "os";
export default {
  components: {},
  props: {
    showPostButton: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    showReplyButton: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      limit: 140,
      backupHtml: "",
      curTextLength: 140,
      phSwitch: "show",
      lAction: "",
      editorContent: "",
      editorText: ""
    };
  },
  mounted() {
    var editor = new E(this.$refs.headerBar, this.$refs.editor);
    editor.customConfig.onchange = html => {
      this.editorContent = html;
      this.editorText = editor.txt.text();
      this.curTextLength = this.limit - editor.txt.text().length;
      if (this.curTextLength < 0) {
        this.editorContent = this.backupHtml;
        this.lAction = "limit-red";
      } else {
        this.backupHtml = html;
        this.lAction = "limit-normal";
      }
    };
    editor.customConfig.onfocus = () => {
      this.phSwitch = "close";
    };
    editor.customConfig.onblur = html => {
      if (this.curTextLength == this.limit) {
        this.phSwitch = "show";
      }
    };
    editor.customConfig.menus = ["emoticon"];
    editor.customConfig.pasteFilterStyle = true;
    editor.customConfig.pasteIgnoreImg = true;
    editor.customConfig.onchangeTimeout = 0;
    // 实现禁止复制
    editor.customConfig.pasteTextHandle = function(content) {
      return "";
    };
    editor.create();
  },
  created: function() {},
  methods: {
    getContent: function() {
      alert(this.editorContent);
    },
    getText() {
      alert(this.editorText);
    },
    handlePost() {
      //XSS攻击过滤
      let xssHtml = xss(this.editorContent);
      global.$util.logger(xssHtml);
      this.$emit("on-success-valid", {
        html: xssHtml,
        createTime: "",
        creator: this.$store.state.userData.id
      });
    },
    handleReply() {
      //XSS攻击过滤
      let xssHtml = xss(this.editorContent);
      global.$util.logger(xssHtml);
      this.$emit("on-reply-success-valid", {
        html: xssHtml,
        commentatorId: this.$store.state.userData.id
      });
    }
  }
};
</script>