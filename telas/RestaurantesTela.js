import React, { useEffect, useState } from 'react'
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ENV from '../env';
import * as firebase from 'firebase';
import 'firebase/firestore';
if (!firebase.apps.length)
  firebase.initializeApp(ENV);

const firestore = firebase.firestore();
const restaurantesCollection = firestore.collection("restaurantes");

const RestaurantesTela = (props) => {
  useEffect(() => {
    restaurantesCollection.onSnapshot((collection) => {
      let aux = [];
      collection.docs.forEach(doc => {
        aux.push({
          categoria: doc.data().categoria,
          cidade: doc.data().cidade,
          fotoURL: doc.data().fotoURL,
          nome: doc.data().nome,
          preco: doc.data().preco,
          chave: doc.id,
          avaliacaoMedia: doc.data().avaliacaoMedia,
          qtdeAvaliacoes: doc.data().qtdeAvaliacoes
        });
      });
      //console.log(aux);
      setRestaurantes(aux);
    })
  }, []);
  const [restaurantes, setRestaurantes] = useState([]);
  return (
    <View style={styles.container}>
      <FlatList 
        data={restaurantes}
        renderItem={(restaurante) => (
          <TouchableOpacity 
            onPress={() => props.navigation.navigate('DetalhesRestauranteTela', {restaurante: restaurante.item})}>
            <View style={styles.restauranteItemView}>
              <Image 
                style={styles.restauranteImage}
                source={{uri: restaurante.item.fotoURL}}
              />
              <Text style={styles.nomeRestauranteText}>{restaurante.item.nome}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={restaurante => restaurante.chave}
      />      
      
    
    
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => props.navigation.navigate('AdicionarRestauranteTela')}>
          <Text style={styles.iconeFab}>+</Text>
      </TouchableOpacity>
    
      </View>
  )
}

export default RestaurantesTela

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    elevation: 8
  },
  iconeFab: {
    fontSize: 20,
    color: 'white'
  },
  nomeRestauranteText: {
    fontSize: 18
  },
  restauranteImage: {
    width: '60%',
    height: 100,
    marginBottom: 12
  },
  restauranteItemView: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    alignItems: 'center',
    width: "80%",
    alignSelf: 'center'
  }
})
