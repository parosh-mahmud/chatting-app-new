import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Modal, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure, ModalBody, ModalFooter, ModalHeader, Image, Text, Center } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { ChatState } from '../../Context/ChatProvider'; // Import the ChatState context

const ProfileModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = ChatState(); // Use useContext to access the user object from the ChatState context

  return (
    <>
      {children ? (
        <span onClick={onOpen}>
          {children}
        </span>
      ) : (
        <IconButton
          d={{ base: 'flex' }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent height="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
            textAlign="center" // Center the text horizontally
          >
            {user ? user.name : 'User'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center flexDirection="column" alignItems="center">
              <Image
                src={user.pic}
                borderRadius="full"
                boxSize="150px"
                alt={user.name}
              />

               <Text
                fontSize="3xl" 
                fontFamily="Work sans"
                padding="10px"
              >
                Email: {user.email}
              </Text>
            </Center>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
