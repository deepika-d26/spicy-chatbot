const firebaseConfig = {
  apiKey: "AIzaSyDYmGp9Mha7CzCC-kFIeIqGy1_lscZMZOs",
  authDomain: "spicy-food-order-assistant.firebaseapp.com",
  projectId: "spicy-food-order-assistant",
  storageBucket: "spicy-food-order-assistant.firebasestorage.app",
  messagingSenderId: "894408741484",
  appId: "1:894408741484:web:130641154b60f9376e7e49"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // This is your database!
// Configuration - UPDATE THIS TO YOUR AZURE FUNCTION URL
const AZURE_FUNCTION_URL = 'https://spicychatbotfunction-bbfydebcfcf2b6er.centralindia-01.azurewebsites.net/api/HttpTrigger1deepi?';
const BOT_SECRET_KEY = "CBrDk2c3vJHhkemq5zqAL16mBeMxfnHtqt149b3xzDeER4pK00JaJQQJ99BGACGhslBAArohAAABAZBS1HIj.9wV5SZIZ9QRw28dGUrPmfF048FxRwKCwmQGaU4C28WHCMMdtAY9AJQQJ99BGAC77bzfAArohAAABAZBS1u0y";
const BOT_NAME = "SpicyFoodBot";

// Menu items with multilingual support
const menuItems = {
    pizza: {
        id: 'pizza',
        name: { en: 'Spicy Margherita Pizza', hi: 'मसालेदार मार्गेरिटा पिज़्ज़ा', es: 'Pizza Margarita Picante', kn: 'ಸ್ಪೈಸಿ ಮಾರ್ಗರಿಟಾ ಪಿಜ್ಜಾ' },
        price: 399,
        description: {
            en: 'Classic pizza with mozzarella, tomato sauce, and spicy jalapeños',
            hi: 'मोज़ेरेला, टमाटर सॉस और मसालेदार जैलेपेनोस के साथ क्लासिक पिज़्ज़ा',
            es: 'Pizza clásica con mozzarella, salsa de tomate y jalapeños picantes',
            kn: 'ಮೊಜರೆಲ್ಲಾ, ಟೊಮೇಟೊ ಸಾಸ್ ಮತ್ತು ಮಸಾಲೆ ಜಲಪೆನೊಗಳೊಂದಿಗೆ ಕ್ಲಾಸಿಕ್ ಪಿಜ್ಜಾ'
        },
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        category: 'veg',
        spicy: 3
    },
    pasta: {
        id: 'pasta',
        name: { en: 'Spicy Arrabiata Pasta', hi: 'मसालेदार अर्राबियाटा पास्ता', es: 'Pasta Arrabiata Picante', kn: 'ಸ್ಪೈಸಿ ಅರ್ರಬಿಯಾಟಾ ಪಾಸ್ಟಾ' },
        price: 349,
        description: {
            en: 'Penne pasta in spicy tomato garlic sauce with chili flakes',
            hi: 'मसालेदार टमाटर लहसुन सॉस और लाल मिर्च के साथ पेन्ने पास्ता',
            es: 'Pasta penne en salsa picante de tomate y ajo con hojuelas de chile',
            kn: 'ಮಸಾಲೆ ಟೊಮೇಟೊ ಬೆಳ್ಳುಳ್ಳಿ ಸಾಸ್ ಮತ್ತು ಮೆಣಸಿನಕಾಯಿ ತುಂಡುಗಳೊಂದಿಗೆ ಪೆನ್ನೆ ಪಾಸ್ಟಾ'
        },
        image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        category: 'veg',
        spicy: 4
    },
    burger: {
        id: 'burger',
        name: { en: 'Spicy Chicken Burger', hi: 'मसालेदार चिकन बर्गर', es: 'Hamburguesa Picante de Pollo', kn: 'ಸ್ಪೈಸಿ ಚಿಕನ್ ಬರ್ಗರ್' },
        price: 279,
        description: {
            en: 'Juicy chicken patty with spicy mayo, lettuce, and jalapeños',
            hi: 'मसालेदार मेयो, लेट्यूस और जैलेपेनोस के साथ रसदार चिकन पैटी',
            es: 'Jugosa hamburguesa de pollo con mayonesa picante, lechuga y jalapeños',
            kn: 'ಮಸಾಲೆ ಮೇಯೊನೀಸ್, ಲೆಟ್ಯೂಸ್ ಮತ್ತು ಜಲಪೆನೊಗಳೊಂದಿಗೆ ರಸಭರಿತ ಚಿಕನ್ ಪ್ಯಾಟಿ'
        },
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        category: 'non-veg',
        spicy: 3
    },
    salad: {
        id: 'salad',
        name: { en: 'Spicy Thai Salad', hi: 'मसालेदार थाई सलाद', es: 'Ensalada Tailandesa Picante', kn: 'ಸ್ಪೈಸಿ ಥಾಯ್ ಸಲಾಡ್' },
        price: 299,
        description: {
            en: 'Fresh vegetables with spicy Thai dressing and peanuts',
            hi: 'मसालेदार थाई ड्रेसिंग और मूंगफली के साथ ताज़ी सब्जियाँ',
            es: 'Verduras frescas con aderezo tailandés picante y maní',
            kn: 'ಮಸಾಲೆ ಥಾಯ್ ಡ್ರೆಸಿಂಗ್ ಮತ್ತು ಕಡಲೆಕಾಯಿಗಳೊಂದಿಗೆ ತಾಜಾ ತರಕಾರಿಗಳು'
        },
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        category: 'veg',
        spicy: 2
    },
    sandwich: {
        id: 'sandwich',
        name: { en: 'Spicy Veg Sandwich', hi: 'मसालेदार वेज सैंडविच', es: 'Sándwich Vegetal Picante', kn: 'ಸ್ಪೈಸಿ ವೆಜ್ ಸ್ಯಾಂಡ್‌ವಿಚ್' },
        price: 199,
        description: {
            en: 'Grilled vegetables with spicy chipotle sauce and cheese',
            hi: 'मसालेदार चिपोटल सॉस और चीज़ के साथ ग्रिल्ड सब्जियाँ',
            es: 'Verduras a la parrilla con salsa chipotle picante y queso',
            kn: 'ಮಸಾಲೆ ಚಿಪೊಟ್ಲೆ ಸಾಸ್ ಮತ್ತು ಚೀಸ್‌ನೊಂದಿಗೆ ಗ್ರಿಲ್ಡ್ ತರಕಾರಿಗಳು'
        },
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        category: 'veg',
        spicy: 2
    },
    wings: {
        id: 'wings',
        name: { en: 'Spicy Buffalo Wings', hi: 'मसालेदार बफ़ेलो विंग्स', es: 'Alitas de Buffalo Picantes', kn: 'ಸ್ಪೈಸಿ ಬಫಲೋ ವಿಂಗ್ಸ್' },
        price: 349,
        description: {
            en: 'Crispy chicken wings tossed in spicy buffalo sauce',
            hi: 'मसालेदार बफ़ेलो सॉस में टॉस की गई कुरकुरे चिकन विंग्स',
            es: 'Crujientes alitas de pollo mezcladas en salsa buffalo picante',
            kn: 'ಮಸಾಲೆ ಬಫಲೋ ಸಾಸ್‌ನಲ್ಲಿ ಟಾಸ್ ಮಾಡಿದ ಕ್ರಿಸ್ಪಿ ಚಿಕನ್ ವಿಂಗ್ಸ್'
        },
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        category: 'non-veg',
        spicy: 5
    }
};

// Translations
const translations = {
    en: {
        welcome: "Welcome to Spicy Delights! 🔥Please tell us your name to begin.",
        namePrompt: "What's your name?",
        menuTitle: "Our Spicy Menu 🌶",
        orderPrompt: "What would you like to order today?",
        modifyPrompt: "You can modify your order by saying: 'Change 2 pizzas to 3' or 'Remove 1 pasta'",
        specialRequestPrompt: "Any special requests? (e.g. 'Extra spicy', 'Less spicy', 'No onions')",
        schedulePrompt: "When would you like your order? (e.g. '7 PM' or 'Tomorrow at 8 AM')",
        confirmOrder: "Please confirm your order:",
        paymentPrompt: "How would you like to pay?",
        thankYou: "Thank you for your order! Your spicy food will be prepared soon. 🔥",
        hello: "Hello",
        total: "Total",
        yourOrder: "Your Current Order",
        emptyOrder: "Your order is empty. Please add some spicy items first!",
        orderUpdated: "Updated {item} to quantity {qty}",
        orderRemoved: "Removed {qty} {item} from your order",
        modifyError: "I didn't understand that modification. Please try something like: 'Change 2 pizzas to 3' or 'Remove 1 pasta'",
        requestAdded: "Added special request: '{request}'",
        requestError: "I couldn't add that request. Please check the item name and try again.",
        orderScheduled: "Your order is scheduled for {time}",
        scheduleError: "I didn't understand the time. Please try formats like '7 PM' or 'Tomorrow 8 AM'",
        error: "I'm having trouble processing that. Please try again.",
        listening: "Listening... Please speak now",
        typing: "Thinking...",
        vegetarian: "Vegetarian",
        nonVegetarian: "Non-Vegetarian",
        glutenFree: "Gluten Free",
        addToOrder: "Add to Order",
        addedToOrder: "Added {count} spicy item(s) to your order 🔥",
        notUnderstood: "I didn't understand that. Try something like: '2 pizzas', 'Show menu', or 'My order'",
        whatNext: "What would you like to do next?",
        addMore: "Add more items",
        modifyOrder: "Modify my order",
        confirmOrderBtn: "Confirm order",
        typeHere: "Type your message...",
        paymentOptions: "Payment Options",
        creditCard: "Credit Card",
        cash: "Cash",
        roomCharge: "Room Charge",
        paymentConfirmed: "Payment confirmed with {method}",
        connectionError: "I'm having connection issues but can still take your order offline",
        clearChatConfirm: "Are you sure you want to clear the chat?",
        chatCleared: "Chat cleared. How can I help you today?",
        send: "Send",
        spicyLevel: "Spice Level:"
    },
    hi: {
        welcome: "स्पाइसी डिलाइट्स में आपका स्वागत है! 🔥 कृपया शुरू करने के लिए अपना नाम बताएं।",
        namePrompt: "आपका नाम क्या है?",
        menuTitle: "हमारा मसालेदार मेनू 🌶",
        orderPrompt: "आज आप क्या ऑर्डर करना चाहेंगे?",
        modifyPrompt: "आप '2 पिज्जा को 3 में बदलें' या '1 पास्ता हटाएं' कहकर अपना ऑर्डर बदल सकते हैं",
        specialRequestPrompt: "कोई विशेष अनुरोध? (जैसे 'ज्यादा मसालेदार', 'कम मसालेदार', 'प्याज नहीं')",
        schedulePrompt: "आप अपना ऑर्डर कब चाहेंगे? (जैसे 'शाम 7 बजे' या 'कल सुबह 8 बजे')",
        confirmOrder: "कृपया अपना ऑर्डर सत्यापित करें:",
        paymentPrompt: "आप कैसे भुगतान करना चाहेंगे?",
        thankYou: "आपके ऑर्डर के लिए धन्यवाद! आपका मसालेदार खाना जल्द तैयार किया जाएगा। 🔥",
        hello: "नमस्ते",
        total: "कुल",
        yourOrder: "आपका वर्तमान ऑर्डर",
        emptyOrder: "आपका ऑर्डर खाली है। कृपया पहले कुछ मसालेदार आइटम जोड़ें!",
        orderUpdated: "{item} को {qty} की मात्रा में अपडेट किया गया",
        orderRemoved: "आपके ऑर्डर से {qty} {item} हटा दिया गया",
        modifyError: "मैं उस संशोधन को समझ नहीं पाया। कृपया '2 पिज्जा को 3 में बदलें' या '1 पास्ता हटाएं' जैसा कुछ कहकर प्रयास करें",
        requestAdded: "विशेष अनुरोध जोड़ा: '{request}'",
        requestError: "मैं वह अनुरोध जोड़ नहीं पाया। कृपया आइटम का नाम जांचें और पुनः प्रयास करें",
        orderScheduled: "आपका ऑर्डर {time} के लिए निर्धारित किया गया है",
        scheduleError: "मैं समय नहीं समझ पाया। कृपया 'शाम 7 बजे' या 'कल सुबह 8 बजे' जैसे प्रारूप आजमाएं",
        error: "मुझे इसे संसाधित करने में परेशानी हो रही है। कृपया पुनः प्रयास करें।",
        listening: "सुन रहा हूँ... कृपया अब बोलें",
        typing: "सोच रहा हूँ...",
        vegetarian: "शाकाहारी",
        nonVegetarian: "मांसाहारी",
        glutenFree: "ग्लूटेन मुक्त",
        addToOrder: "ऑर्डर में जोड़ें",
        addedToOrder: "आपके ऑर्डर में {count} मसालेदार आइटम जोड़े गए 🔥",
        notUnderstood: "मैं समझ नहीं पाया। '2 पिज्जा', 'मेनू दिखाएं', या 'मेरा ऑर्डर' जैसा कुछ कहकर प्रयास करें",
        whatNext: "अब आप क्या करना चाहेंगे?",
        addMore: "और आइटम जोड़ें",
        modifyOrder: "मेरा ऑर्डर बदलें",
        confirmOrderBtn: "ऑर्डर की पुष्टि करें",
        typeHere: "अपना संदेश टाइप करें...",
        paymentOptions: "भुगतान विकल्प",
        creditCard: "क्रेडिट कार्ड",
        cash: "नकद",
        roomCharge: "कमरा शुल्क",
        paymentConfirmed: "{method} से भुगतान की पुष्टि हुई",
        connectionError: "मुझे कनेक्शन समस्याएँ हो रही हैं, लेकिन मैं अभी भी आपका ऑर्डर ऑफ़लाइन ले सकता हूँ",
        clearChatConfirm: "क्या आप वाकई चैट साफ़ करना चाहते हैं?",
        chatCleared: "चैट साफ़ हो गई। आज मैं आपकी कैसे मदद कर सकता हूँ?",
        send: "भेजें",
        spicyLevel: "मसाले का स्तर:"
    },
    es: {
        welcome: "¡Bienvenido a Spicy Delights! 🔥 Por favor, dinos tu nombre para comenzar.",
        namePrompt: "¿Cuál es tu nombre?",
        menuTitle: "Nuestro Menú Picante 🌶",
        orderPrompt: "¿Qué te gustaría ordenar hoy?",
        modifyPrompt: "Puedes modificar tu pedido diciendo: 'Cambiar 2 pizzas a 3' o 'Quitar 1 pasta'",
        specialRequestPrompt: "¿Algún pedido especial? (ej. 'Extra picante', 'Menos picante', 'Sin cebolla')",
        schedulePrompt: "¿Cuándo deseas tu pedido? (ej. '7 PM' o 'Mañana a las 8 AM')",
        confirmOrder: "Por favor confirma tu pedido:",
        paymentPrompt: "¿Cómo te gustaría pagar?",
        thankYou: "¡Gracias por tu pedido! Tu comida picante será preparada pronto. 🔥",
        hello: "Hola",
        total: "Total",
        yourOrder: "Tu Pedido Actual",
        emptyOrder: "Tu pedido está vacío. ¡Por favor agrega algunos artículos picantes primero!",
        orderUpdated: "Actualizado {item} a cantidad {qty}",
        orderRemoved: "Eliminado {qty} {item} de tu pedido",
        modifyError: "No entendí esa modificación. Por favor intenta algo como: 'Cambiar 2 pizzas a 3' o 'Quitar 1 pasta'",
        requestAdded: "Solicitud especial agregada: '{request}'",
        requestError: "No pude agregar esa solicitud. Por favor verifica el nombre del artículo e intenta nuevamente.",
        orderScheduled: "Tu pedido está programado para {time}",
        scheduleError: "No entendí la hora. Por favor usa formatos como '7 PM' o 'Mañana 8 AM'",
        error: "Estoy teniendo problemas para procesar eso. Por favor intenta nuevamente.",
        listening: "Escuchando... Por favor habla ahora",
        typing: "Pensando...",
        vegetarian: "Vegetariano",
        nonVegetarian: "No Vegetariano",
        glutenFree: "Sin Gluten",
        addToOrder: "Añadir al Pedido",
        addedToOrder: "Se agregaron {count} artículo(s) picante(s) a tu pedido 🔥",
        notUnderstood: "No entendí eso. Intenta algo como: '2 pizzas', 'Mostrar menú', o 'Mi pedido'",
        whatNext: "¿Qué te gustaría hacer ahora?",
        addMore: "Añadir más artículos",
        modifyOrder: "Modificar mi pedido",
        confirmOrderBtn: "Confirmar pedido",
        typeHere: "Escribe tu mensaje...",
        paymentOptions: "Opciones de Pago",
        creditCard: "Tarjeta de Crédito",
        cash: "Efectivo",
        roomCharge: "Cargo a Habitación",
        paymentConfirmed: "Pago confirmado con {method}",
        connectionError: "Estoy teniendo problemas de conexión pero aún puedo tomar tu pedido sin conexión",
        clearChatConfirm: "¿Estás seguro de que quieres borrar el chat?",
        chatCleared: "Chat borrado. ¿Cómo puedo ayudarte hoy?",
        send: "Enviar",
        spicyLevel: "Nivel de picante:"
    },
    kn: {
        welcome: "ಸ್ಪೈಸಿ ಡಿಲೈಟ್ಸ್‌ಗೆ ಸುಸ್ವಾಗತ! 🔥 ಪ್ರಾರಂಭಿಸಲು ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರನ್ನು ಹೇಳಿ.",
        namePrompt: "ನಿಮ್ಮ ಹೆಸರೇನು?",
        menuTitle: "ನಮ್ಮ ಮಸಾಲೆ ಮೆನು 🌶",
        orderPrompt: "ನೀವು ಇಂದು ಏನು ಆರ್ಡರ್ ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?",
        modifyPrompt: "'2 ಪಿಜ್ಜಾವನ್ನು 3ಕ್ಕೆ ಬದಲಾಯಿಸಿ' ಅಥವಾ '1 ಪಾಸ್ತಾ ತೆಗೆದುಹಾಕಿ' ಎಂದು ಹೇಳುವ ಮೂಲಕ ನಿಮ್ಮ ಆರ್ಡರ್ ಅನ್ನು ಮಾರ್ಪಡಿಸಬಹುದು",
        specialRequestPrompt: "ಯಾವುದಾದರೂ ವಿಶೇಖ ವಿನಂತಿಗಳು? (ಉದಾ. 'ಹೆಚ್ಚು ಮಸಾಲೆ', 'ಕಡಿಮೆ ಮಸಾಲೆ', 'ಈರುಳ್ಳಿ ಇಲ್ಲ')",
        schedulePrompt: "ನಿಮ್ಮ ಆರ್ಡರ್ ಯಾವಾಗ ಬೇಕು? (ಉದಾ. 'ಸಂಜೆ 7' ಅಥವಾ 'ನಾಳೆ ಬೆಳಗ್ಗೆ 8')",
        confirmOrder: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆರ್ಡರ್ ಖಚಿತಪಡಿಸಿ:",
        paymentPrompt: "ನೀವು ಹೇಗೆ ಪಾವತಿಸಲು ಬಯಸುತ್ತೀರಿ?",
        thankYou: "ನಿಮ್ಮ ಆರ್ಡರ್ಗೆ ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಮಸಾಲೆ ಆಹಾರವನ್ನು ಶೀಘ್ರದಲ್ಲೇ ತಯಾರಿಸಲಾಗುತ್ತದೆ. 🔥",
        hello: "ನಮಸ್ಕಾರ",
        total: "ಒಟ್ಟು",
        yourOrder: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಆರ್ಡರ್",
        emptyOrder: "ನಿಮ್ಮ ಆರ್ಡರ್ ಖಾಲಿಯಾಗಿದೆ. ದಯವಿಟ್ಟು ಮೊದಲು ಕೆಲವು ಮಸಾಲೆ ವಸ್ತುಗಳನ್ನು ಸೇರಿಸಿ!",
        orderUpdated: "{item} ಅನ್ನು {qty} ಪ್ರಮಾಣಕ್ಕೆ ನವೀಕರಿಸಲಾಗಿದೆ",
        orderRemoved: "ನಿಮ್ಮ ಆರ್ಡರ್ನಿಂದ {qty} {item} ಅನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆ",
        modifyError: "ನಾನು ಆ ಮಾರ್ಪಾಡನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಿಲ್ಲ. ದಯವಿಟ್ಟು '2 ಪಿಜ್ಜಾವನ್ನು 3ಕ್ಕೆ ಬದಲಾಯಿಸಿ' ಅಥವಾ '1 ಪಾಸ್ತಾ ತೆಗೆದುಹಾಕಿ' ಎಂದು ಪ್ರಯತ್ನಿಸಿ",
        requestAdded: "ವಿಶೇಖ ವಿನಂತಿಯನ್ನು ಸೇರಿಸಲಾಗಿದೆ: '{request}'",
        requestError: "ನಾನು ಆ ವಿನಂತಿಯನ್ನು ಸೇರಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಐಟಂ ಹೆಸರನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
        orderScheduled: "ನಿಮ್ಮ ಆರ್ಡರ್ ಅನ್ನು {time} ಗೆ ಶೆಡ್ಯೂಲ್ ಮಾಡಲಾಗಿದೆ",
        scheduleError: "ನಾನು ಸಮಯವನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಿಲ್ಲ. ದಯವಿಟ್ಟು 'ಸಂಜೆ 7' ಅಥವಾ 'ನಾಳೆ ಬೆಳಗ್ಗೆ 8' ರಂತಹ ಸ್ವರೂಪಗಳನ್ನು ಪ್ರಯತ್ನಿಸಿ",
        error: "ನಾನು ಅದನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ತೊಂದರೆ ಪಡುತ್ತಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
        listening: "ಕೇಳುತ್ತಿದ್ದೇನೆ... ದಯವಿಟ್ಟು ಈಗ ಮಾತನಾಡಿ",
        typing: "ಯೋಚಿಸುತ್ತಿದೆ...",
        vegetarian: "ಶಾಕಾಹಾರಿ",
        nonVegetarian: "ಮಾಂಸಾಹಾರಿ",
        glutenFree: "ಗ್ಲುಟೆನ್ ರಹಿತ",
        addToOrder: "ಆರ್ಡರ್ಗೆ ಸೇರಿಸಿ",
        addedToOrder: "ನಿಮ್ಮ ಆರ್ಡರ್ಗೆ {count} ಮಸಾಲೆ ಐಟಂ(ಗಳು) ಸೇರಿಸಲಾಗಿದೆ 🔥",
        notUnderstood: "ನಾನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಿಲ್ಲ. '2 ಪಿಜ್ಜಾ', 'ಮೆನು ತೋರಿಸಿ', ಅಥವಾ 'ನನ್ನ ಆರ್ಡರ್' ಎಂದು ಪ್ರಯತ್ನಿಸಿ",
        whatNext: "ನೀವು ಮುಂದೆ ಏನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?",
        addMore: "ಹೆಚ್ಚು ಐಟಂಗಳನ್ನು ಸೇರಿಸಿ",
        modifyOrder: "ನನ್ನ ಆರ್ಡರ್ ಮಾರ್ಪಡಿಸಿ",
        confirmOrderBtn: "ಆರ್ಡರ್ ಖಚಿತಪಡಿಸಿ",
        typeHere: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...",
        paymentOptions: "ಪಾವತಿ ಆಯ್ಕೆಗಳು",
        creditCard: "ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್",
        cash: "ನಗದು",
        roomCharge: "ಕೋಣೆ ಶುಲ್ಕ",
        paymentConfirmed: "{method} ನೊಂದಿಗೆ ಪಾವತಿ ಖಚಿತಪಡಿಸಲಾಗಿದೆ",
        connectionError: "ನಾನು ಸಂಪರ್ಕ ಸಮಸ್ಯೆಗಳನ್ನು ಎದುರಿಸುತ್ತಿದ್ದೇನೆ ಆದರೆ ಇನ್ನೂ ಆಫ್ಲೈನ್ನಲ್ಲಿ ನಿಮ್ಮ ಆರ್ಡರ್ ತೆಗೆದುಕೊಳ್ಳಬಹುದು",
        clearChatConfirm: "ನೀವು ಚಾಟ್ ಅನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಮಾಡಲು ಖಚಿತವಾಗಿ ಬಯಸುವಿರಾ?",
        chatCleared: "ಚಾಟ್ ಸ್ಪಷ್ಟವಾಗಿದೆ. ನಾನು ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?",
        send: "ಕಳುಹಿಸು",
        spicyLevel: "ಮಸಾಲೆ ಮಟ್ಟ:"
    }
};

// DOM elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const voiceBtn = document.getElementById('voice-btn');
const langButtons = document.querySelectorAll('.lang-btn');
const clearChatBtn = document.getElementById('clear-chat');
const spicyAnimation = document.getElementById('spicy-animation');

// Initialize conversation state
let conversationState = {
    step: 'welcome',
    name: '',
    orders: [],
    language: 'en',
    scheduledTime: null,
    recurringOrder: false,
    paymentMethod: null
};

// Initialize voice recognition
let recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        voiceBtn.classList.remove('listening');
        sendMessage();
    };
    
    recognition.onerror = (event) => {
        console.error('Voice error:', event.error);
        voiceBtn.classList.remove('listening');
        addBotMessage(getTranslation('error', conversationState.language), 'error');
    };
} else {
    voiceBtn.style.display = 'none';
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

voiceBtn.addEventListener('click', () => {
    if (!recognition) return;
    recognition.lang = conversationState.language === 'hi' ? 'hi-IN' : 
                      conversationState.language === 'es' ? 'es-ES' :
                      conversationState.language === 'kn' ? 'kn-IN' : 'en-US';
    recognition.start();
    voiceBtn.classList.add('listening');
    addBotMessage(getTranslation('listening', conversationState.language));
});

langButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        langButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        conversationState.language = this.dataset.lang;
        updateLanguageUI();
        
        // Restart conversation in new language
        if (conversationState.step === 'welcome') {
            addBotMessage(getTranslation('welcome', conversationState.language));
        }
    });
});

clearChatBtn.addEventListener('click', () => {
    if (confirm(getTranslation('clearChatConfirm', conversationState.language))) {
        chatMessages.innerHTML = '';
        conversationState = {
            step: 'welcome',
            name: '',
            orders: [],
            language: conversationState.language,
            scheduledTime: null,
            recurringOrder: false,
            paymentMethod: null
        };
        addBotMessage(getTranslation('chatCleared', conversationState.language));
        setTimeout(() => {
            addBotMessage(getTranslation('welcome', conversationState.language));
        }, 500);
    }
});

// Create spicy animation elements
function createSpicyAnimation() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const chili = document.createElement('div');
            chili.className = 'chili-pepper';
            chili.style.left = `${Math.random() * 100}%`;
            chili.style.animationDuration = `${5 + Math.random() * 5}s`;
            chili.style.opacity = Math.random() * 0.7 + 0.3;
            chili.style.width = `${20 + Math.random() * 20}px`;
            chili.style.height = chili.style.width;
            spicyAnimation.appendChild(chili);
            
            // Remove after animation completes
            setTimeout(() => {
                chili.remove();
            }, 10000);
        }, i * 1000);
    }
}

// Create confetti animation
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 60 + 0}, 100%, 50%)`;
        confetti.style.animationDuration = `${1 + Math.random() * 2}s`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confetti.style.width = `${5 + Math.random() * 10}px`;
        confetti.style.height = confetti.style.width;
        spicyAnimation.appendChild(confetti);
        
        // Start animation
        setTimeout(() => {
            confetti.style.animationName = 'confetti-fall';
        }, 10);
        
        // Remove after animation completes
        setTimeout(() => {
            confetti.remove();
        }, 3000);
    }
}

// Initialize chat
setTimeout(() => {
    addBotMessage(getTranslation('welcome', conversationState.language));
    createSpicyAnimation();
    setInterval(createSpicyAnimation, 10000);
}, 500);

// Main message processing
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    addUserMessage(message);
    userInput.value = '';
    sendButton.disabled = true;
    showTypingIndicator();
    
    try {
        // First try local processing
        const localResponse = processMessageLocally(message);
        if (localResponse && localResponse.length > 0) {
            localResponse.forEach(msg => addBotMessage(msg));
            return;
        }
        
        // Only call Azure if needed and URL is valid
        if (AZURE_FUNCTION_URL && AZURE_FUNCTION_URL.startsWith('https://')) {
            const response = await fetch(AZURE_FUNCTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: message,
                    conversationState: conversationState
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.replies) {
                    data.replies.forEach(reply => addBotMessage(reply));
                }
            }
        }
    } catch (error) {
        console.error('Error:', error);
        addBotMessage(getTranslation('error', conversationState.language));
    } finally {
        removeTypingIndicator();
        sendButton.disabled = false;
    }
}

function processMessageLocally(message) {
    const text = message.toLowerCase().trim();
    const lang = conversationState.language;

    // Handle clear/reset
    if (text === 'clear' || text === 'reset') {
        chatMessages.innerHTML = '';
        conversationState = {
            step: 'welcome',
            name: '',
            orders: [],
            language: conversationState.language,
            scheduledTime: null,
            recurringOrder: false,
            paymentMethod: null
        };
        return [getTranslation('chatCleared', lang)];
    }

    // Handle help command
    if (text === 'help') {
        return [
            getTranslation('whatNext', lang),
            `- ${getTranslation('addMore', lang)}`,
            `- ${getTranslation('modifyOrder', lang)}`,
            `- ${getTranslation('confirmOrderBtn', lang)}`,
            `- "clear" ${getTranslation('chatCleared', lang)}`
        ];
    }

    switch (conversationState.step) {
        case 'welcome':
            conversationState.step = 'get_name';
            return [getTranslation('namePrompt', lang)];
            
        case 'get_name':
            if (!text) return [getTranslation('namePrompt', lang)];
            conversationState.name = message;
            conversationState.step = 'show_menu';
            return [
                `${getTranslation('hello', lang)} ${message}!`,
                getTranslation('menuTitle', lang),
                ...showVisualMenu()
            ];
            
        case 'show_menu':
            if (text.includes('menu')) return showVisualMenu();
            if (Object.keys(menuItems).some(item => text.includes(item))) {
                conversationState.step = 'take_order';
                return processOrder(text);
            }
            // Handle action buttons
            if (text === getTranslation('addMore', lang).toLowerCase()) {
                return showVisualMenu();
            }
            if (text === getTranslation('modifyOrder', lang).toLowerCase()) {
                return [getTranslation('modifyPrompt', lang), ...showCurrentOrder()];
            }
            if (text === getTranslation('confirmOrderBtn', lang).toLowerCase()) {
                if (conversationState.orders.length === 0) {
                    return [getTranslation('emptyOrder', lang), ...showVisualMenu()];
                }
                conversationState.step = 'payment';
                createConfetti();
                return showPaymentOptions();
            }
            return [getTranslation('orderPrompt', lang), ...showVisualMenu()];
            
        case 'take_order':
            // Check for modification commands first
            if (text.startsWith('remove') || text.startsWith('delete') || text.startsWith('cancel')) {
                return [modifyOrder(text)];
            }
            if (text.startsWith('change')) {
                return [modifyOrder(text)];
            }
            
            // Handle action buttons
            if (text === getTranslation('addMore', lang).toLowerCase()) {
                return showVisualMenu();
            }
            if (text === getTranslation('modifyOrder', lang).toLowerCase()) {
                return [getTranslation('modifyPrompt', lang), ...showCurrentOrder()];
            }
            if (text === getTranslation('confirmOrderBtn', lang).toLowerCase()) {
                if (conversationState.orders.length === 0) {
                    return [getTranslation('emptyOrder', lang), ...showVisualMenu()];
                }
                conversationState.step = 'payment';
                createConfetti();
                return showPaymentOptions();
            }
            return processOrder(text);
            
        case 'payment':
            if (text.includes('1') || text.includes('credit')) {
                conversationState.paymentMethod = 'creditCard';
            } else if (text.includes('2') || text.includes('cash')) {
                conversationState.paymentMethod = 'cash';
            } else if (text.includes('3') || text.includes('room')) {
                conversationState.paymentMethod = 'roomCharge';
            }
            
            if (conversationState.paymentMethod) {
                conversationState.step = 'complete';
                createConfetti();
                return [
                    `<div class="success-animation">
                        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                            <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                        </svg>
                    </div>`,
                    getTranslation('paymentConfirmed', lang)
                        .replace('{method}', getTranslation(conversationState.paymentMethod, lang)),
                    getTranslation('thankYou', lang)
                ];
            }
            return showPaymentOptions();
            
        default:
            return [getTranslation('notUnderstood', lang)];
    }
}

function processOrder(text) {
    const lang = conversationState.language;
    const orderPattern = /(\d+)?\s*([a-zA-Z]+)/g;
    let match;
    let orderedItems = [];
    
    while ((match = orderPattern.exec(text)) !== null) {
        const quantity = match[1] ? parseInt(match[1]) : 1;
        const itemKey = match[2].toLowerCase();
        
        if (menuItems[itemKey]) {
            orderedItems.push({
                ...menuItems[itemKey],
                quantity: quantity,
                specialRequest: ''
            });
        }
    }
    
    if (orderedItems.length > 0) {
        conversationState.orders.push(...orderedItems);
        return [
            getTranslation('addedToOrder', lang).replace('{count}', orderedItems.length),
            ...showCurrentOrder(),
            getTranslation('modifyPrompt', lang),
            getTranslation('specialRequestPrompt', lang),
            getTranslation('schedulePrompt', lang)
        ];
    }
    
    return [getTranslation('notUnderstood', lang)];
}

// Improved order modification function


// UI Functions
function showVisualMenu() {
    const lang = conversationState.language;
    const menuMessages = [];
    
    // Clear any existing menu cards
    document.querySelectorAll('.menu-card').forEach(card => card.remove());
    
    Object.values(menuItems).forEach(item => {
        const menuCard = document.createElement('div');
        menuCard.className = 'menu-card';
        menuCard.innerHTML = `
            <img src="${item.image}" alt="${item.name[lang]}">
            <div class="menu-details">
                <div class="menu-title">
                    <span>${item.name[lang]}</span>
                    <span class="menu-price">₹${item.price.toFixed(2)}</span>
                </div>
                <div class="menu-tags">
                    <span class="tag ${item.category}">
                        ${item.category === 'veg' ? getTranslation('vegetarian', lang) : 
                          item.category === 'non-veg' ? getTranslation('nonVegetarian', lang) : 
                          getTranslation('glutenFree', lang)}
                    </span>
                </div>
                <div class="spicy-level">
                    ${getSpicyLevelIcons(item.spicy)} ${getTranslation('spicyLevel', lang)}: ${item.spicy}/5
                </div>
                <p>${item.description[lang]}</p>
                <button class="add-to-order" data-item="${item.id}">
                    ${getTranslation('addToOrder', lang)}
                </button>
            </div>
        `;
        chatMessages.appendChild(menuCard);
        
        menuCard.querySelector('.add-to-order').addEventListener('click', function() {
            addToOrder(this.dataset.item);
        });
    });
    
    menuMessages.push(getTranslation('orderPrompt', lang));
    return menuMessages;
}

function getSpicyLevelIcons(level) {
    let icons = '';
    for (let i = 0; i < level; i++) {
        icons += '🌶';
    }
    return icons;
}

function showCurrentOrder() {
    const lang = conversationState.language;
    const orderMessages = [];
    
    if (conversationState.orders.length === 0) {
        return [getTranslation('emptyOrder', lang)];
    }
    
    orderMessages.push(`<strong>${getTranslation('yourOrder', lang)}</strong>`);
    
    let total = 0;
    conversationState.orders.forEach((item, i) => {
        const itemTotal = item.price * item.quantity;
        orderMessages.push(`
            <div class="order-item">
                <span>${item.quantity}x ${item.name[lang]} ${getSpicyLevelIcons(item.spicy)}</span>
                <span>₹${itemTotal.toFixed(2)}</span>
            </div>
        `);
        if (item.specialRequest) {
            orderMessages.push(`<div style="padding-left:20px;font-size:0.9em;">${item.specialRequest}</div>`);
        }
        total += itemTotal;
    });
    
    orderMessages.push(`
        <div class="order-total">
            <span>${getTranslation('total', lang)}:</span>
            <span>₹${total.toFixed(2)}</span>
        </div>
    `);
    
    if (conversationState.scheduledTime) {
        orderMessages.push(`<div>🕒 ${conversationState.scheduledTime}</div>`);
    }
    
    // Add action buttons
    orderMessages.push(`
        <div class="suggested-actions">
            <div class="suggestion-chip" data-action="addMore">${getTranslation('addMore', lang)}</div>
            <div class="suggestion-chip" data-action="modifyOrder">${getTranslation('modifyOrder', lang)}</div>
            <div class="suggestion-chip" data-action="confirmOrder">${getTranslation('confirmOrderBtn', lang)}</div>
        </div>
    `);
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = orderMessages.join('');
    chatMessages.appendChild(messageDiv);
    
    // Add click handlers to action buttons
    messageDiv.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const action = chip.dataset.action;
            handleActionButton(action);
        });
    });
    
    return [];
}

function handleActionButton(action) {
    const lang = conversationState.language;
    
    switch(action) {
        case 'addMore':
            showVisualMenu();
            break;
            
        case 'modifyOrder':
            addBotMessage(getTranslation('modifyPrompt', lang));
            break;
            
        case 'confirmOrder':
            if (conversationState.orders.length === 0) {
                addBotMessage(getTranslation('emptyOrder', lang));
                showVisualMenu();
            } else {
                conversationState.step = 'payment';
                createConfetti();
                showPaymentOptions();
            }
            break;
    }
}

function showPaymentOptions() {
    const lang = conversationState.language;
    const paymentDiv = document.createElement('div');
    paymentDiv.className = 'message bot-message';
    paymentDiv.innerHTML = `
        <strong>${getTranslation('paymentOptions', lang)}</strong>
        <div class="payment-options">
            <div class="payment-option" data-method="1. ${getTranslation('creditCard', lang)}">
                <div class="payment-icon">💳</div>
                <div>${getTranslation('creditCard', lang)}</div>
            </div>
            <div class="payment-option" data-method="2. ${getTranslation('cash', lang)}">
                <div class="payment-icon">💵</div>
                <div>${getTranslation('cash', lang)}</div>
            </div>
            <div class="payment-option" data-method="3. ${getTranslation('roomCharge', lang)}">
                <div class="payment-icon">🏨</div>
                <div>${getTranslation('roomCharge', lang)}</div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(paymentDiv);
    
    // Add click handlers to payment options
    paymentDiv.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', () => {
            userInput.value = option.dataset.method;
            sendMessage();
        });
    });
    
    return [];
}

// Helper functions
function updateLanguageUI() {
    userInput.placeholder = getTranslation('typeHere', conversationState.language);
    sendButton.title = getTranslation('send', conversationState.language);
}

function getTranslation(key, lang) {
    return translations[lang]?.[key] || translations.en[key] || key;
}

function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'message user-message';
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(text, type = 'normal') {
    if (!text) return;
    
    const div = document.createElement('div');
    div.className = `message ${type === 'error' ? 'error-message' : 'bot-message'}`;
    
    if (typeof text === 'string' && text.startsWith('<')) {
        div.innerHTML = text;
    } else {
        div.textContent = text;
    }
    
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const div = document.createElement('div');
    div.className = 'typing-indicator';
    div.id = 'typing-indicator';
    div.innerHTML = `
        <span>${getTranslation('typing', conversationState.language)}</span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

function addToOrder(itemKey) {
    const item = menuItems[itemKey];
    const lang = conversationState.language;
    
    conversationState.orders.push({
        ...item,
        quantity: 1,
        specialRequest: ''
    });
    
    addBotMessage(getTranslation('addedToOrder', lang).replace('{count}', 1));
    showCurrentOrder();
}

function modifyOrder(command) {
    const lang = conversationState.language;
    const normalize = str => str.toLowerCase().replace(/s$/, '');  // remove plural 's'

    // Remove command
    const removeMatch = command.match(/remove\s+(\d+)?\s*([a-zA-Z]+)/i);
    if (removeMatch) {
        const quantity = removeMatch[1] ? parseInt(removeMatch[1]) : 1;
        const itemNameRaw = normalize(removeMatch[2]);

        const itemIndex = conversationState.orders.findIndex(item =>
            normalize(item.id) === itemNameRaw ||
            normalize(item.name[lang]) === itemNameRaw ||
            normalize(item.name.en) === itemNameRaw
        );

        if (itemIndex !== -1) {
            const currentQty = conversationState.orders[itemIndex].quantity;
            const removedQty = Math.min(currentQty, quantity);
            conversationState.orders[itemIndex].quantity -= removedQty;
            if (conversationState.orders[itemIndex].quantity <= 0) {
                conversationState.orders.splice(itemIndex, 1);
            }
            return getTranslation('orderRemoved', lang)
                .replace('{qty}', removedQty)
                .replace('{item}', itemNameRaw);
        } else {
            return getTranslation('modifyError', lang);
        }
    }

    // Change command
    const changeMatch = command.match(/change\s+(\d+)\s*([a-zA-Z]+)\s+to\s+(\d+)/i);
    if (changeMatch) {
        const oldQty = parseInt(changeMatch[1]);
        const itemNameRaw = normalize(changeMatch[2]);
        const newQty = parseInt(changeMatch[3]);

        const itemIndex = conversationState.orders.findIndex(item =>
            normalize(item.id) === itemNameRaw ||
            normalize(item.name[lang]) === itemNameRaw ||
            normalize(item.name.en) === itemNameRaw
        );

        if (itemIndex !== -1) {
            conversationState.orders[itemIndex].quantity = newQty;
            return getTranslation('orderUpdated', lang)
                .replace('{item}', itemNameRaw)
                .replace('{qty}', newQty);
        } else {
            return getTranslation('modifyError', lang);
        }
    }

    return getTranslation('modifyError', lang);
}

