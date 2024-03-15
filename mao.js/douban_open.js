import { dayjs, Crypto, Uri, _ } from 'assets://js/lib/cat.js';

let key = 'douban';
let domain = 'https://frodo.douban.com';
let device = {};
let siteKey = '';
let siteType = 0;

function sig(link) {
    link += `&udid=${device.id}&uuid=${device.id}&&rom=android&apikey=0dad551ec0f84ed02907ff5c42e8ec70&s=rexxar_new&channel=Yingyongbao_Market&timezone=Asia/Shanghai&device_id=${device.id}&os_rom=android&apple=c52fbb99b908be4d026954cc4374f16d&mooncake=0f607264fc6318a92b9e13c65db7cd3c&sugar=0`;
    const u = new Uri(link);
    const ts = dayjs().unix().toString();
    let sha1 = Crypto.HmacSHA1('GET&' + encodeURIComponent(u.path()) + '&' + ts, 'bf7dddc7c9cfe6f7');
    let signa = Crypto.enc.Base64.stringify(sha1);
    return link + '&_sig=' + encodeURIComponent(signa) + '&_ts=' + ts;
}

async function request(reqUrl, ua) {
    const resp = await req(reqUrl, {
        method: 'get',
        headers: {
            'User-Agent': ua || device.ua,
        },
    });
    const text = resp.content;
    return JSON.parse(text);
}

async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
    const deviceKey = 'device';
    const deviceInfo = await local.get(key, deviceKey);
    if (deviceInfo && deviceInfo.length > 0) {
        try {
            device = JSON.parse(deviceInfo);
        } catch (error) {}
    }
    if (_.isEmpty(device)) {
        device.id = randStr(40).toLowerCase();
        device.ua = `Rexxar-Core/0.1.3 api-client/1 com.douban.frodo/7.9.0(216) Android/28 product/Xiaomi11 rom/android network/wifi udid/${device.id} platform/mobile com.douban.frodo/7.9.0(216) Rexxar/1.2.151 platform/mobile 1.2.151`;
        await local.set(key, deviceKey, JSON.stringify(device));
    }
}

const charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';
function randStr(len, withNum) {
    var _str = '';
    let containsNum = withNum === undefined ? true : withNum;
    for (var i = 0; i < len; i++) {
        let idx = _.random(0, containsNum ? charStr.length - 1 : charStr.length - 11);
        _str += charStr[idx];
    }
    return _str;
}

async function home(filter) {
    const link = sig(domain + '/api/v2/movie/tag?sort=U&start=0&count=30&q=全部形式,全部类型,全部地区,全部年代&score_rang=0,10');
    const data = await request(link);
    let classes = [
        {
            type_id: 't1',
            type_name: '热播',
        },
        {
            type_id: 't2',
            type_name: '片库',
        },
        {
            type_id: 't250',
            type_name: 'Top250',
        },
        {
            type_id: 't3',
            type_name: '榜单',
            ratio: 1,
        },
        {
            type_id: 't4',
            type_name: '片单',
            ratio: 1,
        },
    ];
    let filterObj = {};
    filterObj['t1'] = [
        {
            key: 'u',
            name: '',
            init: 'movie/hot_gaia',
            value: [
                { n: '电影', v: 'movie/hot_gaia' },
                { n: '电视剧', v: 'subject_collection/tv_hot/items' },
                { n: '国产剧', v: 'subject_collection/tv_domestic/items' },
                { n: '美剧', v: 'subject_collection/tv_american/items' },
                { n: '日剧', v: 'subject_collection/tv_japanese/items' },
                { n: '韩剧', v: 'subject_collection/tv_korean/items' },
                { n: '动漫', v: 'subject_collection/tv_animation/items' },
                { n: '综艺', v: 'subject_collection/show_hot/items' },
            ],
        },
    ];
    filterObj['t4'] = [
        {
            key: 'type',
            name: '',
            init: '',
            value: [
                { n: '全部', v: '' },
                { n: '电影', v: 'movie' },
                { n: '电视剧', v: 'tv' },
            ],
        },
        {
            key: 'cate',
            name: '',
            init: 'all',
            value: [
                { n: '全部', v: 'all' },
                { n: '豆瓣片单', v: 'official' },
                { n: '精选', v: 'selected' },
                { n: '经典', v: 'classical' },
                { n: '获奖', v: 'prize' },
                { n: '高分', v: 'high_score' },
                { n: '榜单', v: 'movie_list' },
                { n: '冷门佳片', v: 'dark_horse' },
                { n: '主题', v: 'topic' },
                { n: '导演', v: 'director' },
                { n: '演员', v: 'actor' },
                { n: '系列', v: 'series' },
            ],
        },
        {
            key: 'cate',
            name: '',
            init: 'all',
            value: [
                { n: '华语', v: 'chinese' },
                { n: '欧美', v: 'western' },
                { n: '日本', v: 'japanese' },
                { n: '韩国', v: 'korea' },
            ],
        },
        {
            key: 'cate',
            name: '',
            init: 'all',
            value: [
                { n: '喜剧', v: 'comedy' },
                { n: '动作', v: 'action' },
                { n: '爱情', v: 'love' },
                { n: '科幻', v: 'science_fiction' },
                { n: '动画', v: 'cartoon' },
                { n: '悬疑', v: 'mystery' },
                { n: '惊悚', v: 'panic' },
                { n: '恐怖', v: 'horrible' },
                { n: '犯罪', v: 'criminal' },
                { n: '同性', v: 'lgbt' },
                { n: '战争', v: 'war' },
                { n: '奇幻', v: 'fantasy' },
                { n: '情色', v: 'erotica' },
                { n: '音乐', v: 'music' },
                { n: '纪录片', v: 'documentary' },
                { n: '治愈', v: 'cure' },
                { n: '艺术', v: 'art' },
                { n: '黑色幽默', v: 'dark_humor' },
                { n: '青春', v: 'youth' },
                { n: '女性', v: 'female' },
                { n: '真实事件改编', v: 'real_event' },
                { n: '暴力', v: 'violence' },
                { n: '黑白', v: 'black_white' },
                { n: '美食', v: 'food' },
                { n: '旅行', v: 'travel' },
                { n: '儿童', v: 'child' },
                { n: '人性', v: 'humanity' },
                { n: '家庭', v: 'family' },
                { n: '文艺', v: 'literary_art' },
                { n: '小说改编', v: 'novel' },
                { n: '感人', v: 'moving' },
                { n: '励志', v: 'inspiration' },
            ],
        },
    ];
    let filterAll = [];
    for (const tag of data.tags) {
        if (tag.type == '特色') continue;
        let f = {
            key: tag.type,
            name: '',
            init: tag.data[0],
        };
        let fValues = [];
        if (tag.type == '年代' && tag.data.indexOf(dayjs().year().toString()) < 0) {
            tag.data.splice(1, 0, dayjs().year().toString());
            if (tag.data.indexOf((dayjs().year() - 1).toString()) < 0) {
                tag.data.splice(2, 0, (dayjs().year() - 1).toString());
            }
        }
        for (const v of tag.data) {
            let n = v;
            if (v.indexOf('全部') >= 0) n = '全部';
            fValues.push({ n: n, v: v });
        }
        f['value'] = fValues;
        filterAll.push(f);
    }
    let sort = {
        key: 'sort',
        name: '',
        init: data.sorts[0].name,
    };
    let sortValues = [];
    for (const sort of data.sorts) {
        sortValues.push({ n: sort.text, v: sort.name });
    }
    sort['value'] = sortValues;
    filterAll.push(sort);
    filterObj['t2'] = filterAll;
    return JSON.stringify({
        class: classes,
        filters: filterObj,
    });
}

async function category(tid, pg, filter, extend) {
    let page = pg || 1;
    if (page == 0) page = 1;
    if (tid == 't1') {
        const link = sig(`${domain}/api/v2/${extend.u || 'movie/hot_gaia'}?area=全部&sort=recommend&playable=0&loc_id=0&start=${(page - 1) * 30}&count=30`);
        const data = await request(link);
        let videos = [];
        for (const vod of data.items || data.subject_collection_items) {
            let score = (vod.rating ? vod.rating.value || '' : '').toString();
            videos.push({
                vod_id: vod.id,
                vod_name: vod.title,
                vod_pic: vod.pic.normal || vod.pic.large,
                vod_remarks: score.length > 0 ? '评分:' + score : '',
            });
        }
        return JSON.stringify({
            page: parseInt(page),
            pagecount: Math.ceil(data.total / 30),
            list: videos,
        });
    } else if (tid == 't250') {
        const link = sig(`${domain}/api/v2/subject_collection/movie_top250/items?area=全部&sort=recommend&playable=0&loc_id=0&start=${(page - 1) * 30}&count=30`);
        const data = await request(link);
        let videos = [];
        for (const vod of data.items || data.subject_collection_items) {
            let score = (vod.rating ? vod.rating.value || '' : '').toString();
            videos.push({
                vod_id: vod.id,
                vod_name: vod.title,
                vod_pic: vod.pic.normal || vod.pic.large,
                vod_remarks: score.length > 0 ? '评分:' + score : '',
            });
        }
        return JSON.stringify({
            page: parseInt(page),
            pagecount: Math.ceil(data.total / 30),
            list: videos,
        });
    } else if (tid == 't2') {
        const link = sig(`${domain}/api/v2/movie/tag?sort=${extend.sort || 'U'}&start=${(page - 1) * 30}&count=30&q=${extend['形式'] || '全部形式'},${extend['类型'] || '全部类型'},${extend['地区'] || '全部地区'},${extend['年代'] || '全部年代'}&score_rang=0,10`);
        const data = await request(link);
        let videos = [];
        for (const vod of data.data) {
            let score = (vod.rating ? vod.rating.value || '' : '').toString();
            videos.push({
                vod_id: vod.id,
                vod_name: vod.title,
                vod_pic: vod.pic.normal || vod.pic.large,
                vod_remarks: score.length > 0 ? '评分:' + score : '',
            });
        }
        return JSON.stringify({
            page: parseInt(page),
            pagecount: Math.ceil(data.total / 30),
            list: videos,
        });
    } else if (tid == 't3') {
        let link = sig(`${domain}/api/v2/movie/category_ranks?count=30&category=recent_hot`);
        let data = await request(link);
        let videos = [];
        for (const vod of data.selected_collections) {
            videos.push({
                vod_id: 'cr_' + vod.id,
                vod_name: vod.short_name || vod.title,
                vod_pic: vod.cover_url,
                vod_remarks: '',
                cate: {},
            });
        }
        link = sig(`${domain}/api/v2/tv/category_ranks?count=30&category=recent_hot`);
        data = await request(link);
        for (const vod of data.selected_collections) {
            videos.push({
                vod_id: 'cr_' + vod.id,
                vod_name: vod.short_name || vod.title,
                vod_pic: vod.cover_url,
                vod_remarks: '',
                cate: {},
            });
        }
        return JSON.stringify({
            page: 1,
            pagecount: 1,
            list: videos,
        });
    } else if (tid == 't4') {
        const link = sig(`${domain}/api/v2/skynet/new_playlists?subject_type=${extend['type'] || ''}&category=${extend['cate'] || 'all'}&loc_id=0&start=${(page - 1) * 30}&count=30`);
        const data = await request(link);
        let videos = [];
        for (const vod of data.data[0].items) {
            videos.push({
                vod_id: vod.owner ? 'dl_' + vod.id : 'cr_' + vod.id,
                vod_name: vod.title,
                vod_pic: vod.cover_url,
                vod_remarks: '',
                cate: {},
            });
        }
        return JSON.stringify({
            page: parseInt(page),
            pagecount: Math.ceil(data.total / 30),
            list: videos,
        });
    } else if (tid.startsWith('cr_')) {
        const link = sig(`${domain}/api/v2/subject_collection/${tid.substring(3)}/items?start=${(page - 1) * 30}&count=30&updated_at=&items_only=1`);
        const data = await request(link);
        let videos = [];
        for (const vod of data.subject_collection_items) {
            let score = (vod.rating ? vod.rating.value || '' : '').toString();
            videos.push({
                vod_id: vod.id,
                vod_name: vod.title,
                vod_pic: vod.pic.normal || vod.pic.large,
                vod_remarks: score.length > 0 ? '评分:' + score : '',
            });
        }
        return JSON.stringify({
            page: parseInt(page),
            pagecount: Math.ceil(data.total / 30),
            list: videos,
        });
    } else if (tid.startsWith('dl_')) {
        const link = sig(`${domain}/api/v2/doulist/${tid.substring(3)}/posts?start=${(page - 1) * 30}&count=30&updated_at=&items_only=1`);
        const data = await request(link);
        let videos = [];
        for (const it of data.items) {
            const vod = it.content.subject;
            if (!vod) continue;
            let score = (vod.rating ? vod.rating.value || '' : '').toString();
            videos.push({
                vod_id: vod.id,
                vod_name: vod.title,
                vod_pic: vod.pic.normal || vod.pic.large,
                vod_remarks: score.length > 0 ? '评分:' + score : '',
            });
        }
        return JSON.stringify({
            page: parseInt(page),
            pagecount: Math.ceil(data.total / 30),
            list: videos,
        });
    }
}

async function detail(id) {
    return '{}';
}

async function play(flag, id, flags) {
    return '{}';
}

async function search(wd, quick, pg) {
    return '{}';
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        category: category,
        detail: detail,
        play: play,
        search: search,
    };
}
