<style >
@keyframes spin {
  /* to {
    transform: rotate(1turn);
  } */

  0% {
    transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
    -ms-transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
  }
}

.my-login-circle {
  width: 6%;
}

.my-login-circle-svg {
  animation: spin 15s infinite linear;
}

.my-login-circle-svg-speedup {
  animation: spin 1s infinite linear;
}
</style>

<template>
  <div class="my-login-circle" style="width: 9%;position: relative;bottom: 265px;left: 259px;">
    <svg viewBox="0 0 100 100" :class="svgclass">
      <path
        d="M 50,50 m 0,-47
          a 47,47 0 1 1 0,94
          a 47,47 0 1 1 0,-94"
        stroke="#eaeef2"
        stroke-width="5"
        fill-opacity="0"
        style="stroke: rgb(255, 255, 255);"
      />
      <path
        d="M 50,50 m 0,-47
          a 47,47 0 1 1 0,94
          a 47,47 0 1 1 0,-94"
        stroke-linecap="round"
        stroke="#5cb85c"
        stroke-width="6"
        fill-opacity="0"
        style="stroke-dasharray: 295.31px, 295.31px;stroke-dashoffset: 40px;transition: stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease 0s;stroke: #2d8cf0;stroke-width: 5px;"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "LoginCircle",
  data() {
    return {
      svgclass: "my-login-circle-svg"
    };
  },
  methods: {
    loading: function() {
      this.svgclass = "my-login-circle-svg-speedup";
    },
    wait: function() {
      this.svgclass = "my-login-circle-svg";
    }
  }
};
</script>