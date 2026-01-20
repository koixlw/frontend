// 全局指令注册
import { scrollReveal, scrollRevealLeft, scrollRevealRight, scrollRevealScale } from './scrollReveal';

export default {
  install(app) {
    // 注册滚动显示指令
    app.directive('scroll-reveal', scrollReveal);
    app.directive('scroll-reveal-left', scrollRevealLeft);
    app.directive('scroll-reveal-right', scrollRevealRight);
    app.directive('scroll-reveal-scale', scrollRevealScale);
  }
};
