import React, { useState, useRef, useCallback } from 'react';
import {
  Box, Container, Input, Button, Text, Grid, Image, VStack, useToast, 
  Spinner, FormControl, FormLabel, Tabs, TabList, Tab, TabPanels, TabPanel,
  SimpleGrid, Heading, Icon, Flex, Badge, Slider, SliderTrack, SliderFilledTrack,
  SliderThumb, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
  NumberDecrementStepper, Popover, PopoverTrigger, PopoverContent, PopoverBody,
  Select, HStack, IconButton, ColorPicker, Radio, RadioGroup, Stack,
  Tooltip, useDisclosure
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Wand2, Smile, HelpCircle, Type, Move } from 'lucide-react';
import { ChromePicker } from 'react-color';
import TextCustomization from './TextCustomization';
import ExpressionRandomizer from './ExpressionRandomizer';

const MotionBox = motion(Box);

const templates = [
  {
    id: 1,
    name: "Gaming Thumbnail",
    url: "/templates/gaming.jpg",
    description: "Perfect for gaming videos",
    category: "Gaming"
  },
  {
    id: 2,
    name: "Tutorial Template",
    url: "/templates/tutorial.jpg",
    description: "Great for how-to videos",
    category: "Education"
  },
  {
    id: 3,
    name: "Vlog Template",
    url: "/templates/vlog.jpg",
    description: "Ideal for vlogs and personal content",
    category: "Lifestyle"
  },
  {
    id: 4,
    name: "Tech Review",
    url: "/templates/tech.jpg",
    description: "Best for product reviews",
    category: "Technology"
  }
];

const expressionControls = [
  { name: 'smile', min: -0.3, max: 1.3, default: 0, label: 'Smile' },
  { name: 'eyebrow', min: -10, max: 15, default: 0, label: 'Eyebrow' },
  { name: 'blink', min: -20, max: 5, default: 0, label: 'Blink' },
  { name: 'wink', min: 0, max: 25, default: 0, label: 'Wink' },
  { name: 'pupil_x', min: -15, max: 15, default: 0, label: 'Pupil X' },
  { name: 'pupil_y', min: -15, max: 15, default: 0, label: 'Pupil Y' },
  { name: 'rotate_pitch', min: -20, max: 20, default: 0, label: 'Pitch' },
  { name: 'rotate_yaw', min: -20, max: 20, default: 0, label: 'Yaw' },
  { name: 'rotate_roll', min: -20, max: 20, default: 0, label: 'Roll' }
];

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [expressionValues, setExpressionValues] = useState(
    expressionControls.reduce((acc, control) => {
      acc[control.name] = control.default;
      return acc;
    }, {})
  );

  const expressionDescriptions = {
    smile: "Adjusts the degree of smiling",
    eyebrow: "Adjusts the height and shape of the eyebrows",
    blink: "Controls the degree of eye closure",
    wink: "Controls the degree of one eye closing",
    pupil_x: "Adjusts the horizontal position of the pupils",
    pupil_y: "Adjusts the vertical position of the pupils",
    rotate_pitch: "Adjusts the up and down tilt of the face",
    rotate_yaw: "Adjusts the left and right turn of the face",
    rotate_roll: "Adjusts the tilt of the face to the left or right"
  };

  const [textSettings, setTextSettings] = useState({
    fontFamily: 'Arial',
    fontSize: 60,
    color: '#ffffff',
    outlineWidth: 4,
    position: 'middle'
  });
  
  const fileInputRef = useRef();
  const toast = useToast();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Image size should be less than 5MB',
          status: 'error',
          duration: 3000,
        });
        return;
      }

      setSelectedImage(file);
      setSelectedTemplate(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setSelectedImage(null);
    setImagePreview('');
  };

  

  const handleExpressionChange = (name, value) => {
    setExpressionValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateThumbnails = async () => {
    if (!inputText.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text for the thumbnail',
        status: 'error',
        duration: 3000,
      });
      return;
    }
  
    if (!selectedImage && !selectedTemplate) {
      toast({
        title: 'Error',
        description: 'Please either upload an image or select a template',
        status: 'error',
        duration: 3000,
      });
      return;
    }
    
    setIsLoading(true);
    try {

      const formData = new FormData();
      formData.append('text', inputText);
      formData.append('textSettings', JSON.stringify(textSettings));
  
      if (selectedImage instanceof File) {
        formData.append('image', selectedImage);
      } else if (selectedTemplate) {
        const templateName = selectedTemplate.url.split('/').pop().split('.')[0];
        formData.append('templateId', templateName);
      }
  
      // Add expression values to formData
      Object.entries(expressionValues).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to generate thumbnails');
      }
  
      const data = await response.json();
  
      // Ensure data.output is an array before proceeding
      if (Array.isArray(data.output)) {
        setThumbnails(data.output);
      } else {
        setThumbnails([]);
      }
  
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate thumbnails. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Box bg="gray.50" minH="100vh" py={12}>
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          {/* Hero Section */}
          <Box textAlign="center">
            <MotionBox
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Heading
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="black"
                bgGradient="linear(to-r, #9333FF, purple.400)"
                bgClip="text"
                mb={4}
              >
                AI Thumbnail Generator
              </Heading>
              <Text color="gray.600" fontSize="lg" maxW="2xl" mx="auto">
                Create eye-catching thumbnails with custom expressions using AI
              </Text>
            </MotionBox>
          </Box>

          {/* Main Content */}
          <Grid 
            templateColumns={{ base: "1fr", lg: "1fr 1fr" }} 
            gap={8}
            px={{ base: 4, md: 0 }}
          >
            {/* Input Section */}
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                bg="white"
                p={8}
                borderRadius="2xl"
                boxShadow="xl"
                border="1px"
                borderColor="gray.100"
              >
                <VStack spacing={8}>
                  <FormControl>
                    <FormLabel 
                      fontWeight="bold"
                      fontSize="lg"
                      color="gray.700"
                    >
                      Thumbnail Text
                    </FormLabel>
                    <Input
                      placeholder="Enter text for your thumbnail..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      size="lg"
                      borderRadius="xl"
                      borderWidth="2px"
                      _focus={{
                        borderColor: '#9333FF',
                        boxShadow: '0 0 0 1px #9333FF',
                      }}
                      _hover={{
                        borderColor: 'purple.200'
                      }}
                      fontSize="md"
                      h="60px"
                    />
                  </FormControl>

                  <Tabs isFitted variant="enclosed" width="full">
                    <TabList>
                      <Tab 
                        _selected={{ 
                          color: '#9333FF', 
                          borderColor: '#9333FF',
                          borderBottom: '3px solid',
                          fontWeight: 'bold'
                        }}
                        py={4}
                      >
                        <Icon as={Upload} mr={2} />
                        Upload Image
                      </Tab>
                      <Tab 
                        _selected={{ 
                          color: '#9333FF', 
                          borderColor: '#9333FF',
                          borderBottom: '3px solid',
                          fontWeight: 'bold'
                        }}
                        py={4}
                      >
                        <Icon as={ImageIcon} mr={2} />
                        Choose Template
                      </Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel>
                        <VStack spacing={6}>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            display="none"
                          />
                          <Button
                            onClick={() => fileInputRef.current.click()}
                            width="full"
                            height="100px"
                            colorScheme="purple"
                            variant="outline"
                            borderColor="#9333FF"
                            borderStyle="dashed"
                            borderWidth="2px"
                            _hover={{ bg: 'purple.50' }}
                          >
                            <VStack spacing={2}>
                              <Icon as={Upload} w={6} h={6} />
                              <Text>Click to upload image here</Text>
                              <Text fontSize="sm" color="gray.500">
                                Supports JPG, PNG (max 5MB)
                              </Text>
                            </VStack>
                          </Button>
                          {imagePreview && (
                            <Box position="relative" width="full">
                              <Image
                                src={imagePreview}
                                alt="Preview"
                                maxH="200px"
                                objectFit="contain"
                                width="full"
                                borderRadius="xl"
                                boxShadow="md"
                              />
                              <Button
                                size="sm"
                                position="absolute"
                                top={2}
                                right={2}
                                onClick={() => {
                                  setSelectedImage(null);
                                  setImagePreview('');
                                }}
                                colorScheme="red"
                                boxShadow="md"
                              >
                                Remove
                              </Button>
                            </Box>
                          )}
                        </VStack>
                      </TabPanel>

                      <TabPanel>
                        <SimpleGrid columns={2} spacing={4}>
                          {templates.map((template) => (
                            <Box
                              key={template.id}
                              position="relative"
                              borderWidth={selectedTemplate?.id === template.id ? "3px" : "1px"}
                              borderColor={selectedTemplate?.id === template.id ? "#9333FF" : "gray.200"}
                              borderRadius="xl"
                              overflow="hidden"
                              cursor="pointer"
                              onClick={() => handleTemplateSelect(template)}
                              transition="all 0.2s"
                              _hover={{ 
                                borderColor: '#9333FF', 
                                transform: 'translateY(-2px)',
                                shadow: 'lg' 
                              }}
                            >
                              <Image
                                src={template.url}
                                alt={template.name}
                                width="100%"
                                height="120px"
                                objectFit="cover"
                              />
                              <Box p={3} bg="white">
                                <Badge 
                                  colorScheme="purple" 
                                  mb={2}
                                >
                                  {template.category}
                                </Badge>
                                <Text 
                                  fontSize="sm" 
                                  fontWeight="bold"
                                  color="gray.700"
                                >
                                  {template.name}
                                </Text>
                                <Text 
                                  fontSize="xs" 
                                  color="gray.500"
                                  mt={1}
                                >
                                  {template.description}
                                </Text>
                              </Box>
                            </Box>
                          ))}
                        </SimpleGrid>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>


                  {(selectedImage || selectedTemplate) && (
                    <ExpressionRandomizer
                      expressionValues={expressionValues}
                      setExpressionValues={setExpressionValues}
                    />
                  )}

                  {/* Expression Controls */}
                  {(selectedImage || selectedTemplate) && (
                    <Box width="full">
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color="gray.700"
                        mb={4}
                      >
                        Expression Controls
                      </Text>
                      <VStack spacing={4} align="stretch">
                        {expressionControls.map((control) => (
                          <FormControl key={control.name}>
                            <FormLabel fontSize="sm" mb={2} >
                              {control.label}
                              <Tooltip 
                                label={expressionDescriptions[control.name]} 
                                placement="right"
                                hasArrow
                              >
                              <Icon 
                                as={HelpCircle} 
                                w={4} 
                                h={4} 
                                ml={2} 
                                verticalAlign="middle" 
                                color="gray.400" 
                                cursor="pointer"
                                />
                              </Tooltip>
                            </FormLabel>
                            <Flex gap={4}>
                              <Slider
                                value={expressionValues[control.name]}
                                min={control.min}
                                max={control.max}
                                step={0.1}
                                onChange={(val) => handleExpressionChange(control.name, val)}
                                flex="1"
                              >
                                <SliderTrack bg="purple.100">
                                  <SliderFilledTrack bg="#9333FF" />
                                </SliderTrack>
                                <SliderThumb boxSize={4} />
                              </Slider>
                              <NumberInput
                                value={expressionValues[control.name]}
                                onChange={(val) => handleExpressionChange(control.name, parseFloat(val))}
                                step={0.1}
                                min={control.min}
                                max={control.max}
                                width="80px"
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                            </Flex>
                          </FormControl>
                        ))}
                      </VStack>
                    </Box>
                  )}

                    {/* Add the TextCustomization component right here */}
                    {(selectedImage || selectedTemplate) && (
                    <TextCustomization
                    inputText={inputText}
                    imagePreview={imagePreview}
                    textSettings={textSettings}
                    setTextSettings={setTextSettings}
                  />
  )}

<Button
                    bg="#9333FF"
                    color="white"
                    onClick={generateThumbnails}
                    isLoading={isLoading}
                    width="full"
                    size="lg"
                    height="60px"
                    _hover={{ 
                      bg: 'purple.600',
                      transform: 'translateY(-2px)',
                      shadow: 'lg'
                    }}
                    _active={{
                      transform: 'translateY(0)',
                      shadow: 'md'
                    }}
                    fontWeight="bold"
                    fontSize="lg"
                    leftIcon={<Icon as={Wand2} />}
                    transition="all 0.2s"
                  >
                    Generate Thumbnails
                  </Button>
                </VStack>
              </Box>
            </MotionBox>

            {/* Output Section */}
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Box 
                bg="white" 
                p={8} 
                borderRadius="2xl" 
                boxShadow="xl"
                border="1px"
                borderColor="gray.100"
                minH="600px"
                display="flex"
                flexDirection="column"
              >
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color="gray.700"
                  mb={6}
                >
                  Generated Thumbnails
                </Text>
                
                {isLoading ? (
                  <Flex 
                    flex="1" 
                    align="center" 
                    justify="center"
                    direction="column"
                  >
                    <Spinner 
                      size="xl" 
                      color="#9333FF" 
                      thickness="4px"
                      speed="0.8s"
                    />
                    <Text 
                      mt={4} 
                      color="gray.600"
                      fontSize="lg"
                    >
                      Creating your thumbnails...
                    </Text>
                  </Flex>
                ) : thumbnails.length > 0 ? (
                  <SimpleGrid columns={1} spacing={6}>
                    {thumbnails.map((url, index) => (
                      <MotionBox
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Box
                          borderRadius="xl"
                          overflow="hidden"
                          boxShadow="lg"
                          transition="transform 0.2s"
                          _hover={{ 
                            transform: 'scale(1.02)',
                            shadow: 'xl'
                          }}
                        >
                          <Image
                            src={url}
                            alt={`Thumbnail ${index + 1}`}
                            width="100%"
                            height="auto"
                          />
                        </Box>
                      </MotionBox>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Flex
                    flex="1"
                    align="center"
                    justify="center"
                    borderWidth="2px"
                    borderStyle="dashed"
                    borderColor="gray.200"
                    borderRadius="xl"
                  >
                    <VStack spacing={4}>
                      <Icon 
                        as={ImageIcon} 
                        w={12} 
                        h={12} 
                        color="gray.400" 
                      />
                      <Text 
                        color="gray.500"
                        fontSize="lg"
                      >
                        Your thumbnails will appear here
                      </Text>
                    </VStack>
                  </Flex>
                )}
              </Box>
            </MotionBox>
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}