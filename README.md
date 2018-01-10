# 玩客猴助手

## About

用于玩客猴自动喂养、自动筛选。

## Getting Started

### Prerequisites

* 插件仅支持[Chrome][010]浏览器

### Installation

* 下载[zip插件包][011]
* 打开[chrome扩展程序][012]加载插件
    ![image](public/install.jpg)
* 点击Chrome右上角的插件，配置插件参数
* 在Chrome打开玩客猴h5，在自己猴下方点击喂养即可

## Special Explanation

* 每次喂饱一只猴子会向作者转账0.5WKC
* 该工具不会上传你的钱包地址密码到我们的远端服务器上，没有密码无法喂养，如果不放心的话，喂养的钱包最好是临时钱包，如果还不放心，请不要使用本插件

## FAQ

1. 钱包文件
    * 链克口袋-账户-导出备份-用记事本打开-拷贝全部内容
1. 最大饱和喂养，"最大投食量"的情况下"最少手续费"，如`#63212`，喂食`0.63212`二次，喂食`3.63212`一次
1. 最大次数喂养，多次"0.ID"
1. 最小次数喂养，"最少次数喂养"，先喂养一次`4.ID`，然后喂养多次`0.ID`
1. 掘金价值 `掘金系数*体重?/代系数` => ? `可选`; 代系数 `1.168^x` => x`代`
1. 掘金分数 `体重*掘金*有效喂食/代系数` => 代系数 `1.168^x` => x`代`
1. 捡漏 `掘金价值/wkc` => wkc `猴子市场价`
1. 如果有其他问题可以进群询问

[010]: https://www.google.com/chrome/browser/desktop/index.html
[011]: https://codeload.github.com/lizhengqiang/wkh/zip/master
[012]: chrome://extensions/
