import React, { useEffect } from 'react';
import {Box, Container,Text,TabPanels,TabList,Tab,Tabs,TabPanel} from "@chakra-ui/react";
import LoginPage from '../components/auth/Login';
import SignupPage from '../components/auth/SignUp';
import { useHistory } from 'react-router-dom';



function HomePage() {

const history = useHistory();

useEffect(
 
  () => {
     const user = JSON.parse(localStorage.getItem("userInfo "));
     if(user){
       history.push("/chats");
     }
  }, [history]
)

  return <Container maxW={'xl'} centerContent>
    <Box d='flex'
    justifyContent='center'
    p={3}
    bg={"white"}
    w="100%"
    m="40px 0 15px 0"
    borderRadius="lg"
    borderWidth="1px"
    >
      <Text fontSize='4xl' fontFamily="Work sans" color="black">
        MERN-CHAT-APP
      </Text>
      <Tabs variant='soft-rounded' >
  <TabList>
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Sign up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <LoginPage/>
    </TabPanel>
    <TabPanel>
      <SignupPage/>
    </TabPanel>
  </TabPanels>
</Tabs>
    </Box>
    </Container>;
}

export default HomePage;