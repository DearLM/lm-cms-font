export default{
  install(Vue, options){
    //将对象转换为string存入缓存
    Vue.prototype.setObjItemToStore = function (key, obj) {
        window.localStorage.setItem(key, JSON.stringify(obj));
    }

    //获取缓存对象
    Vue.prototype.getObjItemFromStore = function (key) {
      const item = window.localStorage.getItem(key);
      if(item){
          return JSON.parse(item);
      }
      return null;
    }

    //删除缓存
    Vue.prototype.removeObjItemFromStore = function (key) {
        window.localStorage.removeItem(key);
    }
  }
}
