import React from 'react';
import { Platform } from 'react-native';
import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons'; // Correct import path

import Colors from '../../constants/Colors';

const CustomHeaderButton = props => {
  return (
    <HeaderButton
    
      {...props} //receve all props
      IconComponent={Ionicons}
      
      iconSize={23}
      color={Platform.OS === 'android' ? 'white' : Colors.primary}
    />
  );
};

export default CustomHeaderButton;
