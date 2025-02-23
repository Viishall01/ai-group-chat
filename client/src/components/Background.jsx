import BackgroundImage from "../assets/spidy.jpg"


const BackgroundDiv = styled.div`
  background-image: url(../assets/spidy.jpg);
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100%;
`;

import React from 'react'

const Background = ({children}) => {
  return (
    <BackgroundDiv>{children}</BackgroundDiv>
  )
}

export default Background