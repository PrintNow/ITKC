# ITKC - 2020 江西省信息技术知识竞赛题库 在线练习/答题

> ITKC：*Information Technology Knowledge Competition*
>
> 在线示例：http://itkc.NowTime.cc
>
> 较为详细使用说明：https://nowtime.cc/github/780.html

# 🕑 更新日志
- 2020/10/30 08:35 纠正6处题目答案错误：403、426、455、1322、2606、1786 题
- 2020/10/15 14:37 更新 2020年题库，感谢 [@Olvi73](https://github.com/Olvi73) 提醒，并说声抱歉鸽了那么久
- 2019/09/29        初次构建

# 💥 项目说明
> 由于这是一年前写的，翻阅代码自己写的比较烂，众多想实现的功能没有实现，但是你们可以查看 `/static/js/data_*.js` 文件，里面是题库数据，是 JSON 数据格式的，任由你发挥

---
---
> ### 以下是去年写的
>
# ❓ What’s | 这是什么

一个可以在线练习/答题的 **2019 江西省信息技术知识竞赛题库**。采用响应式布局，电脑、手机、平板电脑都可以使用

# Why | 为什么会有这个项目

源于自己报名了这个竞赛，老师只发了一个 `2019 竞赛公开题库.xls` 文件，然后要我好好背背。

让我看着这表格背？那是不可能的，肯定要用高大上的方法做啊，就想到了制作一个网页：在线练习/答题

这个 在线练习/答题 在上学期临近期末的时候我已经做过了，所以i现在我只需要改一下就可以（其实大改了很多...），以下是上学期临近期末写的：
 ![1563011609792.png][1]

 
# 🧀 Usage | 如何使用

1. 下载 或 克隆 本项目
2. 用浏览器打开 `index.html` 即可使用
3. 或者上传到你的 web 服务器，供大家食用
4. 右下角哦有一个 **固定浮动操作按钮**，点击可以进行 刷新、填充正确答案、上一页、跳转指定页、下一页
5. 点击右上角“评分”可以评分

# Compatibility | 兼容性

> 对于手机用户，不太推荐使用一些App的内置浏览器使用，如 QQ、微信、微博...
> 
> 为了保证你能够正常使用，请使用以下*最新版*的浏览器
>
- Chrome
- Firefox
- Safari

使用其它浏览器不保证能够正常使用


# How It Works | 如何工作的

1. 首先，加载题库数据文件 `static/js/data_2020.js`
2. 然后监听 DOM 加载完成事件，完成后开始渲染试题

# 缺点
> 既是缺点，也是后面**可能会做**的功能，也欢迎提交 Issues，提出你要做的功能，分担任务，众人拾柴火焰高
1. 暂时无法设置一页渲染多少题目
2. 暂时无法按比例抽出300题做，如计算机基础、程序设计等按照一定比例渲染试卷去做
3. 暂时无法指定类型题目做

# Thanks | 感谢

- [MDUI][2] （前端框架） 

# License | 执照

[License][3]

 
 [1]: static/img/Snipaste_2019-10-02_17-01-17.png
 [2]: https://github.com/zdhxiong/mdui/
 [3]: LICENSE