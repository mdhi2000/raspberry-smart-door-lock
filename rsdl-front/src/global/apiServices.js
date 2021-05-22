import jwt_decode from "jwt-decode"
import { loginPath } from "./paths"

const apiServices = {
  //baseUrl: 'https://scfapi.testprojects.ir/',
  baseUrl: "http://127.0.0.1:5000",

  test() {
    alert("ok")
  },

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
    if (newToken != null && newToken !== undefined) {
      this.storeValue("token", newToken)
    }
    return this
  },

  getToken() {
    return this.getValue("token")
  },

  clearToken() {
    localStorage.removeItem("token")
    return this
  },

  setRefreshToken(newToken) {
    if (newToken != null && newToken !== undefined) {
      this.storeValue("refreshToken", newToken)
    }
    return this
  },
  getRefreshToken() {
    return this.getValue("refreshToken")
  },
  clearRefreshToken() {
    localStorage.removeItem("refreshToken")
    return this
  },

  storeValue(key, value) {
    if (key === "" || key === undefined) {
      return
    }
    localStorage.setItem(key, value)
    return this
  },
  getValue(key) {
    if (key === "" || key === undefined) {
      return
    }
    return localStorage.getItem(key)
  },

  checkAuth() {
    const accessToken = this.getToken()
    const refreshToken = this.getRefreshToken()
    if (!accessToken || !refreshToken) {
      return false
    }

    try {
      const { exp } = jwt_decode(refreshToken)
      if (exp < new Date().getTime() / 1000) {
        return false
      }
    } catch (e) {
      return false
    }

    return true
  },

  setLoggedInUser(userInfo) {
    if (userInfo === null) {
      localStorage.removeItem("loggedInUser")
      return true
    }
    if ("password" in userInfo) {
      userInfo.password = ""
    }
    const jsonUserInfo = JSON.stringify(userInfo)
    this.storeValue("loggedInUser", jsonUserInfo)
  },

  getLoggedInUser(key = null) {
    const jsonUserInfo = this.getValue("loggedInUser")
    if (!jsonUserInfo) {
      return null
    }
    let userInfo = JSON.parse(jsonUserInfo)
    if (!key) {
      return userInfo
    }
    if (String(key) in userInfo) {
      return userInfo[key]
    }
    return undefined
  },

  logOutUser() {
    localStorage.clear()
    window.location.href = loginPath
  },

  request(onSuccess, onError) {
    const link = this.baseUrl + this._path
    let requestHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    }
    let oldToken = this.getToken()
    if (oldToken != null && oldToken !== undefined) {
      requestHeaders["Authorization"] = `${oldToken}`
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
        this.setToken(result.accessToken)
        this.setRefreshToken(result.refreshToken)
        onSuccess(result, this._data)
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
    }
    let oldToken = this.getToken()
    if (oldToken != null && oldToken !== undefined) {
      requestHeaders["Authorization"] = `${oldToken}`
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
    }
    let oldToken = this.getToken()
    if (oldToken != null && oldToken !== undefined) {
      requestHeaders["Authorization"] = `${oldToken}`
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
