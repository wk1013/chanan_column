// 时间截取
const showDate = (date) => {
  return date && date.slice(0, 10);
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

export {
  showDate,
  showData
}