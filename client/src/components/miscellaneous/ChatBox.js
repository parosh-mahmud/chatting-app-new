// ChatBox.js

import { Flex } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
import { ChatState } from "../../Context/ChatProvider";

const ChatBox = ({ fetchAgain, setFetchAgain, showChatBox, toggleChatView }) => {
  const { selectedChat } = ChatState();

  return (
    <Flex
      d={{ base: selectedChat && showChatBox ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      ml="20px"
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
        toggleChatView={toggleChatView} // Pass the callback to SingleChat
      />
    </Flex>
  );
};

export default ChatBox;
