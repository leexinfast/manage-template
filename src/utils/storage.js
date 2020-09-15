export function setItemTime(key, value, expire) {
    var curTime = new Date().getTime();
    var expireTime = 1000 * expire; //秒
    localStorage.setItem(key, JSON.stringify({
      data: value,
      curTime: curTime,
      expireTime: expireTime
    }));
    console.log(`设置${key}成功`)
  }
  
  export function getItemTime(key) {
    if (localStorage.getItem(key)) {
      var data = localStorage.getItem(key);
      var dataObj = JSON.parse(data);
      if ((new Date().getTime() - dataObj.curTime) > dataObj.expireTime) {
        console.log('信息过期')
        localStorage.removeItem(key)
      } else {
        console.log(dataObj.data)
        return dataObj.data
      }
    } else {
      console.log('nokey')
    }
  }