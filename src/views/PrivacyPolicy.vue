<template>
    <div class="privacy-policy-page">
        <div class="container">
            <h1 class="page-title">隐私政策</h1>
            <div class="content">
                <p class="effective-date">生效日期：2025年10月1日</p>

                <section>
                    <h2>1. 引言</h2>
                    <p>
                        欢迎访问泥彩人非遗文化传承网站（以下简称“本网站”）。我们非常重视您的隐私保护。本隐私政策旨在向您说明我们在您使用本网站服务时如何收集、使用、存储和分享您的个人信息，以及您享有的相关权利。
                    </p>
                </section>

                <section>
                    <h2>2. 我们收集的信息</h2>
                    <p>在您使用本网站服务的过程中，我们可能会收集以下类型的信息：</p>
                    <ul>
                        <li><strong>个人身份信息：</strong>当您进行预约体验、购买商品或注册账号时，我们可能会收集您的姓名、联系电话、电子邮箱、收货地址等信息。</li>
                        <li><strong>日志信息：</strong>当您访问本网站时，我们的服务器会自动记录您的IP地址、浏览器类型、访问日期和时间、访问的页面记录等日志信息。</li>
                        <li><strong>设备信息：</strong>我们可能会收集您使用的设备型号、操作系统版本等信息，以便优化页面展示和提升服务质量。</li>
                    </ul>
                </section>

                <section>
                    <h2>3. 信息的用途</h2>
                    <p>我们收集的信息主要用于以下目的：</p>
                    <ul>
                        <li>处理您的预约请求和订单配送；</li>
                        <li>向您发送关于泥彩人文化活动的通知或资讯（您可以随时取消订阅）；</li>
                        <li>分析网站流量，改进网站内容及用户体验；</li>
                        <li>保障网络安全，防范欺诈行为。</li>
                    </ul>
                </section>

                <section>
                    <h2>4. 信息共享与披露</h2>
                    <p>
                        除了法律法规规定或征得您明示同意外，我们不会向任何第三方出售、出租或交易您的个人信息。在以下情况下，我们可能会披露您的部分信息：
                    </p>
                    <ul>
                        <li><strong>服务提供商：</strong>我们可能会聘请第三方服务提供商（如物流公司、支付平台）协助我们提供服务，他们只能在为我们提供服务所需的范围内接触您的个人信息。</li>
                        <li><strong>法律要求：</strong>在遵守法律法规、法院命令或政府机关要求的情况下，我们可能需要披露您的信息。</li>
                    </ul>
                </section>

                <section>
                    <h2>5. 信息安全</h2>
                    <p>
                        我们采取合理的技术和管理措施来保护您的个人信息安全，防止遭到未经授权的访问、披露、使用、修改、损坏或丢失。但请注意，互联网并非绝对安全的环境，由于技术限制，我们无法保证信息的百分之百安全。
                    </p>
                </section>

                <section>
                    <h2>6. Cookie 的使用</h2>
                    <p>
                        为确保网站正常运转，我们可能会在您的计算机或移动设备上存储名为 Cookie 的小数据文件。Cookie 通过记录您的偏好设置，帮助您获得更轻松的访问体验。您可以通过浏览器设置管理或删除
                        Cookie。
                    </p>
                </section>

                <section>
                    <h2>7. 政策更新</h2>
                    <p>
                        我们可能会根据业务发展或法律法规的变化更新本隐私政策。更新后的政策将在本网站上发布。建议您定期查看本页面以了解最新的隐私保护措施。
                    </p>
                </section>

                <section>
                    <h2>8. 联系我们</h2>
                    <p>
                        如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：<br>
                        邮箱：2379668489@qq.com<br>
                        地址：四川大学锦江学院
                    </p>
                </section>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    window.scrollTo(0, 0);
});
</script>

<style scoped>
.privacy-policy-page {
    padding: 120px 0 60px;
    background-color: #f9f9f9;
    min-height: 100vh;
}

.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    padding: 40px;
}

.page-title {
    text-align: center;
    font-size: 32px;
    color: #333;
    margin-bottom: 40px;
    font-weight: bold;
}

.effective-date {
    text-align: right;
    color: #666;
    margin-bottom: 30px;
    font-style: italic;
}

.content section {
    margin-bottom: 30px;
}

.content h2 {
    font-size: 20px;
    color: #d93b30;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
}

.content p {
    font-size: 16px;
    line-height: 1.8;
    color: #555;
    margin-bottom: 10px;
    text-align: justify;
}

.content ul {
    list-style-type: disc;
    padding-left: 20px;
    margin-bottom: 15px;
}

.content li {
    font-size: 16px;
    line-height: 1.8;
    color: #555;
    margin-bottom: 5px;
}

@media (max-width: 768px) {
    .container {
        padding: 20px;
    }

    .page-title {
        font-size: 24px;
    }

    .content h2 {
        font-size: 18px;
    }

    .content p,
    .content li {
        font-size: 14px;
    }
}
</style>
