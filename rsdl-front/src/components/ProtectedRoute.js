import React from "react"
import { Redirect, Route, useLocation } from "react-router"
import apiServices from "../global/apiServices"
import { loginPath } from "../global/paths"

const ProtectedRoute = ({ children, ...props }) => {
  const location = useLocation()
  return (
    <Route {...props}>
      {apiServices.checkAuth() ? children : <Redirect to={{pathname: loginPath, state:{from:location.pathname}}} />}
    </Route>
  )
}

export default ProtectedRoute
