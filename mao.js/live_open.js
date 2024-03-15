import {_} from 'assets://js/lib/cat.js';

let siteKey = '';
let siteType = 0;
let UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36";
let live = '';

function getHeader() {
    let header = {};
    header['User-Agent'] = UA;
    return header;
}

async function getString(url, header) {
    let res = await req(url, {
        headers: header
    });
    return res.content;
}

let groups = {};
let channels = {};

let groupReg = new RegExp(".*group-title=\"(.?|.+?)\".*");
let logoReg = new RegExp(".*tvg-logo=\"(.?|.+?)\".*");
let nameReg = new RegExp(".*,(.+?)$");

function extract(line, reg) {
    let matches = line.match(reg);
    if (_.isEmpty(matches)) return "";
    return matches[1];
}

function m3u(text) {
    groups = {};
    channels = {};

    let channel = {'name':'', 'url':'', 'logo':''};
    let group = '默认';

    for(var line of text.split(/\n/)) {

        if (line.startsWith('#EXTM3U')) {
            continue;
        } else if (line.startsWith('#EXTINF:')) {
            group = extract(line, groupReg);
            let logo = extract(line, logoReg);
            let name = extract(line, nameReg);
            groups[group] = group;
            channel = {'name':name, 'url':'', 'logo':logo};
            if (_.isEmpty(channels[group])) {
                channels[group] = {};
            }
            if (_.isEmpty(channels[group][name])) {
                channels[group][name] = [];
            }
        } else if (line.indexOf('://') > -1) {
            channel['url'] = line;
            let channelName = channel['name'];
            channels[group][channelName].push(channel);
        }
    }

}

function txt(text) {

    groups = {};
    channels = {};

    let group = '默认';
    for(var line of text.split(/\n|<br>/)) {
        let split = line.split(',');
        if (split.length < 2) continue;
        if (line.indexOf('#genre#') > -1) {
            group = split[0];
            groups[group] = group;
            if (_.isEmpty(channels[group])) {
                channels[group] = {};
            }
        } else if (line.indexOf('://') > -1) {
            let name = split[0];
            let url = split[1];
            let channel = {'name':name, 'url':url, 'logo':''};
            if (_.isEmpty(channels[group][name])) {
                channels[group][name] = [];
            }
            channels[group][name].push(channel);
        }

    }
}

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
    let ext = cfg.ext;
    live = await getString(ext, getHeader());
    if (live.startsWith('#EXTM3U')) {
        m3u(live);
    } else {
        txt(live);
    }
}

let classes = [];
let filterObj = {};

async function home(filter) {
    for(var key in groups) {
        let oneCls = {'type_id': key, 'type_name': groups[key]};
        classes.push(oneCls);
    }
    return JSON.stringify({
        class: classes,
        filters: filterObj,
    });
}

async function homeVod() {
    return '{}';
}

async function category(tid, pg, filter, extend) {
    if (_.isEmpty(channels[tid])) return '{}';
    let videos = [];
    for (let channelName in channels[tid]) {
        let channel = channels[tid][channelName];
        let first = channel[0];
        let url = first['url'];
        let name = first['name'];
        let pic = _.isEmpty(first['logo']) ? 'https://epg.112114.xyz/logo/' + name.replace('-', '') + '.png' : first['logo'];
        let vodId = tid + '######' + name;
        videos.push({
            vod_id: vodId,
            vod_name: name,
            vod_pic: pic,
            vod_remarks: '',
        });
    }

    return JSON.stringify({
        page: parseInt(pg),
        pagecount: 1,
        limit: channels[tid].length,
        total: channels[tid].length,
        list: videos,
    });
}

async function detail(id) {

    let vodId = id;
    let vodArr = id.split('######');
    let group = vodArr[0];
    let name = vodArr[1];
    let pic = channels[group][name][0]['logo'];

    let playFroms = [];
    let playUrls = [];
    for(var key in channels[group][name]) {
        let one = channels[group][name][key];
        let url = one['url'];
        playFroms.push('线路' + (parseInt(key) + 1));
        playUrls.push('' + name + '$' + url);
    }

    let vod = {
        vod_id: vodId,
        vod_name: name,
        vod_pic: pic,
        type_name: '',
        vod_year: '',
        vod_area: '',
        vod_remarks: '',
        vod_actor: '',
        vod_director: '',
        vod_content: name,
        vod_play_from: playFroms.join('$$$'),
        vod_play_url: playUrls.join('$$$'),
    };
    let result = JSON.stringify({
        list: [vod],
    });

    return result;
}


async function play(flag, id, flags) {
    return JSON.stringify({
        parse: 0,
        url: id,
    });
}


async function search(wd, quick) {
    return '{}';
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        search: search,
    };
}