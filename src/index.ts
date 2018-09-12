import { ICacheStore } from 'jfetchs-util'

/*<jdists encoding="ejs" data="../package.json">*/
/**
 * @file <%- name %>
 *
 * <%- description %>
 * @author
     <% (author instanceof Array ? author : [author]).forEach(function (item) { %>
 *   <%- item.name %> (<%- item.url %>)
     <% }); %>
 * @version <%- version %>
     <% var now = new Date() %>
 * @date <%- [
      now.getFullYear(),
      now.getMonth() + 101,
      now.getDate() + 100
    ].join('-').replace(/-1/g, '-') %>
 */
/*</jdists>*/

export class MemoryStore<T> implements ICacheStore<T> {
  /**
   * 缓存开始时间
   */
  private expireAt: { [key: string]: number } = {}
  /**
   * 缓存数据
   */
  private fetchData: { [key: string]: T } = {}

  /**
   * 加载缓存数据 load data from cache
   * @param key 键值
   * @return 返回获取到的数据
   * @example store():base
    ```js
    (*<jdists import="?debug[desc='base']" />*)
    ```
   * @example store():expire
    ```js
    (*<jdists import="?debug[desc='expire']" />*)
    ```
   */
  load(key: string): Promise<T> {
    if (key in this.expireAt) {
      if (Date.now() <= this.expireAt[key]) {
        return Promise.resolve(this.fetchData[key])
      }
      this.remove(key)
    }
    return Promise.resolve(undefined)
  }
  /**
   * 保存缓存数据 save data to cache
   * @param key 键值
   * @param data 保存的数据
   * @param expire 过期时间，单位秒
   * @return 返回保存是否成功
   */
  save(key: string, data: T, expire: number): Promise<boolean> {
    this.fetchData[key] = data
    this.expireAt[key] = Date.now() + expire * 1000
    return Promise.resolve(true)
  }
  /**
   * 移除缓存数据 remove this cache data
   * @param key 键值
   * @return 返回移除是否成功
   */
  remove(key: string): Promise<boolean> {
    if (!(key in this.expireAt)) {
      return Promise.resolve(false)
    }
    delete this.expireAt[key]
    delete this.fetchData[key]
    return Promise.resolve(true)
  }
}

/*<remove>*/
const jfetchs = {
  MemoryStore: MemoryStore,
}

/*<debug desc="base">*/
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
/*</debug>*/

/*<debug desc="expire">*/
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
/*</debug>*/
/*</remove>*/
