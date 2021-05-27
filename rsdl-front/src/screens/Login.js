import { Box, Button, TextField } from "@material-ui/core"
import { Form, Formik } from "formik"
import React from "react"
import { Center } from "../components/StyleComponents"
import * as yup from "yup"
import yupPassword from "yup-password"
import apiServices from "../global/apiServices"
import { serverPaths } from "../global/paths"

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
  firstName: yup.string().required("This Field Is Required"),
  lastName: yup.string().required("This Field Is Required"),
  email: yup.string().email("Invalid Email").required("This Field Is Required"),
  password: yup.string().password().minSymbols(0).required("This Field Is Required"),
  confirmPassword: yup
    .string()
    .password()
    .minSymbols(0)
    .oneOf([yup.ref("password"), null])
    .required("This Field Is Required"),
})

const Login = () => {
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
            .path(serverPaths.userCreate)
            .data(values)
            .method("POST")
            .request(
              res => console.log(res),
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
                Register
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Center>
  )
}

export default Login
