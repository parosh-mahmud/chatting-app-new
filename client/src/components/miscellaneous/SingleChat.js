import React, { useEffect, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Flex, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from '../../config/ChatLogics';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from 'axios';
import "./style.css";
import io from "socket.io-client";
import ScrollableChat from './ScrollableChat';
var socket, selectedChatCompare;

const ENDPOINT = 'http://localhost:5000';




const SingleChat = ({ fetchAgain, setFetchAgain,toggleChatView }) => {
  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();
   



const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  



const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };


useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);



 useEffect(() => {
  socket.on("message received", (newMessageReceived) => {
    if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
      
      if(!notification.includes(newMessageReceived)){
        setNotification([newMessageReceived, ...notification]);
        setFetchAgain(!fetchAgain)
      }

    } else {
      setMessages([...messages, newMessageReceived]);
    }
  });
}, [selectedChatCompare, messages]);




  const typingHandler = (e) => {

  
    setNewMessage(e.target.value);

    

    if (!typing) {
      setTyping(true);
      
    }
  };
  

  return (
    <>
      {selectedChat ? (
        <Flex
          flexDirection="column"
          alignItems="stretch"
          h="100vh"
          w="100%"
          overflow="hidden"
        >
         

          <Flex
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            justifyContent="space-between"
            alignItems="center"
          >
          <IconButton
        d={{ base: "flex", md: "none" }}
        icon={<ArrowBackIcon />}
        onClick={() => {
          toggleChatView();
          setSelectedChat(""); // Clear selected chat
        }}
      />
            <Text>
              {selectedChat.isGroupChat
                ? selectedChat.chatName.toUpperCase()
                : getSender(user, selectedChat.users)}
            </Text>

            <Flex alignItems="center">
              {/* Conditional rendering based on selectedChat type */}
              {selectedChat.isGroupChat ? (
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              ) : (
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              )}
            </Flex>
          </Flex>

          <Flex
  d="flex"
  flexDir="column"
  justifyContent="flex-end"
  p={3}
  bg="#E8E8E8"
  w="100%"
  h="450px"
  borderRadius="lg"
  overflowY="auto"
>
  {loading ? (
    <Spinner
      size="xl"
      w={20}
      h={20}
      alignSelf="center"
      margin="auto"
    />
  ) : (
    <div className="messages">
      {/* Render the messages here */}
      <ScrollableChat messages={messages} />
    </div>
  )}

  <FormControl id="message-input" isRequired mt={3}>
    <div className={`typing-indicator ${istyping ? 'active' : ''}`}>
      <Input
        variant="filled"
        bg="#E0E0E0"
        placeholder="Enter a message.."
        value={newMessage}
        onChange={typingHandler}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e);
          }
        }}
      />
    </div>
  </FormControl>
</Flex>

        </Flex>
      ) : (
        <Flex
          d="flex"
          alignItems="center"
          justifyContent="center"
          h="100vh"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start a new conversation
          </Text>
        </Flex>
      )}
    </>
  );
};

export default SingleChat;
