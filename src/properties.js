var PROP = {
    COOKIE_USERNAME: "MyIonaCrewName",
    COOKIE_SUFFIX: "_token",
    HTTP_STATUS: {
        ERROR: "ERROR",
        OK: "OK",
        NETWORK_AUTHENTICATION_REQUIRED: "NETWORK_AUTHENTICATION_REQUIRED",
        REGISTER_SUCCESS: "REGISTER_SUCCESS"
    },
    URL: {
        login: "/crew/login",
        register: "/crew/register",
        getVerificationCode: "/general/verificationCode",
        getVerificationCodeToMail: "/general/verificationCodeToMail",
        passwordReset: "/crew/passwordReset",
        getCrew: "/crew/getCrew",
        getRecommendUser: "/crew/recommendUser",
        uploadAvatar: "/crew/uploadAvatar",
        update: "/crew/update",
        newMessage: "/message/newMessage",
        getMyMessage: "/message/getMyMessage",
        getUserMessage: "/message/getUserMessage",
        getFriendMessage: "/message/getFriendMessage",
        isFollowing: "/follow/isFollowing",
        addFollow: "/follow/addFollow",
        cancelFollow: "/follow/cancelFollow",
        doLike: "/like/doLike",
        cancelLike: "/like/cancelLike",
        newReTweetMessage: "/message/newReTweetMessage",
        cancelReTweetMessage: "/message/cancelReTweetMessage",
        messageDetail: "/message/messageDetail",
        newComment: "/comment/newComment",
        commentList: "/comment/commentList",
        getNewNotice: "/notice/getNewNotice",
        readNotice: "/notice/readNotice"
    },
    // 无需进行身份验证的请求
    NO_LOGIN_URL: {
        login: "/crew/login",
        register: "/crew/register",
        getVerificationCode: "/general/verificationCode",
        getVerificationCodeToMail: "/general/verificationCodeToMail",
        passwordReset: "/crew/passwordReset"
    },
    //全局头像URL,默认引用本地的一个预置
    AVATAR_URL:  require('./assets/avatar/avatar.jpg'),
    TOKEN_LIVE_TIME: 20,
    DEBUG: true,
    AXIOS_TIME_OUT: 60000,
    //测试环境
    DEV_BASEURL: 'http://localhost:8080/MyIona/',
    // DEV_BASEURL: 'http://192.168.0.109:8080/MyIona/',
    //生产环境
    PROD_BASEURL: 'http://47.111.146.215:8080/MyIona/',
    // WebSocket常量
    WEBSOCKETPATH: '/sockJsEndPoint',
    PRODUCERPATH: '/topic/getResponse',
    WEBSOCKET_CHAT_ROOM_PRODUCE_PATH: '/topic/chatResponse',
    P2PPUSHBASEPATH: '/user',
    P2PPUSHPATH: '/msg',
    WEBSOCKETPATHPERFIX: '/ws-push',
    FORETOSERVERPATH: '/welcome',
    WEBSOCKET_CHAT_ROOM_SERVER_PATH: '/chat',
    // 聊天室连接类型
    CHAT_DISCONNET: 1,
    CHAT_CONNET: 2
}


export {
    PROP
}