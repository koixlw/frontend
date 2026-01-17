<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">关于泥彩人</h3>
          <p class="footer-text">
            泥彩人是中国传统非遗文化的重要组成部分，我们致力于传承和弘扬这一珍贵的文化遗产，
            通过现代科技与传统工艺的结合，让更多人了解和喜爱泥彩人艺术。
          </p>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">联系方式</h3>
          <ul class="contact-list">
            <li class="contact-item">
              <i class="icon">📍</i>
              <span>地址：四川大学锦江学院</span>
            </li>
            <li class="contact-item">
              <i class="icon">📞</i>
              <span>电话：+86 12345678</span>
            </li>
            <li class="contact-item">
              <i class="icon">✉️</i>
              <span>邮箱：2379668489@qq.com</span>
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h3 class="footer-title">快速链接</h3>
          <ul class="link-list">
            <li><router-link to="/about" class="footer-link">关于我们</router-link></li>
            <li><router-link to="/inheritors" class="footer-link">传承人</router-link></li>
            <li><router-link to="/gallery" class="footer-link">作品展示</router-link></li>
            <li><router-link to="/news" class="footer-link">新闻动态</router-link></li>
            <li><router-link to="/shop" class="footer-link">商城</router-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3 class="footer-title">关注我们</h3>
          <div class="social-links">
            <a href="#" class="social-link">
              <svg class="social-icon wechat" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true">
                <path
                  d="M664.250054 368.541681c10.015098 0 19.892049 0.732687 29.67281 1.795902-26.647917-122.810047-159.358451-214.077703-310.826188-214.077703-169.353083 0-308.085774 114.232694-308.085774 259.274068 0 83.708494 46.165436 152.460344 123.281791 205.78483l-30.80868 91.730191 107.688651-53.455469c38.558178 7.53665 69.459978 15.308661 107.924012 15.308661 9.66308 0 19.230993-0.470721 28.752858-1.225921-6.025227-20.36584-9.521864-41.723264-9.521864-63.862493C402.328693 476.632491 517.908058 368.541681 664.250054 368.541681zM498.62897 285.87389c23.200398 0 38.557154 15.120372 38.557154 38.061874 0 22.846334-15.356756 38.156018-38.557154 38.156018-23.107277 0-46.260603-15.309684-46.260603-38.156018C452.368366 300.994262 475.522716 285.87389 498.62897 285.87389zM283.016307 362.090758c-23.107277 0-46.402843-15.309684-46.402843-38.156018 0-22.941502 23.295566-38.061874 46.402843-38.061874 23.081695 0 38.46301 15.120372 38.46301 38.061874C321.479317 346.782098 306.098002 362.090758 283.016307 362.090758zM945.448458 606.151333c0-121.888048-123.258255-221.236753-261.683954-221.236753-146.57838 0-262.015505 99.348706-262.015505 221.236753 0 122.06508 115.437126 221.200938 262.015505 221.200938 30.66644 0 61.617359-7.609305 92.423993-15.262612l84.513836 45.786813-23.178909-76.17082C899.379213 735.776599 945.448458 674.90216 945.448458 606.151333zM598.803483 567.994292c-15.332197 0-30.807656-15.096836-30.807656-30.501688 0-15.190981 15.47546-30.477129 30.807656-30.477129 23.295566 0 38.558178 15.286148 38.558178 30.477129C637.361661 552.897456 622.099049 567.994292 598.803483 567.994292zM768.25071 567.994292c-15.213493 0-30.594809-15.096836-30.594809-30.501688 0-15.190981 15.381315-30.477129 30.594809-30.477129 23.107277 0 38.558178 15.286148 38.558178 30.477129C806.808888 552.897456 791.357987 567.994292 768.25071 567.994292z"
                  fill="#5D5D5D"></path>
              </svg>
              <span>微信公众号</span>
            </a>
            <a href="https://www.xiaohongshu.com" class="social-link">
              <i class="icon">📸</i>
              <span>小红书</span>
            </a>
            <a href="https://www.douyin.com" class="social-link">
              <i class="icon">🎵</i>
              <span>抖音</span>
            </a>
            <a href="https://www.bilibili.com" class="social-link">
              <i class="icon">📹</i>
              <span>Bilibili</span>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="copyright">
          泥彩人非遗文化传承中心. 保留所有权利.
        </div>
        <div class="footer-nav">
          <router-link to="/privacy-policy" class="footer-nav-link">隐私政策</router-link>
          <span>|</span>
          <router-link to="/terms-of-use" class="footer-nav-link">使用条款</router-link>
          <span>|</span>
          <a href="#" class="footer-nav-link">网站地图</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
.footer {
  background-color: #333;
  color: white;
  padding: 40px 0;
  margin-top: 40px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 30px;
}

.footer-section {
  flex: 1;
}

.footer-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #d93b30;
}

.footer-text {
  font-size: 14px;
  line-height: 1.6;
  color: #ccc;
}

.contact-list {
  list-style: none;
  padding: 0;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  font-size: 14px;
  color: #ccc;
}

.icon {
  margin-right: 10px;
  font-size: 16px;
}

.link-list {
  list-style: none;
  padding: 0;
}

.link-list li {
  margin-bottom: 10px;
}

.footer-link {
  text-decoration: none;
  color: #ccc;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #d93b30;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.social-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #ccc;
  font-size: 14px;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: #d93b30;
}

.social-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  flex-shrink: 0;
}

.footer-bottom {
  border-top: 1px solid #444;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.copyright {
  font-size: 14px;
  color: #aaa;
  margin-bottom: 10px;
}

.footer-nav {
  font-size: 14px;
  color: #aaa;
}

.footer-nav-link {
  text-decoration: none;
  color: #aaa;
  margin: 0 10px;
  transition: color 0.3s ease;
}

.footer-nav-link:hover {
  color: #d93b30;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .footer-section {
    text-align: center;
  }

  .contact-item {
    justify-content: center;
  }

  .social-links {
    align-items: center;
  }
}
</style>
