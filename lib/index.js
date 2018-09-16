"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file jfetchs-memory
 *
 * jfetchs memory store
 * @author
 *   zswang (http://weibo.com/zswang)
 * @version 0.0.6
 * @date 2018-09-16
 */
var MemoryStore = /** @class */ (function () {
    function MemoryStore() {
        /**
         * 缓存开始时间
         */
        this.expireAt = {};
        /**
         * 缓存数据
         */
        this.fetchData = {};
    }
    /**
     * 加载缓存数据 load data from cache
     * @param key 键值
     * @return 返回获取到的数据
     * @example store():base
      ```js
      var store = new jfetchs.MemoryStore()
  store.save('k1', 'data1', 1).then(reply => {
    console.log(reply)
    // > true
  })
  store.load('k1').then(reply => {
    console.log(reply)
    // > data1
  })
  store.remove('k1').then(reply => {
    console.log(reply)
    // > true
  })
  store.remove('k1').then(reply => {
    console.log(reply)
    // > false
  })
  store.load('k1').then(reply => {
    console.log(reply)
    // > undefined
  })
      ```
     * @example store():expire
      ```js
      var store2 = new jfetchs.MemoryStore()
  store2.save('k2', 'data2', 0.1).then(reply => {
    console.log(reply)
    // > true
  })
  store2.load('k2').then(reply => {
    console.log(reply)
    // > data2
  })
  setTimeout(() => {
    store2.load('k2').then(reply => {
      console.log(reply)
      // > undefined
      // * done
    })
  }, 200)
      ```
     */
    MemoryStore.prototype.load = function (key) {
        if (key in this.expireAt) {
            if (Date.now() <= this.expireAt[key]) {
                return Promise.resolve(this.fetchData[key]);
            }
            this.remove(key);
        }
        return Promise.resolve(undefined);
    };
    /**
     * 保存缓存数据 save data to cache
     * @param key 键值
     * @param data 保存的数据
     * @param expire 过期时间，单位秒
     * @return 返回保存是否成功
     */
    MemoryStore.prototype.save = function (key, data, expire) {
        this.fetchData[key] = data;
        this.expireAt[key] = Date.now() + expire * 1000;
        return Promise.resolve(true);
    };
    /**
     * 移除缓存数据 remove this cache data
     * @param key 键值
     * @return 返回移除是否成功
     */
    MemoryStore.prototype.remove = function (key) {
        if (!(key in this.expireAt)) {
            return Promise.resolve(false);
        }
        delete this.expireAt[key];
        delete this.fetchData[key];
        return Promise.resolve(true);
    };
    /**
     * 回收过期的资源
     * @example store():gc
      ```js
      var store3 = new jfetchs.MemoryStore()
  store3.save('k3-1', 'data3-1', 0.1)
  store3.save('k3-2', 'data3-2', 2)
  setTimeout(() => {
    store3.gc().then(reply => {
      console.log(JSON.stringify(reply))
      // > ["k3-1"]
      // * done
    })
  }, 200)
      ```
     */
    MemoryStore.prototype.gc = function () {
        var _this = this;
        return Promise.all(Object.keys(this.expireAt)
            .map(function (key) {
            if (Date.now() > _this.expireAt[key]) {
                return _this.remove(key).then(function () {
                    return key;
                });
            }
            return null;
        })
            .filter(function (item) { return item !== null; }));
    };
    return MemoryStore;
}());
exports.MemoryStore = MemoryStore;
