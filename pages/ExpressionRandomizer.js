import React, { useCallback } from 'react';
import {
  Box,
  SimpleGrid,
  Text,
  VStack,
  Button
} from '@chakra-ui/react';

const presetExpressions = {
  Happy: {
    smile: 1.0,
    eyebrow: 5,
    blink: 0,
    wink: 0,
    pupil_x: 0,
    pupil_y: 0,
    rotate_pitch: 0,
    rotate_yaw: 0,
    rotate_roll: 0
  },
  Thoughtful: {
    smile: -0.1,
    eyebrow: 8,
    blink: 0,
    wink: 0,
    pupil_x: 8,
    pupil_y: 5,
    rotate_pitch: 10,
    rotate_yaw: 10,
    rotate_roll: 0
  },
  Playful: {
    smile: 0.8,
    eyebrow: 3,
    blink: 0,
    wink: 20,
    pupil_x: 5,
    pupil_y: -3,
    rotate_pitch: -3,
    rotate_yaw: -5,
    rotate_roll: 5
  }
};

const ExpressionRandomizer = ({ setExpressionValues }) => {
  const handlePresetClick = useCallback((preset, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    // Use a function to update state to ensure we're not using stale values
    setExpressionValues(() => ({...presetExpressions[preset]}));
  }, [setExpressionValues]);

  return (
    <Box width="full" bg="white" p={6} borderRadius="xl" boxShadow="sm" border="1px" borderColor="gray.100">
      <VStack spacing={6} align="stretch">
        <Box>
          <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={4}>
            Expression Presets
          </Text>
          <SimpleGrid columns={3} spacing={4}>
            {Object.keys(presetExpressions).map((presetName) => (
              <Button
                key={presetName}
                type="button"
                onClick={(e) => handlePresetClick(presetName, e)}
                height="60px"
                variant="outline"
                colorScheme="purple"
                _hover={{
                  transform: 'translateY(-2px)',
                  shadow: 'md',
                  bg: 'purple.600',
                  color: 'white'
                }}
              >
                {presetName}
              </Button>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};

export default ExpressionRandomizer;