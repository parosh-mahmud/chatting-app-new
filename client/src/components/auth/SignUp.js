import { FormControl, useToast, VStack, FormLabel, Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const SignupPage = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [picture, setPicture] = useState(null); // Initialize picture state to null
  const [loading, setLoading] = useState(false); // Initialize loading state to false
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const postDetails = (pics) => {
    setPicture(pics); // Update the picture state with the selected file
  };

  const submitHandler = async () => {
    setLoading(true);
    
    if (!name || !email || !password || !confirmPassword || !picture) {
      toast({
        title: 'Please fill in all fields and upload your picture',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }

    try {
      // Upload image to Cloudinary
      const data = new FormData();
      data.append('file', picture);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'parosh');
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/parosh/image/upload',
        {
          method: 'POST',
          body: data,
        }
      );
      if (!response.ok) {
        throw new Error('Error uploading image to Cloudinary');
      }
      const responseData = await response.json();
      const imageUrl = responseData.secure_url;

      // Create user on your server
      const userData = { name, email, password, pic: imageUrl };
      const userResponse = await axios.post('/api/user', userData);

      // Handle successful user creation
      toast({
        title: 'Account created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });

      localStorage.setItem('userInfo', JSON.stringify(userResponse.data));
      
      setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPicture(null);
    setLoading(false);
      history.push('/chats');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error creating account',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px" color="black">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type="password"
          placeholder="Confirm your Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormControl>
      <FormControl id="pic" isRequired>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/jpeg, image/png"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Signup
      </Button>
    </VStack>
  );
};

export default SignupPage;
