import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer"; 
import MyChats from "../components/miscellaneous/MyChats";
import ChatBox from "../components/miscellaneous/ChatBox";
import { useState } from "react";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false); // Track whether to show ChatBox
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Function to toggle between MyChats and ChatBox views
  const toggleChatView = () => {
    setShowChatBox(!showChatBox);
  };

  // Function to open the ChatBox
  const openChatBox = () => {
    setShowChatBox(true);
  };

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />} 
      <Flex
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && (
          <>
            {isMobile ? (
              // Mobile view: Show MyChats or ChatBox conditionally based on state
              showChatBox ? (
                <ChatBox
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  showChatBox={showChatBox}
                  toggleChatView={toggleChatView}
                />
              ) : (
                <MyChats
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  openChatBox={openChatBox} // Pass openChatBox in mobile view
                />
              )
            ) : (
              // Desktop view: Always show both MyChats and ChatBox side by side
              <>
                <MyChats
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  openChatBox={openChatBox} // Pass openChatBox in desktop view
                />
                <ChatBox
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  toggleChatView={toggleChatView} // Pass toggleChatView in desktop view
                />
              </>
            )}
          </>
        )}
      </Flex>
    </div>
  );
};

export default ChatPage;
