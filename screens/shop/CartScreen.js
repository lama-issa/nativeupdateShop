

import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { Badge } from "react-native-elements";

import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import Card from "../../components/UI/Card";
import * as cartActions from "../../store/actions/cart";
import * as ordersActions from "../../store/actions/orders";
import { useNavigation } from "@react-navigation/native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { Platform } from "react-native";

const selectCartItems = (state) => state.cart.items;

const selectTransformedCartItems = createSelector(
  [selectCartItems],
  (items) => {
    const transformedCartItems = [];
    for (const key in items) {
      transformedCartItems.push({
        productId: key,
        productTitle: items[key].productTitle,
        productPrice: items[key].productPrice,
        quantity: items[key].quantity,
        sum: items[key].sum,
        productPushToken: items[key].pushToken,
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  }
);

const CartScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const navigation = useNavigation();
  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector(selectTransformedCartItems);
  const dispatch = useDispatch();

  useEffect(() => {
    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setCartItemCount(totalItems);
  }, [cartItems]);

  const sendOrderHandler = async () => {
    setIsLoading(true);
    await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Your Cart",
      headerRight: () => (
        
        <View style={{ marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
         <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              iconName={Platform.OS === "android" ? "cart" : "cart-outline"}
              onPress={() => {
                navigation.navigate("Cart");
              }}
            />
          </HeaderButtons>

          <View style={styles.badgeContainer}>
            <Badge value={cartItemCount} status="primary" />
          </View>
        </View>
      ),
    });
  }, [navigation, cartItemCount]);

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>
            ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Button
            color={Colors.accent}
            title="Order Now"
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          />
        )}
      </Card>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartMessage}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.productId}
          renderItem={(itemData) => (
            <CartItem
              quantity={itemData.item.quantity}
              title={itemData.item.productTitle}
              amount={itemData.item.sum}
              deletable
              onRemove={() => {
                dispatch(cartActions.removeFromCart(itemData.item.productId));
              }}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
    fontSize: 18,
  },
  amount: {
    color: Colors.primary,
  },
  emptyCartMessage: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  badgeContainer: {
    position: "absolute",
    top: -7,
    right: 5,
  }
});

export default CartScreen;
