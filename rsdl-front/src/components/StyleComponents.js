import styled from "styled-components"

export const Center = styled.div`
  display: flex;
  flex-direction: ${p => p.flexDir || "row"};
  align-items: center;
  justify-content: center;
  height: ${p => p.height || "100%"};
  width: ${p => p.width || "100%"};
`

export const StyledButton = styled.button`
  border-radius: 8px;
  border: 2px solid #5b77b7;
  background: ${p => p.background || "transparent"};
  margin: 2rem;
  padding: 0.5rem;
  width: 7rem;
  outline: none;
`