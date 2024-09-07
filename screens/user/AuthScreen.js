import React, {
  useState,
  useEffect,
  useReducer,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";
import { useTranslation } from "react-i18next";
import { ImageBackground } from "react-native";


const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid =
        updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const AuthScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("Welcome"),
      headerRight: () => (
        <View style={{ marginRight: 15 }}>
          <FontAwesome name="shopping-cart" size={24} color="white" />
          </View>
      ),
    });


  }, [navigation, t]);

  useEffect(() => {
    if (error) {
      Alert.alert("An Error Occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      navigation.navigate("Shop");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <ImageBackground
        source={require("./nnn.jpg")}
        style={styles.backgroundImage}
      >
        {/* شعار في أعلى الصفحة */}
       
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            id="email"
            placeholder={t("Email")}
            placeholderTextColor="#aaaaaa"
            keyboardType="email-address"
            required
            email
            autoCapitalize="none"
            errorText="Please enter a valid email address."
            onChangeText={(text) => inputChangeHandler("email", text, true)}
            initialValue=""
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            id="password"
            placeholder={t("Password")}
            placeholderTextColor="#aaaaaa"
            keyboardType="default"
            secureTextEntry
            required
            minLength={5}
            autoCapitalize="none"
            errorText="Please enter a valid password."
            onChangeText={(text) => inputChangeHandler("password", text, true)}
            initialValue=""
          />
          <FontAwesome
            name="lock"
            size={20}
            color="white"
            style={styles.icon}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            // قم بإضافة التوجيه لشاشة استرجاع كلمة المرور هنا
          }}
        >
          <Text style={styles.forgotPassword}>{t("Forgot Password")} <FontAwesome
            name="arrow-right"
            size={13}
            color={Colors.primary}
        
          /></Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Button
              title={isSignup ? t("Sign Up") : t("Login")}
              color={Colors.primary}
              onPress={authHandler}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={`${t("Switch to")} ${isSignup ? t("Login") : t("Sign Up")}`}
            color={Colors.accent}
            onPress={() => {
              setIsSignup((prevState) => !prevState);
            }}
          />
        </View>
        
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
    width: "85%",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 5,
    marginVertical: 10,
    paddingHorizontal: 10,
    width: "85%",
  },
  input: {
    flex: 1,
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  icon: {
    marginLeft: 10,
  },
  forgotPassword: {
    color: "gray",
    marginVertical: 10,
    textAlign: "right",
    width: "85%",
  },
  orText: {
    color: "white",
    marginVertical: 10,
    textAlign: "center",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "85%",
    marginTop: 20,
  },
});

export default AuthScreen;
