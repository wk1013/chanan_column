// 时间截取
const showDate = (date) => {
  return date && date.slice(0, 10).replace(/-/g, "/");
}

// 标题标红
const showData = (key, date) => {
  if (key == "") {
    return date;
  } else {
    return date.replace(
      key,
      '<font color="red">' + key + "</font>"
    );
  }
}

// 用于文件格式展示图标
const formatList = {
  word: ['doc', 'docx'],
  excel: ['xls', 'xlsx'],
  ppt: ['ppt', 'pptx'],
  pdf: ['pdf'],
  caj: ['caj'],
  epub: ['epub'],
  xml: ['xml'],
  txt: ['txt'],
  wps: ['wps'],
  zip: ['rar', 'zip'],
  bmp: ['bmp'],
  jpeg: ['jpg', 'png', 'tif', 'jpeg', 'webp'],
  gif: ['gif'],
  audio: ['wav', 'mp3', 'wma', 'aac', 'flac'],
  video: ['avi', 'mov', 'swf', 'flv', 'mp4', 'mpg', 'mpeg', 'rm', 'rmvb'],
};

//线上公共域名地址
const publiceUrl = "http://47.92.202.73/";

export {
  showDate,
  showData,
  formatList,
  publiceUrl
}