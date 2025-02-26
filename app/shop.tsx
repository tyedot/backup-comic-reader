// app/shop.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, ImageBackground } from 'react-native';

interface ShopItem {
  id: string;
  title: string;
  price: number;
  image: any; // You might replace 'any' with a more specific type if you wish
}

const shopItems: ShopItem[] = [
  {
    id: '1',
    title: 'Special Edition Comic Cover',
    price: 9.99,
    image: require('../assets/comics/item1.jpg'),
  },
  {
    id: '2',
    title: 'Interactive Poster',
    price: 4.99,
    image: require('../assets/comics/item2.jpg'),
  },
  {
    id: '3',
    title: 'Exclusive Sticker Pack',
    price: 2.99,
    image: require('../assets/comics/item3.jpg'),
  },
  // Add more items as needed...
];

export default function Shop() {
  const renderItem = ({ item }: { item: ShopItem }) => {
    return (
      <View style={styles.itemContainer}>
        <Image source={item.image} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => Alert.alert("Purchase", `You purchased ${item.title} for $${item.price.toFixed(2)}!`)}
          >
            <Text style={styles.buyButtonText}>Buy</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    // Optional: wrap the whole view in an ImageBackground for a full-page background image.
    <ImageBackground
      source={require('../assets/comics/shop-background.jpg')} // Update the path as needed
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.header}>Shop</Text>
        <FlatList
          data={shopItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // optional overlay color for contrast
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    marginVertical: 10,
    overflow: 'hidden',
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemDetails: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  buyButton: {
    backgroundColor: '#1EB1FC',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
