import React, { useEffect, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { Box, Button, Flex, Stack, Text, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import { getSender } from '../../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain, setFetchAgain, openChatBox }) => { // Pass openChatBox callback
  const { user, setChats, selectedChat, setSelectedChat, chats } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get('/api/chat', config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: 'Error Occurred',
        description: 'Failed to load chat',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats();
  }, [fetchAgain]);

  const chat = selectedChat !== null;

  const handleUserClick = () => {
    openChatBox(); // Open the ChatBox when a user is clicked
  };

  return (
    <Box
      p={3}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      boxShadow="md"
      justifyContent="space-between"
    >
      <Flex
        fontSize={{ base: '24px', md: '30px' }}
        fontFamily="Work Sans"
        borderBottom="1px solid gray"
        alignItems="center"
      >
        My Chats

        <GroupChatModal>
          <Button
            fontSize={{ base: '16px', md: '20px', lg: '24px' }}
            rightIcon={<AddIcon />}
            justifyContent="flex-end"
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Flex>

      <Flex
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        borderRadius="lg"
        overflow="hidden"
      >
        {chats ? (
          <Stack spacing={2} overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => {
                  setSelectedChat(chat);
                  handleUserClick(); // Handle user click to open ChatBox
                }}
                cursor="pointer"
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                p={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Flex>
    </Box>
  );
};

export default MyChats;
