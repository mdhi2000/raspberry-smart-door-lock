import { Button } from "@material-ui/core"
import React from "react"
import { Center } from "../../components/StyleComponents"
import apiServices from "../../global/apiServices"
import { serverPaths } from "../../global/paths"

const Dashboard = () => {
  return (
    <Center height="100vh">
      <Button
        onClick={() =>
          apiServices
            .path(serverPaths.whoAmI)
            .method("GET")
            .request(
              res => console.log(res),
              err => console.log(err)
            )
        }
      >
        test
      </Button>
    </Center>
  )
}

export default Dashboard
