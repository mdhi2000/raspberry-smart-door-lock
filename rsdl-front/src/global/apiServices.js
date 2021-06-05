import axios from "axios"
import jwt_decode from "jwt-decode"
import { loginPath } from "./paths"

const apiServices = {
  baseUrl: "http://127.0.0.1:5000",

  accessToken: null,

  path(urlPath) {
    this._path = urlPath
    if (!urlPath.match(/^\//)) this._path = "/" + urlPath
    return this
  },

  method(methodName) {
    this._method = methodName
    return this
  },

  data(params) {
    this._data = params
    return this
  },

  setToken(newToken) {
    if (newToken) {
      this.accessToken = newToken
    }
    return this
  },

  getToken() {
    return this.accessToken
  },

  clearToken() {
    this.accessToken = null
    return this
  },

  // setRefreshToken(newToken) {
  //   if (newToken != null && newToken !== undefined) {
  //     this.storeValue("refreshToken", newToken)
  //   }
  //   return this
  // },
  // getRefreshToken() {
  //   return this.getValue("refreshToken")
  // },
  // clearRefreshToken() {
  //   localStorage.removeItem("refreshToken")
  //   return this
  // },

  // storeValue(key, value) {
  //   if (key === "" || key === undefined) {
  //     return
  //   }
  //   localStorage.setItem(key, value)
  //   return this
  // },
  // getValue(key) {
  //   if (key === "" || key === undefined) {
  //     return
  //   }
  //   return localStorage.getItem(key)
  // },

  refreshAuth(onSuccess, onError, prevReq) {
    fetch(this.baseUrl + "/auth/refresh", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        Accept: "application/json",
      },
      json: true,
      credentials: "include",
    })
      .then(res => res.json())
      .then(result => {
        if (result.statusCode === 403) {
          window.location.href = loginPath
          return false
        }
        this.setToken(result.accessToken)
        if (prevReq) {
          return prevReq.request(onSuccess, onError)
        }
        return true
      })
      .catch(error => {
        if (onError && typeof onError === "function") {
          onError?.(error, this._data)
        }
      })
    // axios
    //   .get(this.baseUrl + "/auth/refresh",{
    //     withCredentials:true
    //   })
    //   .then(res => res.json())
    //   .then(result => {
    //     if (result.statusCode === 403) {
    //       window.location.href = loginPath
    //       return false
    //     }
    //     this.setToken(result.accessToken)
    //     if (prevReq) {
    //       return prevReq.request(onSuccess, onError)
    //     }
    //     return true
    //   })
    //   .catch(error => {
    //     if (onError && typeof onError === "function") {
    //       onError?.(error, this._data)
    //     }
    //   })
  },

  checkAuth() {
    const accessToken = this.getToken()
    // const refreshToken = this.getRefreshToken()
    if (!accessToken) {
      console.log("no token")
      this.refreshAuth()
      return
    }

    // try {
    //   const { exp } = jwt_decode(refreshToken)
    //   if (exp < new Date().getTime() / 1000) {
    //     return false
    //   }
    // } catch (e) {
    //   return false
    // }

    return true
  },

  // setLoggedInUser(userInfo) {
  //   if (userInfo === null) {
  //     localStorage.removeItem("loggedInUser")
  //     return true
  //   }
  //   if ("password" in userInfo) {
  //     userInfo.password = ""
  //   }
  //   const jsonUserInfo = JSON.stringify(userInfo)
  //   this.storeValue("loggedInUser", jsonUserInfo)
  // },

  // getLoggedInUser(key = null) {
  //   const jsonUserInfo = this.getValue("loggedInUser")
  //   if (!jsonUserInfo) {
  //     return null
  //   }
  //   let userInfo = JSON.parse(jsonUserInfo)
  //   if (!key) {
  //     return userInfo
  //   }
  //   if (String(key) in userInfo) {
  //     return userInfo[key]
  //   }
  //   return undefined
  // },

  // logOutUser() {
  //   localStorage.clear()
  //   window.location.href = loginPath
  // },

  request(onSuccess, onError) {
    const link = this.baseUrl + this._path
    let requestHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      credentials: "include",
    }
    let oldToken = this.getToken()
    if (oldToken != null && oldToken !== undefined) {
      requestHeaders["Authorization"] = `Bearer ${oldToken}`
    }
    const requestMethod = this._method || "GET"
    let requestProps = {
      method: requestMethod,
      headers: requestHeaders,
      json: true,
    }
    if (requestMethod !== "GET") {
      requestProps.body = JSON.stringify(this._data || {})
    }
    return fetch(link, requestProps)
      .then(res => res.json())
      .then(result => {
        if (result.statusCode === 403) this.refreshAuth(onSuccess, onError, this)
        else {
          this.setToken(result.accessToken)
          // this.setRefreshToken(result.refreshToken)
          onSuccess(result, this._data)
        }
      })
      .catch(error => {
        if (onError && typeof onError === "function") {
          onError(error, this._data)
        }
      })
  },

  requestWithFile(onSuccess, onError) {
    const link = this.baseUrl + this._path
    let requestHeaders = {
      "cache-control": "no-cache",
      Accept: "application/json",
      credentials: "include",
    }
    let oldToken = this.getToken()
    if (oldToken != null && oldToken !== undefined) {
      requestHeaders["Authorization"] = `Bearer ${oldToken}`
    }
    const requestMethod = this._method || "POST"
    let requestProps = {
      method: requestMethod,
      headers: requestHeaders,
      processData: false,
      contentType: false,
      mimeType: "multipart/form-data",
    }
    if (requestMethod !== "GET") {
      const formData = new FormData()
      Object.keys(this._data).forEach(key => {
        formData.append(key, this._data[key])
      })
      requestProps.body = formData
    }
    return fetch(link, requestProps)
      .then(res => res.json())
      .then(result => {
        onSuccess(result, this._data)
      })
      .catch(error => {
        if (onError && typeof onError === "function") {
          onError(error, this._data)
        }
      })
  },

  downloadFile(onSuccess, onError) {
    const link = this.baseUrl + this._path
    let requestHeaders = {
      "Content-Type": "application/json",
      credentials: "include",
    }
    let oldToken = this.getToken()
    if (oldToken != null && oldToken !== undefined) {
      requestHeaders["Authorization"] = `Bearer ${oldToken}`
    }
    const requestMethod = this._method || "POST"
    let requestProps = {
      method: requestMethod,
      headers: requestHeaders,
      json: true,
    }
    if (requestMethod !== "GET") {
      requestProps.body = JSON.stringify(this._data || {})
    }
    return fetch(link, requestProps)
      .then(res => res.blob())
      .then(result => {
        onSuccess(result, this._data)
      })
      .catch(error => {
        if (onError && typeof onError === "function") {
          onError(error, this._data)
        }
      })
  },
}

export default apiServices
