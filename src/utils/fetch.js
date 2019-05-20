import 'whatwg-fetch'
import axios from 'axios';
import api from '@/api/';

const http = {
  get(url, params) {
    let options = {
      method: 'GET'
    }
    let req_url = params ? this.buildUrl(url, params) : url;
    return this.request(req_url, options)
  },

  getBlob(url, params){
    let options = {
      method: 'GET'
    }
    let req_url = params ? this.buildUrl(url, params) : url;
    return this.streamRequest(req_url, options)
  },

  post(url, data) {
    let options = {
      method: 'POST',
      headers: {
        "Content-type": "application/json;charset=UTF-8"
      }
    }
    if (data) options.body = JSON.stringify(data)
    return this.request(url, options)
  },

  postBlob(url, data){
    let options = {
      method: 'POST',
      responseType: 'blob',
      headers: {
        "Content-type": "application/json;charset=UTF-8",
      }
    }
    if (data) options.body = JSON.stringify(data)
    return this.streamRequest(url, options)
  },


  delete(url, params) {
    let options = {
      method: 'DELETE'
    }
    let req_url = params ? this.buildUrl(url, params) : url;
    return this.request(req_url, options)
  },

  put(url, data) {
    let options = {
      method: 'PUT'
    }
    if (data) options.body = JSON.stringify(data)
    return this.request(url, options)
  },
  
  plainPut(url,data){
    let options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      }
    }
    if (data) options.body = JSON.stringify(data)
    return this.request(url, options)
  },

  getPut(url,body){
    let newUrl = body ? this.buildUrl(url, body ) : url;
    if(JSON.stringify(body )=='{}'){newUrl=url}
      let options = { 
          method: 'PUT',
      }
    // if (body.body) options.body = JSON.stringify(body.body)
    return this.request(newUrl, options)
  },

  formPost(url,body){
      let newUrl = this.rebuildUrl(url,body.ids);
      let options = {
          method: 'POST',
          mode:'cors', 
          headers: {
              'Content-Type': 'application/json;charset=utf-8',
          }
      }
      if (body) options.body = JSON.stringify(body.param)
      return this.request(newUrl, options)
  },

  rebuildUrl(url,ids){
    const ps = [];

    if (ids) {
      for (let p in ids) {
        if (p) {
          ps.push('tagIds=' + encodeURIComponent(ids[p]));
        }
      }
    }
    return url + '?' + ps.join('&')
  },

  formPut(url,body,id){
    let newUrl = id ? this.buildUrl(url, id ) : url;
    let options = { 
        method: 'PUT',
        mode:'cors', 
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        }
    }
    if (body) options.body = JSON.stringify(body)
    return this.request(newUrl, options)
  },

  putJson(url, data) {
    let options = {
      method: 'PUT',
      headers: {
          'Content-Type': "application/json;charset=UTF-8"
      }
    }
    if (data) options.body = JSON.stringify(data)
    return this.request(url, options)
  },

  postGet(url, body,) { // POST请求
    let newUrl = body.url ? this.build(url, body.url ) : url
    if(JSON.stringify(body.url )=='{}'){newUrl=url}
      let options = { 
          method: 'POST',
          mode:'cors', 
          headers: {
              'Content-Type': 'multipart/form-data;charset=utf-8',
          }
      }
    if (body.body) options.body = JSON.stringify(body.body)
    return this.require(newUrl, options)
  },

  postForm(url, data, flag) {
    let options = {
      method: 'POST'
    }
    if (data) options.body = flag ? this.buildFormData(data) : new FormData(data);
    return this.request(url, options)
  },
  head(url) {
    let options = {
      method: 'Head'
    }
    return this.request(url, options)
  },
  buildUrl(url, params) {
    const ps = []
    if (params) {
      for (let p in params) {
        if (p) {
          ps.push(p + '=' + encodeURIComponent(params[p]));
        }
      }
    }
    return url + '?' + ps.join('&')
  },
  buildFormData(params) {
    if (params) {
      const data = new FormData()
      for (let p in params) {
        if (p) {
          data.append(p, params[p])
        }
      }
      return data;
    }
  },
  streamRequest(url, options){
    options.headers = options.headers;
    options.credentials = 'same-origin';
    return fetch(url, options)
    .then(function (response){
      switch (response.status) {
        case 200:
          return response.arrayBuffer();
        case 500:
          this.$message.error('下载异常');
          return response;
        default:
          return response;
      }
    })
  },
  request(url, options) {
    options.headers = options.headers;
    options.credentials = 'same-origin'
    return fetch(url, options)
      .then(function (response) {
        switch (response.status) {
          case 200:
            return response.json();
          case 401:
            let ret=response.status=='401'?{success: false,data: []}:response.json();
            
            api.loginInfo({}).then(rest => {
                const nData = rest.data;

                var ExportForm = document.createElement("FORM");  
                document.body.appendChild(ExportForm);  
                ExportForm.method = "POST";
                var newElement_o = document.createElement("input");  
                newElement_o.setAttribute("name", "SAMLRequest");  
                newElement_o.setAttribute("type", "hidden"); 
                newElement_o.value = nData.samlBody;
                ExportForm.append(newElement_o)
                var newElement_t = document.createElement("input");  
                newElement_t.setAttribute("name", "RelayState");  
                newElement_t.setAttribute("type", "hidden"); 
                newElement_t.value = nData.callbackUrl;
                ExportForm.append(newElement_t)
                ExportForm.action = nData.idmUrl; 
                ExportForm.submit();
            })
          return ret;
          case 500: 
            this.commonAlert();
          case 504:
            this.commonAlert();
            return response
          default:
            return response
        }
      })
      .catch(err => {
          // window.location.href='/';//开发环境可将此方注视
      });
  },
  commonAlert(){
    this.$notify({
        title: '错误',
        message: '发生异常，请联系相关人员处理',
        type: 'error'
    });
  },
  exportFile(url,params){
    return axios({
        method: "get",
        url: buildUrl(url,params), // 请求地址
        responseType: "blob", // 表明返回服务器返回的数据类型
        headers: {
            "Content-Type": "application/json"
        }
    })
  }
}
export default http;
