// 道长 drpy仓库 https://gitcode.net/qq_32394351/dr_py
// 道长 drpy安卓本地搭建说明 https://code.gitlink.org.cn/api/v1/repos/hjdhnx/dr_py/blob/master/%E5%AE%89%E5%8D%93%E6%9C%AC%E5%9C%B0%E6%90%AD%E5%BB%BA%E8%AF%B4%E6%98%8E.md
// 道长 drpy写源 模板规则说明 https://gitcode.net/qq_32394351/dr_py#%E6%A8%A1%E6%9D%BF%E8%A7%84%E5%88%99%E8%AF%B4%E6%98%8E
// 道长 drpy写源 套模模版 https://ghproxy.net/https://raw.githubusercontent.com/hjdhnx/dr_py/main/js/%E6%A8%A1%E6%9D%BF.js
// 道长 drpy写源 相关视频教程 https://www.youtube.com/watch?v=AK7cN-fcwm4
// 道长 drpy写源 写源教学视频 https://t.me/fongmi_offical/54080/63553
// 海阔下载 https://haikuo.lanzoui.com/u/GoldRiver
// 影视TV 官方TG Drpy群 https://t.me/fongmi_offical/63689
// 影视TV 官方TG 下载 https://t.me/fongmi_release


var rule = {
    title:'JRKAN直播',
    host:'http://www.jrkankan.com/?lan=1',
    // JRKAN备用域名:www.jrkankan.com / www.jrkan365.com / jrsyyds.com / www.jryyds.com / jrskan.com / jrsbxj.com
    // JRKAN网址发布:qiumi1314.com
    url:'/fyclass',
    searchUrl:'',
    searchable:0,
    quickSearch:0,
    class_name:'全部',
    class_url:'/',
    //class_url:'?live',
    headers:{
        'User-Agent':'MOBILE_UA'
    },
    timeout:5000,
    play_parse:true,
    lazy:"",
    limit:6,
    double:false,
    推荐:'*',
    // 一级:'.loc_match:eq(2) ul;li:gt(1):lt(4)&&Text;img&&src;li:lt(2)&&Text;a:eq(1)&&href',//play.sportsteam333.com
    一级:"js:var items=[];pdfh=jsp.pdfh;pdfa=jsp.pdfa;pd=jsp.pd;var html=request(input);var tabs=pdfa(html,'body&&.d-touch');tabs.forEach(function(it){var pz=pdfh(it,'.name:eq(1)&&Text');var ps=pdfh(it,'.name:eq(0)&&Text');var pk=pdfh(it,'.name:eq(2)&&Text');var img=pd(it,'img&&src');var timer=pdfh(it,'.lab_time&&Text');var url=pd(it,'a.me&&href');items.push({desc:timer+'🏆'+ps,title:pz+'🆚'+pk,pic_url:img,url:url})});setResult(items);",
    二级:{
        "title":".sub_list li:lt(2)&&Text;.sub_list li:eq(0)&&Text",
        "img":"img&&src",
        "desc":";;;.lab_team_home&&Text;.lab_team_away&&Text",
        "content":".sub_list ul&&Text",
        "tabs":"js:TABS=['JRKAN直播']",
        "lists":"js:LISTS=[];pdfh=jsp.pdfh;pdfa=jsp.pdfa;pd=jsp.pd;let html=request(input);let data=pdfa(html,'.sub_playlist&&a');TABS.forEach(function(tab){let d=data.map(function(it){let name=pdfh(it,'strong&&Text');let url=pd(it,'a&&data-play');return name+'$'+url});LISTS.push(d)});",
    },
    搜索:'',
}