import * as ImagePicker from 'expo-image-picker';

export const pickImageFromGallery = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error('app.errors.GALLERY_PERMISSION_REQUIRED');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.8,
    aspect: [1, 1],
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0];
};