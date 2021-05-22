import React from "react"
import { useHistory } from "react-router"
import styled from "styled-components"
import { StyledButton } from "../components/StyleComponents"

const StyledContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Home = () => {
  const history = useHistory()
  return (
    <StyledContainer>
      <h1>Welcome to Safe Home Security</h1>
      <div>
        <StyledButton onClick={() => history.push("/login")} background="#5b77b7">
          Login
        </StyledButton>
        <StyledButton onClick={() => history.push("/register")}>register</StyledButton>
      </div>
    </StyledContainer>
  )
}

export default Home
