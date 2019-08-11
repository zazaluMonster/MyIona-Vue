import { PROP } from '@/properties.js';

/**
 * Node全局注册
 */
global.$prop = PROP;
//baseUtil用到了部分prop属性，所以必须要求prop先注册到Node全局
var baseUtil = require("@/util/BaseUtil.js");
global.$util = baseUtil.util;
/**
 * 
 */
export function boot(){
    global.$util.logger("boot success!")
}