import React from 'react';
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Select,
  Slider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  RadioGroup,
  Radio,
  Text,
  Flex,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useMediaQuery,
  Heading,
  Tooltip,
  IconButton,
  VStack,
  Center,
} from '@chakra-ui/react';
import { ChromePicker } from 'react-color';
import { InfoIcon } from '@chakra-ui/icons';

function TextCustomization({ inputText, imagePreview, textSettings, setTextSettings }) {
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  const fontSizes = {
    min: 20,
    max: 120,
    default: 60
  };

  return (
    <Stack 
      spacing={8} 
      direction={isMobile ? 'column' : 'row'} 
      w="full"
      bg="gray.50"
      p={6}
      borderRadius="xl"
    >
      {/* Left Side: Text Customization Controls */}
      <Box 
        flex={1} 
        bg="white" 
        p={8} 
        borderRadius="xl" 
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      >
        <VStack spacing={6} align="stretch">
          <Heading size="md" color="gray.700">Text Customization</Heading>

          {/* Font Family */}
          <FormControl>
            <Flex justify="space-between" align="center">
              <FormLabel mb={0} color="gray.700" fontWeight="medium">Font Family</FormLabel>
              <Tooltip label="Choose a font style for your text" placement="top">
                <IconButton
                  icon={<InfoIcon />}
                  size="sm"
                  variant="ghost"
                  aria-label="Font family information"
                />
              </Tooltip>
            </Flex>
            <Select
              mt={2}
              value={textSettings.fontFamily}
              onChange={(e) => setTextSettings({ ...textSettings, fontFamily: e.target.value })}
              bg="white"
              borderColor="gray.300"
              _hover={{ borderColor: "purple.400" }}
            >
              <option value="Arial">Arial</option>
              <option value="Impact">Impact</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Verdana">Verdana</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
            </Select>
          </FormControl>

          {/* Font Size */}
          <FormControl>
            <Flex justify="space-between" align="center">
              <FormLabel mb={0} color="gray.700" fontWeight="medium">Font Size</FormLabel>
              <Tooltip label="Adjust the size of your text" placement="top">
                <IconButton
                  icon={<InfoIcon />}
                  size="sm"
                  variant="ghost"
                  aria-label="Font size information"
                />
              </Tooltip>
            </Flex>
            <Flex gap={4} mt={2}>
              <Slider
                value={textSettings.fontSize}
                min={fontSizes.min}
                max={fontSizes.max}
                onChange={(value) => setTextSettings({ ...textSettings, fontSize: value })}
                flex={1}
              >
                <SliderTrack bg="gray.200">
                  <SliderFilledTrack bg="purple.500" />
                </SliderTrack>
                <SliderThumb boxSize={6} shadow="md" />
              </Slider>
              <NumberInput
                value={textSettings.fontSize}
                onChange={(value) => setTextSettings({ ...textSettings, fontSize: parseInt(value) })}
                min={fontSizes.min}
                max={fontSizes.max}
                width="100px"
                borderColor="gray.300"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
          </FormControl>

          {/* Text Color */}
          <FormControl>
            <Flex justify="space-between" align="center">
              <FormLabel mb={0} color="gray.700" fontWeight="medium">Text Color</FormLabel>
              <Tooltip label="Pick a color for your text" placement="top">
                <IconButton
                  icon={<InfoIcon />}
                  size="sm"
                  variant="ghost"
                  aria-label="Color picker information"
                />
              </Tooltip>
            </Flex>
            <Box mt={2} p={4} border="1px" borderColor="gray.200" borderRadius="md">
              <ChromePicker
                color={textSettings.color}
                onChange={(color) => setTextSettings({ ...textSettings, color: color.hex })}
                styles={{ default: { picker: { width: '100%', boxShadow: 'none' } } }}
              />
            </Box>
          </FormControl>

          {/* Outline Width */}
          <FormControl>
            <Flex justify="space-between" align="center">
              <FormLabel mb={0} color="gray.700" fontWeight="medium">Outline Width</FormLabel>
              <Tooltip label="Adjust the thickness of text outline" placement="top">
                <IconButton
                  icon={<InfoIcon />}
                  size="sm"
                  variant="ghost"
                  aria-label="Outline width information"
                />
              </Tooltip>
            </Flex>
            <Flex gap={4} mt={2}>
              <Slider
                value={textSettings.outlineWidth}
                min={0}
                max={10}
                onChange={(value) => setTextSettings({ ...textSettings, outlineWidth: value })}
                flex={1}
              >
                <SliderTrack bg="gray.200">
                  <SliderFilledTrack bg="purple.500" />
                </SliderTrack>
                <SliderThumb boxSize={6} shadow="md" />
              </Slider>
              <NumberInput
                value={textSettings.outlineWidth}
                onChange={(value) => setTextSettings({ ...textSettings, outlineWidth: parseInt(value) })}
                min={0}
                max={10}
                width="100px"
                borderColor="gray.300"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Flex>
          </FormControl>

          {/* Text Position */}
          <FormControl>
            <Flex justify="space-between" align="center">
              <FormLabel mb={0} color="gray.700" fontWeight="medium">Text Position</FormLabel>
              <Tooltip label="Choose where to place your text" placement="top">
                <IconButton
                  icon={<InfoIcon />}
                  size="sm"
                  variant="ghost"
                  aria-label="Text position information"
                />
              </Tooltip>
            </Flex>
            <RadioGroup
              mt={2}
              value={textSettings.position}
              onChange={(value) => setTextSettings({ ...textSettings, position: value })}
            >
              <Stack direction="row" spacing={4}>
                <Radio 
                  value="top" 
                  colorScheme="purple"
                  borderColor="gray.300"
                >
                  Top
                </Radio>
                <Radio 
                  value="middle" 
                  colorScheme="purple"
                  borderColor="gray.300"
                >
                  Middle
                </Radio>
                <Radio 
                  value="bottom" 
                  colorScheme="purple"
                  borderColor="gray.300"
                >
                  Bottom
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </VStack>
      </Box>

      {/* Right Side: Letter Preview */}
      <Box 
        flex={1} 
        bg="white" 
        p={8} 
        borderRadius="xl" 
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      >
        <Heading size="md" color="gray.700" mb={6}>Preview</Heading>
        <Center
          bg="gray.900"
          w="full"
          h="400px"
          borderRadius="lg"
          position="relative"
          overflow="hidden"
        >
          <Text
            position="absolute"
            top={textSettings.position === 'top' ? '20%' : textSettings.position === 'bottom' ? '80%' : '50%'}
            left="50%"
            transform="translate(-50%, -50%)"
            fontFamily={textSettings.fontFamily}
            fontSize={`${textSettings.fontSize * 1.5}px`}
            color={textSettings.color}
            textShadow={`
              -${textSettings.outlineWidth}px -${textSettings.outlineWidth}px 0 #000,
              ${textSettings.outlineWidth}px -${textSettings.outlineWidth}px 0 #000,
              -${textSettings.outlineWidth}px ${textSettings.outlineWidth}px 0 #000,
              ${textSettings.outlineWidth}px ${textSettings.outlineWidth}px 0 #000
            `}
            userSelect="none"
          >
            A
          </Text>
        </Center>
        <Text mt={4} fontSize="sm" color="gray.500" textAlign="center">
          Preview shows how your text styling will look
        </Text>
      </Box>
    </Stack>
  );
}

export default TextCustomization;