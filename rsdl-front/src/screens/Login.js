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

// import { Link as RouterLink, useHistory } from "react-router-dom"
// import { Helmet } from "react-helmet"
// import * as Yup from "yup"
// import { Formik } from "formik"
// import { Box, Button, Container, Grid, Link, TextField, Typography } from "@material-ui/core"

// const Login = () => {
//   const history = useHistory()

//   return (
//     <>
//       <Helmet>
//         <title>Login | Material Kit</title>
//       </Helmet>
//       <Box
//         sx={{
//           backgroundColor: "background.default",
//           display: "flex",
//           flexDirection: "column",
//           height: "100%",
//           justifyContent: "center",
//         }}
//       >
//         <Container maxWidth="sm">
//           <Formik
//             initialValues={{
//               email: "demo@devias.io",
//               password: "Password123",
//             }}
//             validationSchema={Yup.object().shape({
//               email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
//               password: Yup.string().max(255).required("Password is required"),
//             })}
//             onSubmit={() => {
//               history.push('dashboard')
//             }}
//           >
//             {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
//               <form onSubmit={handleSubmit}>
//                 <Box sx={{ mb: 3 }}>
//                   <Typography color="textPrimary" variant="h2">
//                     Sign in
//                   </Typography>
//                   <Typography color="textSecondary" gutterBottom variant="body2">
//                     Sign in on the internal platform
//                   </Typography>
//                 </Box>
//                 <Grid container spacing={3}>
//                   <Grid item xs={12} md={6}>
//                     <Button
//                       color="primary"
//                       fullWidth
//                       // startIcon={<FacebookIcon />}
//                       onClick={handleSubmit}
//                       size="large"
//                       variant="contained"
//                     >
//                       Login with Facebook
//                     </Button>
//                   </Grid>
//                   <Grid item xs={12} md={6}>
//                     <Button
//                       fullWidth
//                       // startIcon={<GoogleIcon />}
//                       onClick={handleSubmit}
//                       size="large"
//                       variant="contained"
//                     >
//                       Login with Google
//                     </Button>
//                   </Grid>
//                 </Grid>
//                 <Box
//                   sx={{
//                     pb: 1,
//                     pt: 3,
//                   }}
//                 >
//                   <Typography align="center" color="textSecondary" variant="body1">
//                     or login with email address
//                   </Typography>
//                 </Box>
//                 <TextField
//                   error={Boolean(touched.email && errors.email)}
//                   fullWidth
//                   helperText={touched.email && errors.email}
//                   label="Email Address"
//                   margin="normal"
//                   name="email"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   type="email"
//                   value={values.email}
//                   variant="outlined"
//                 />
//                 <TextField
//                   error={Boolean(touched.password && errors.password)}
//                   fullWidth
//                   helperText={touched.password && errors.password}
//                   label="Password"
//                   margin="normal"
//                   name="password"
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   type="password"
//                   value={values.password}
//                   variant="outlined"
//                 />
//                 <Box sx={{ py: 2 }}>
//                   <Button
//                     color="primary"
//                     disabled={isSubmitting}
//                     fullWidth
//                     size="large"
//                     type="submit"
//                     variant="contained"
//                   >
//                     Sign in now
//                   </Button>
//                 </Box>
//                 <Typography color="textSecondary" variant="body1">
//                   Don&apos;t have an account?{" "}
//                   <Link component={RouterLink} to="/register" variant="h6">
//                     Sign up
//                   </Link>
//                 </Typography>
//               </form>
//             )}
//           </Formik>
//         </Container>
//       </Box>
//     </>
//   )
// }

// export default Login