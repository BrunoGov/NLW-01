import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import api from '../../services/api';

interface Item {
    id: number;
    title: string;
    image_url: string;
};

interface Point {
    id: number;
    name: string;
    image: string;
    image_url: string;
    latitude: number;
    longitude: number;
};

const Points = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [posicaoInicial, setPosicaoInicial] = useState<[number, number]>([0,0]);
    const [points, setPoints] = useState<Point[]>([]);

    const navigation = useNavigation();

    useEffect(() => {
        async function loadPosition(){
            const { status } = await Location.requestPermissionsAsync();

            if(status !== 'granted'){
                Alert.alert('Ops!', 'Precisamos de sua permissão para obter a localização.');
                return;
            }

            const location = await Location.getCurrentPositionAsync();

            const { latitude, longitude } = location.coords;
            setPosicaoInicial([
                latitude,
                longitude
            ])
        }

        loadPosition();
    }, []);

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data.serializedItems);
        });
    }, []);

    useEffect(() => {
        api.get('points', {
            params: {
                city: "Registro",
                uf: "SP",
                items: [1,2]
            }
        }).then(response => {
            setPoints(response.data);
            console.log(response.data)
        });
    }, []);

    function backPage(){
        navigation.goBack();
    }

    function ViewDetalhes(id: number){
        navigation.navigate('Detail', { point_id: id });
    }

    function selectItem(id: number){
        const verificaSelecao = selectedItems.findIndex(item => item == id);

        if(verificaSelecao >= 0){
            const filtroItems = selectedItems.filter(item => item !== id);
            
            setSelectedItems(filtroItems);
        }else{
            setSelectedItems([ ...selectedItems, id ]);
        }
    }

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={backPage}>
                    <Icon name="arrow-left" size={20} color="#34cb79" />
                </TouchableOpacity>

                <Text style={styles.title}>Bem Vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

                <View style={styles.mapContainer}>
                    { posicaoInicial[0] !== 0 && (
                        <MapView 
                            style={styles.map}
                            initialRegion={{
                                latitude: posicaoInicial[0],
                                longitude: posicaoInicial[1],
                                longitudeDelta: 0.014,
                                latitudeDelta: 0.014
                            }}
                        >
                            {points.map(point => (
                                <Marker key={String(point.id)}
                                    style={styles.mapMarker}
                                    onPress={() => ViewDetalhes(point.id)}
                                    coordinate={{
                                        latitude: point.latitude,
                                        longitude: point.longitude,
                                    }} 
                                >
                                    <View style={styles.mapMarkerContainer}>
                                        <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }}/>
                                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    ) }
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {items.map(item => (
                        <TouchableOpacity 
                            key={String(item.id)} 
                            style={[
                                styles.item,
                                selectedItems.includes(item.id) ? styles.selectedItem : {}
                            ]} 
                            onPress={() => selectItem(item.id)}
                            activeOpacity={0.7}
                        >
                            <SvgUri width={42} height={42} uri={item.image_url} />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    );
};

export default Points;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });