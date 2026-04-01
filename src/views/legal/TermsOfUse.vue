<template>
    <div class="terms-page">
        <div class="container">
            <h1 class="page-title">使用条款</h1>
            <div class="content">
                <p class="effective-date">生效日期：2025年10月1日</p>

                <section>
                    <h2>1. 接受条款</h2>
                    <p>
                        欢迎访问泥彩人非遗文化传承网站（以下简称“本网站”）。请您在浏览、使用本网站前仔细阅读本使用条款。您访问或使用本网站，即表示您同意接受本条款的所有内容。如果您不同意这些条款，请立即停止使用本网站。
                    </p>
                </section>

                <section>
                    <h2>2. 用户行为规范</h2>
                    <p>在使用本网站及其服务时，您承诺遵守所有适用的法律法规，且不得从事以下行为：</p>
                    <ul>
                        <li>发布、传播任何违反法律法规、社会公德、公序良俗的信息；</li>
                        <li>进行任何可能破坏、干扰本网站正常运营或网络安全的行为；</li>
                        <li>未经授权，对本网站的任何部分进行复制、修改、衍生创作、反向工程或抓取；</li>
                        <li>利用本网站从事虚假交易、诈骗等违法犯罪活动。</li>
                    </ul>
                </section>

                <section>
                    <h2>3. 知识产权声明</h2>
                    <p>
                        本网站包含的所有内容，包括但不限于文本、图像、音频、视频、商标、标识、软件代码、界面设计等，均归泥彩人非遗文化传承中心或相关权利人所有，受中华人民共和国著作权法、商标法及其他知识产权法律法规的保护。
                    </p>
                    <p>
                        未经我们书面许可，您不得以任何方式（包括但不限于复制、转载、出版、展示、镜像上传）使用、修改或传播本网站的任何内容。仅在注明出处的前提下，出于个人非商业目的的学习、研究或欣赏，您可以合理使用本网站内容。
                    </p>
                </section>

                <section>
                    <h2>4. 预约与购买服务</h2>
                    <p>
                        当您在本网站进行体验活动预约或商品购买时，请确保提供真实、准确、完整的个人信息。
                    </p>
                    <ul>
                        <li><strong>预约服务：</strong>预约成功后，请按约定时间前往指定地点。如需取消或变更，请提前通知我们。</li>
                        <li><strong>商品购买：</strong>商品的价格、库存等信息可能会随时发生变化，我们尽量保证信息的准确性，但不对此作绝对保证。订单生成后，我们将依据物流政策安排发货。</li>
                    </ul>
                </section>

                <section>
                    <h2>5. 免责声明</h2>
                    <p>
                        本网站致力于提供准确、及时的信息，但不对信息的准确性、完整性、适用性或排他性提供任何明示或暗示的保证。对于因使用或无法使用本网站而导致的任何直接、间接、附带或后果性的损害，本网站不承担法律责任。
                    </p>
                    <p>
                        本网站可能包含指向第三方网站的链接，这些链接仅为方便用户提供，不代表我们对这些网站内容的认可。我们不对第三方网站的内容或做法承担责任。
                    </p>
                </section>

                <section>
                    <h2>6. 条款修改</h2>
                    <p>
                        我们保留在任何时候自行决定修改、变更或更新本使用条款的权利。修改后的条款一旦公布在本网站上即生效。您继续使用本网站即视为您接受修改后的条款。
                    </p>
                </section>

                <section>
                    <h2>7. 适用法律与争议解决</h2>
                    <p>
                        本使用条款的解释、效力及纠纷的解决，适用中华人民共和国法律。如发生争议，双方应友好协商解决；协商不成的，任何一方均可向本网站所在地有管辖权的人民法院提起诉讼。
                    </p>
                </section>

                <section>
                    <h2>8. 联系我们</h2>
                    <p>
                        如有任何疑问，请联系我们：<br>
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
.terms-page {
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
