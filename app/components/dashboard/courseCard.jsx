import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';

const CourseCard = ({ course, onPress }) => {
  const formatPrice = (price) => {
    if (!price || price === 'Free') return 'Free';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <TouchableOpacity onPress={() => onPress(course)}>
      <Card style={styles.card}>
        <Image 
          source={{ uri: course.image }} 
          style={styles.image}
          resizeMode="cover"
        />
        <Card.Content>
          <Text style={styles.title} numberOfLines={2}>
            {course.name}
          </Text>
          <Text style={styles.category} numberOfLines={1}>
            {course?.category || 'Uncategorized'}
          </Text>
          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.salePrice}>
                {formatPrice(course?.sale_price_usd)}
              </Text>
              {course?.actual_price_usd !== course?.sale_price_usd && (
                <Text style={styles.actualPrice}>
                  {formatPrice(course?.actual_price_usd)}
                </Text>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 4,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 160,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#1a1a1a',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#491B6D',
  },
  actualPrice: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
});

export default CourseCard;
