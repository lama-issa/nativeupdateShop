

import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  FlatList,
  Button,
  Platform,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";

import { Badge } from "react-native-elements";
import * as cartActions from "../../store/actions/cart";
import Colors from "../../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import * as productsActions from "../../store/actions/products";
import ProductList from "../../components/UI/ProductList";
import { useTranslation } from "react-i18next";

const ProductsOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const navigation = useNavigation();
  const products = useSelector((state) => state.products.availableProducts);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("willFocus", loadProducts);
    return () => {
      unsubscribe();
    };
  }, [loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    loadProducts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProducts]);

  useEffect(() => {
    const totalItems = Object.values(cartItems).reduce(
      (total, item) => total + item.quantity,
      0
    );
    setCartItemsCount(totalItems);
  }, [cartItems]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t("All Products"),
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Menu"
            iconName={Platform.OS === "android" ? "menu" : "menu-outline"} // Updated names
            onPress={() => {
              navigation.toggleDrawer();
            }}
            
          />
        </HeaderButtons>
      ),
      headerRight: () => (
        <View
          style={{
            marginRight: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
              title="Cart"
              iconName={Platform.OS === "android" ? "cart" : "cart-outline"} // Updated names
              onPress={() => {
                navigation.navigate("Cart");
              }}
            />
            {/* Use absolute positioning for the badge */}
            <View style={styles.badgeContainer}>
              <Badge value={cartItemsCount} status="primary" />
            </View>
          </HeaderButtons>
        </View>
      ),
    });
  }, [navigation, cartItemsCount, t]);

  const selectItemHandler = (id, title) => {
    navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts}
      refreshing={isRefreshing}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductList
          data={[itemData.item]}
          onSelect={(id, title) => selectItemHandler(id, title)}
          buttonConfig={[
            // label={t('logout')}
            {
              title: t("View Details"),
              handler: (item) => selectItemHandler(item.id, item.title),
            },
            {
              title: t("Add To Cart"),
              handler: (item) => dispatch(cartActions.addToCart(item)),
            },
          ]}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  badgeContainer: {
    position: "absolute",
    top: -7,
    right: -8,
  },
});

export default ProductsOverviewScreen;
