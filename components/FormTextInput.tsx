import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';


interface Props extends TextInputProps { label: string }


export default function FormTextInput({ label, style, ...rest }: Props) {
return (
<View style={styles.container}>
<Text style={styles.label}>{label}</Text>
<TextInput style={[styles.input, style]} {...rest} />
</View>
);
}


const styles = StyleSheet.create({
container: { marginBottom: 12 },
label: { marginBottom: 6, fontSize: 14, color: '#333' },
input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 }
});