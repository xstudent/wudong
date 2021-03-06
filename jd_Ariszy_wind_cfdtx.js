/**
*
  Name:财富岛提现 (修改自https://raw.githubusercontent.com/pxylen/dog_jd/master/jx_cfdtx.js，cron设置建议为 59 59 23 * * * )
  Address: 京喜App ====>>>> 全民赚大钱

 * 获取京喜tokens方式
 * 打开京喜农场，手动完成任意任务，必须完成任务领到水滴，提示获取cookie成功
 * 打开京喜工厂，收取电力，提示获取cookie成功
 * 打开京喜财富岛，手动成功提现一次，提示获取cookie成功
 * 手动任意完成，提示获取cookie成功即可，然后退出跑任务脚本

  hostname = wq.jd.com, m.jingxi.com

  # quanx
  [rewrite_local]
  ^https\:\/\/wq\.jd\.com\/cubeactive\/farm\/dotask url script-request-header https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js
  ^https\:\/\/m\.jingxi\.com\/dreamfactory\/generator\/CollectCurrentElectricity url script-request-header https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js
  ^https\:\/\/m\.jingxi\.com\/jxcfd\/consume\/CashOut url script-request-header https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js

  # loon
  [Script]
  http-request ^https\:\/\/wq\.jd\.com\/cubeactive\/farm\/dotask script-path=https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js, requires-body=false, timeout=10, tag=京喜token
  http-request ^https\:\/\/m\.jingxi\.com\/dreamfactory\/generator\/CollectCurrentElectricity script-path=https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js, requires-body=false, timeout=10, tag=京喜token
  http-request ^^https\:\/\/m\.jingxi\.com\/jxcfd\/consume\/CashOut script-path=https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js, requires-body=false, timeout=10, tag=京喜token

  # surge
  [Script]
  京喜token = type=http-request,pattern=^https\:\/\/wq\.jd\.com\/cubeactive\/farm\/dotask,requires-body=0,max-size=0,script-path=https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js
  京喜token = type=http-request,pattern=^https\:\/\/m\.jingxi\.com\/dreamfactory\/generator\/CollectCurrentElectricity,requires-body=0,max-size=0,script-path=https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js
  京喜token = type=http-request,pattern=^https\:\/\/m\.jingxi\.com\/jxcfd\/consume\/CashOut,requires-body=0,max-size=0,script-path=https://raw.githubusercontent.com/whyour/hundun/master/quanx/jx_tokens.js

*
**/

const $ = new Env("京喜财富岛提现");
const JD_API_HOST = "https://m.jingxi.com/";
const jdCookieNode = $.isNode() ? require("./jdCookie.js") : "";
const jdTokenNode = $.isNode() ? require('./jdJxncTokens.js') : '';
$.result = [];
$.cookieArr = [];
$.currentCookie = '';
$.tokenArr = [];
$.currentToken = {};
$.strPhoneID = '';
$.strPgUUNum = '';
$.userName = '';

!(async () => {
  if (!getCookies()) return;
  if (!getTokens()) return;
  for (let i = 0; i < $.cookieArr.length; i++) {
    $.currentCookie = $.cookieArr[i];
    $.currentToken = $.tokenArr[i];
    if ($.currentCookie) {
      $.userName =  decodeURIComponent($.currentCookie.match(/pt_pin=(.+?);/) && $.currentCookie.match(/pt_pin=(.+?);/)[1]);
      $.log(`\n开始【京东账号${i + 1}】${$.userName}`);    
       let now = new Date()
      $.log(`开始时间：${$.time('yyyy-MM-dd HH:mm:ss')}.${now.getMilliseconds()}`)
    if (now.getSeconds() == 59) {
      await $.wait(1000 - now.getMilliseconds())
    } else if (now.getSeconds() == 58) {
      await $.wait(2000 - now.getMilliseconds())
    }
      await cashOut();

    }
  }
  await showMsg();
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done());

function cashOut() {
  const body = `ddwPaperMoney=100000&strPoolName=jxcfd2_exchange_hb_202108&strPgtimestamp=${$.currentToken.timestamp}&strPhoneID=${$.currentToken.phoneid}&strPgUUNum=${$.currentToken.farm_jstoken}`
  const MyRequest = taskUrl(body)
  return new Promise((resolve) => {
   $.get(MyRequest,async(error, response, data) =>{
    try{
        const result = JSON.parse(data)
          $.sErrMsg = result.sErrMsg == "" ? "今天手气太棒了" : result.sErrMsg
          $.log($.sErrMsg)
$.result.push($.userName,$.sErrMsg)
          
        } catch (e) {
          $.logErr(e, resp);
        } finally {
          resolve();
        }
      }
    );
  });
} 

function taskUrl(body) {
  return {
    url: `https://m.jingxi.com/jxbfd/user/ExchangePrize?strZone=jxbfd&bizCode=jxcfd&source=jxcfd&dwType=3&dwLvl=1&_cfd_t=${Date.now()}&${body}&_=${Date.now()}&sceneval=2&g_login_type=1&g_ty=ls`,
    method: "get",
    headers: {
      Cookie: $.currentCookie,
      Accept: "*/*",
      Connection: "keep-alive",
      Referer:"https://st.jingxi.com/fortune_island/index2.html?ptag=138631.26.55&trace=",
      "Accept-Encoding": "gzip, deflate, br",
      Host: "m.jingxi.com",
      "User-Agent":"jdpingou;iPhone;4.4.0;14.4;59180d8abc8c5059b8afd3380a7d9815fb15ed04;network/4g;model/iPhone12,1;appBuild/100456;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/0;hasOCPay/0;supportBestPay/0;session/478;pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
      "Accept-Language": "zh-cn",
    },
  };
}

function getCookies() {
  if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
          $.cookiesArr.push(jdCookieNode[item])
     })
  } else {
    $.cookieArr = [
          $.getdata("CookieJD"),
          $.getdata("CookieJD2"),
          ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
  
  if (!$.cookieArr[0]) {
    $.msg(
      $.name,
      "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取",
      "https://bean.m.jd.com/",
      {
        "open-url": "https://bean.m.jd.com/",
      }
    );
    return false;
  }
  return true;
}

function getTokens() {
  if ($.isNode()) {
    Object.keys(jdTokenNode).forEach((item) => {
      $.tokenArr.push(jdTokenNode[item] ? JSON.parse(jdTokenNode[item]) : '{}');
    })
  } else {
    $.tokenArr = JSON.parse($.getdata('jx_tokens') || '[]');
  }
  if (!$.tokenArr[0]) {
    $.msg(
      $.name,
      "【⏰提示】请先获取京喜Token\n获取方式见脚本说明"
    );
    return false;
  }
  return true;
}

function showMsg() {
  return new Promise((resolve) => {
    if ($.notifyTime) {
      const notifyTimes = $.notifyTime.split(",").map((x) => x.split(":"));
      const now = $.time("HH:mm").split(":");
      $.log(`\n${JSON.stringify(notifyTimes)}`);
      $.log(`\n${JSON.stringify(now)}`);
      if (
        notifyTimes.some((x) => x[0] === now[0] && (!x[1] || x[1] === now[1]))
      ) {
        $.msg($.name, "", `\n${$.result.join("\n")}`);
      }
    } else {
      $.msg($.name, "", `\n${$.result.join("\n")}`);
    }
    resolve();
  });
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie')
      return [];
    }
  }
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
