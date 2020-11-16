//不同浏览器存放cookie的对象
const cookieMap = {};

// 设置cookie
const setCookie = (userAgent, cookies) => {
  let map = cookieMap[userAgent] || {};
  cookies.forEach((cookie) => {
    let [string, key, value] = cookie.match(/^(.*?)=(.*?);/);
    map[key] = value;
  });
  cookieMap[userAgent] = map;
}

// 获取cookie
const getCookie = (userAgent) => {
  let map = cookieMap[userAgent] || {};
  let cookie = '';
  for (let key in map) {
    cookie += `${key}=${map[key]}; `
  }
  return cookie;
}

let flag = false;
const proxyConfig = [{
  // 开发需要代理的请求列表
  context: ['/spe', '/backstage', '/sub', '/colPower'],
  // 跨域代理目标地址
  target: "http://39.99.207.216:8091",
  changeOrigin: true,
  // 监听代理请求，将cookie插入到请求头
  onProxyReq(proxyReq, req, res) {
    proxyReq.setHeader('Cookie', getCookie(req.get('User-Agent')));
  },
  // 监听代理返回，将返回头中的cookie存起来
  onProxyRes(proxyRes, req, res) {
    if (proxyRes.headers['set-cookie']) {
      setCookie(req.get('User-Agent'), proxyRes.headers['set-cookie']);
      if (flag) {
        flag = false;
        res.redirect('/');
      }
    }
    if (proxyRes.statusCode === 302) {
      flag = true;
    }
  }
}, {
  // 开发需要代理的请求列表
  context: ['/channel'],
  // 跨域代理目标地址
  target: "http://10.120.130.26:3000/mock/174",
  changeOrigin: true,
  // 监听代理请求，将cookie插入到请求头
  onProxyReq(proxyReq, req, res) {
    proxyReq.setHeader('Cookie', getCookie(req.get('User-Agent')));
  },
  // 监听代理返回，将返回头中的cookie存起来
  onProxyRes(proxyRes, req, res) {
    if (proxyRes.headers['set-cookie']) {
      setCookie(req.get('User-Agent'), proxyRes.headers['set-cookie']);
      if (flag) {
        flag = false;
        res.redirect('/');
      }
    }
    if (proxyRes.statusCode === 302) {
      flag = true;
    }
  }
}];

const proxy = {};

proxyConfig.forEach(config => {
  if (typeof config.context === 'string') {
    proxy[config.context] = config;
  } else if (Array.isArray(config.context)) {
    config.context.forEach(context => {
      proxy[context] = config;
    });
  }
});

module.exports = {
  // index: '',
  hot: true,
  historyApiFallback: true,
  inline: true,
  progress: true,
  proxy,
  open: true,
}
