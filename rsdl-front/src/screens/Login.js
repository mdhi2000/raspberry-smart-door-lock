import { Box, Button, TextField } from "@material-ui/core"
import { Form, Formik } from "formik"
import React from "react"
import { Center } from "../components/StyleComponents"
import * as yup from "yup"
import yupPassword from "yup-password"
import apiServices from "../global/apiServices"
import { dashboardPath, serverPaths } from "../global/paths"
import { useHistory, useLocation } from "react-router"

yupPassword(yup)

const fields = [
  {
    name: "email",
    label: "Email",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
  },
]

const validation = yup.object({
  email: yup.string().email("Invalid Email").required("This Field Is Required"),
  password: yup.string().password().minSymbols(0).required("This Field Is Required"),
})

const Login = () => {
  const history = useHistory()
  const location = useLocation()
  return (
    <Center height="100vh">
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validation}
        onSubmit={(values, actions) => {
          apiServices
            .path(serverPaths.login)
            .data(values)
            .method("POST")
            .request(
              res => {
                // apiServices.setToken(res.accessToken)
                history.push(location.state?.from || dashboardPath)
              },
              err => console.log(err)
            )
          actions.setSubmitting(false)
        }}
      >
        {props => (
          <Form>
            <Center flexDir="column">
              <h1>Login</h1>
              {fields.map(field => (
                <Box m={3}>
                  <TextField
                    name={field.name}
                    value={props.values[field.name]}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    error={props.touched?.[field.name] && props.errors?.[field.name]}
                    helperText={props.touched?.[field.name] && props.errors?.[field.name]}
                    variant="outlined"
                    className="register__fields"
                    {...field}
                  />
                </Box>
              ))}
              <Button type="submit" variant="contained" color="primary">
                Login
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Center>
  )
}

export default Login
