import { View, Text} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import axios from 'axios'

const ChatBot = () => {
    const [messages, setMessages] = useState([])

    const handleSend = async (newMessages = []) => {
        try {

            const userMessage = newMessages[0];

            setMessages(previousMessages => GiftedChat.append(previousMessages, userMessage))
            const messageText = userMessage.text.toLowerCase()
            const keywords = ['receita', 'comida', 'dieta', 'fruta'];
            if (!keywords.some(keyword => messageText.includes(keyword))){
                const botMessage = {
                    _id: new Date().getTime() + 1,
                    text: "Eu sou seu Bot de Receitas, pergunte para mim alguma coisa relacionada com comida ou receita",
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'Bot de Receitas'
                    }
                };
                setMessages(previousMessages => GiftedChat.append(previousMessages, botMessage));
                return;
            }

            const CHATGPT_API_KEY = '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'
            const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
                prompt: `Pegue uma receita para ${messageText}`,
                max_tokens: 2500,
                temperature: 0.2,
                n: 1
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CHATGPT_API_KEY}`
                }
            } 
                
            );
            console.log('response', response.data);

            const recipe = response.data.choices[0].text.trim();
            const botMessage = {
                _id: new Date().getTime() + 1,
                text: recipe,
                createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'Bot de Receitas'
                    }
            };
            setMessages(previousMessages => GiftedChat.append(previousMessages, botMessage));

        } catch (error) {
            alert('Erro de Acesso', error.response)
            console.log(error);
        }
    };
    return (
        <SafeAreaView style={{ flex:1 }}>
            <View
                style={{
                    backgroundColor: '#2F15D4',
                    padding: 20,
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 5
                }}
            >
                <Text style={{
                    fontSize: 30,
                    color: 'white',
                    fontWeight: 'bold'
                }}>
                    Bot de Receitas
                </Text>
            </View>
                <GiftedChat 
                    messages = {messages}
                    onSend={newMessages => handleSend(newMessages)}
                    user={{ _id: 1 }}
                />
        </SafeAreaView>
    )
}

export default ChatBot