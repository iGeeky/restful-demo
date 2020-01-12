import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    // console.info('>>>response data: ', JSON.stringify(res))
    if (!res.ok) {
      let data = null
      if (res.data && typeof (res.data) === 'string') {
        data = res.data
      }
      const errmsg = data || res.reason || 'unknow error'
      Message({
        message: errmsg,
        type: 'error',
        duration: 8 * 1000,
      })
      return res
    } else {
      return res
    }
  },
  error => {
    console.error('axios request failed! ' + error) // for debug
    let errmsg = null
    let reason = null
    if (typeof (error.response.data) === 'object' && !error.response.data.ok && typeof (error.response.data.data) === 'string') {
      errmsg = error.response.data.data
      reason = error.response.data.reason
    } else {
      errmsg = `error: ${error.message}`
    }
    Message({
      message: errmsg,
      type: 'error',
      duration: 5 * 1000,
    })

    if (reason === 'ERR_TOKEN_INVALID') {
      router.push(`/api/v1/rbac/login?redirect=${router.fullPath}`)
    }
    return Promise.reject(error)
  }
)

export default service
