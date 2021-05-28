import React, { useState } from 'react';
import {Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import Modal, { ModalContent } from 'react-native-modals';
import * as firebase from 'firebase';
import 'firebase/firestore';
const firestore = firebase.firestore();
const restaurantesCollection = firestore.collection('restaurantes');

const DetalhesRestauranteTela = (props) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [avaliacaoDigitada, setAvaliacaoDigitada] = useState("");
  const restaurante = props.navigation.state.params.restaurante;
  const avaliacoesCollection = restaurantesCollection.doc(restaurante.chave).collection("avaliacoes");
  const realizarAvaliacao = () => {
    return firestore.runTransaction((transaction) => {
      return transaction.get(restaurantesCollection.doc(restaurante.chave)).then((doc) => {
        const novaMedia = (doc.data().avaliacaoMedia * doc.data().qtdeAvaliacoes + avaliacaoDigitada) / (doc.data().qtdeAvaliacoes + 1);
        transaction.update(restaurantesCollection.doc(restaurante.chave), {
          qtdeAvaliacoes: doc.data().qtdeAvaliacoes + 1,
          avaliacaoMedia: novaMedia
        })
        setAvaliacaoDigitada("");
        return transaction.set(novaAvaliacao, {
          date: new Date(),
          avaliacao: avaliacaoDigitada
        })
      })
    });
  }
  return (
    <View style={ styles.container}>
      <Image 
        style={styles.restauranteImage}
        source={{uri:restaurante.fotoURL}}
      />
      <Text style={styles.nomeEAvaliacaoRestauranteText}>
        {restaurante.nome}: {restaurante.avaliacaoMedia}
      </Text>
      <View style={styles.avaliarButton}>
        <Button 
          title="Avaliar"
          onPress={() => setModalVisivel(true)}
        />
      </View>
      <Modal
        visible={modalVisivel}
        onTouchOutside={() => setModalVisivel(false)}>
        <ModalContent>
        <View>
          <TextInput 
            style={styles.avaliacaoTextInput}
            placeholder="Digite uma nota de 1 a 5"
            onChangeText={(t) => setAvaliacaoDigitada(t)}
            value={avaliacaoDigitada}
          />
          <Button 
            title="OK"
            onPress={() => {
              realizarAvaliacao();
              setModalVisivel(false);
              props.navigation.goBack();
            }}
          />
        </View>
        </ModalContent>
      </Modal>
    </View>
  )
}

export default DetalhesRestauranteTela

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50
  },
  restauranteImage: {
    width: '90%',
    height: 300,
    marginTop:40
  },
  nomeEAvaliacaoRestauranteText: {
    fontSize: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingBottom: 4,
    marginVertical: 8,
    width: '90%',
    textAlign: 'center'
  },
  avaliarButton: {
    width: '90%'
  },
  avaliacaoTextInput: {
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
    padding: 8,
    textAlign: 'center',
    marginBottom: 4
  }
})
