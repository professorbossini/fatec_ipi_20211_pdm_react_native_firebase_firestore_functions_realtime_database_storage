import React, { useState } from 'react';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database';
import * as firebase from 'firebase';
import ENV from '../env';
import {
  Button,
  Image,
  Picker,
  Slider,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

if (!firebase.apps.length){
  firebase.initializeApp(ENV);
}

const firestore = firebase.firestore();
const storage = firebase.storage();
const database = firebase.database();

const restaurantesCollection = firestore.collection('restaurantes');
const imagensRef = storage.ref('imagens');
const imagensCounterRef = database.ref('imagensCounter');


const AdicionarRestauranteTela = (props) => {

  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [categoria, setCategoria] = useState('');
  const [preco, setPreco] = useState(1);
  const [fotoURI, setFotoURI] = useState();

  const obterFoto = async () => {
    let foto = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      base64: true
    })
    setFotoURI(foto.uri);
  }

  const salvarRestaurante = async () => {
    const foto = await fetch (fotoURI);
    const blob = await foto.blob();
    const idImagem = (await imagensCounterRef.once('value')).val().toString();
    await imagensRef.child(idImagem).put(blob);
    const downloadURL = await imagensRef.child(idImagem).getDownloadURL();
    imagensCounterRef.set(+idImagem + 1);
    restaurantesCollection.add({
      nome: nome,
      cidade: cidade,
      fotoURL: downloadURL,
      preco: preco,
      categoria: categoria,
      avaliacaoMedia: 0,
      qtdeAvaliacoes: 0
    })
  }

  return (
    <View style={estilos.container}>
      <TextInput
        style={estilos.nomeTextInput}
        placeholder="Nome do restaurante"
        onChangeText={(texto) => setNome(texto)}
        value={nome}
      />
      <View style={estilos.cidadeECategoriaView}>
        <TextInput
          style={estilos.cidadeTextInput}
          placeholder="Cidade"
          onChangeText={(texto) => setCidade(texto)}
          value={cidade}
        />
        <Picker
          selectedValue={categoria}
          style={estilos.categoriaPicker}
          onValueChange={(value, index) => setCategoria(value)}
          mode="dropdown"
        >
            <Picker.Item label="Categoria" value="Categoria" />
            <Picker.Item label="Japon??s" value="Japon??s" />
            <Picker.Item label="Brasileiro" value="Brasileiro" />
        </Picker>
      </View>
      <View style={estilos.precoView}>
        <Text>Pre??o</Text>
        <Slider 
          style={estilos.precoSlider}
          minimumValue={1}
          maximumValue={5}
          value={preco}
          step={1}
          onValueChange={(value) => setPreco(value)}
        />
      </View>
      <View style={estilos.previewImagemView}>
        {
          fotoURI ?
          <Image 
            style={{width: '100%', height: '100%'}}
            source={{uri: fotoURI}}
          />
          :
          <Text>Sem foto</Text>
        }
      </View>
      <View style={estilos.tirarFotoButton}>
        <Button 
          title="Selecionar Foto"
          onPress={obterFoto}
        />
      </View>
      <TouchableOpacity 
        style={estilos.fab}
        onPress={() => {
            salvarRestaurante()
            props.navigation.goBack()
          }
        }>
        <Text style={estilos.iconeFab}>OK</Text>
      </TouchableOpacity>
    </View>
  )
};

const estilos = StyleSheet.create({
  container: {
    flex: 1
  },
  nomeTextInput: {
    width: '90%',
    textAlign: 'center',
    padding: 8,
    fontSize: 16,
    borderBottomColor: "#CCC",
    borderBottomWidth: 1,
    marginVertical: 8,
    alignSelf: 'center'
  },
  cidadeECategoriaView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12
  },
  cidadeTextInput: {
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    width: '40%',
    padding: 12,
    textAlign: 'center'
  },
  categoriaPicker: {
    width: '40%'
  },
  precoView: {
    marginVertical: 12,
    alignItems: 'center'
  },
  precoSlider: {
    width: '95%',
    marginVertical: 8
  },
  previewImagemView: {
    alignSelf: 'center',
    height: 200,
    borderWidth: 1,
    borderColor: '#CCC',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginVertical: 12
  },
  tirarFotoButton: {
    width: '90%',
    alignSelf: 'center'
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
    fontSize: 16,
    color: 'white'
  }

});
export default AdicionarRestauranteTela;