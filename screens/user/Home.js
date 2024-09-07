import React from "react";
import { View, StyleSheet, Image, Button } from "react-native";

const Home = ({ navigation }) => {
  return (
    <View style={styles.home}>
      <Image
        source={require("./nnn.jpg")}
        style={styles.image}
      />
      <Button
        title="Log in or Sign in"
        onPress={() => navigation.navigate('Auth')}
        color="#007bff" // لون الزر الرئيسي
      />
    </View>
  );
};

const styles = StyleSheet.create({
  home: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default Home;
