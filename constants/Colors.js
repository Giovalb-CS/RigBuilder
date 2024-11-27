const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
  theme: {
    white: '#fffcf2',
    lightGrey: '#CCC5B921',
    grey: '#403D3977',
    darkgrey: '#1a1818',
    orange: '#eb5e28',
  },
  popup: {
    background: '#757575e3',
    border: '#ffffff62',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    boxShadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    textShadow: {
      textShadowColor: "#0000004b",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 3.84,
      elevation: 5,
    }
  },
  button: {
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    button: {
      backgroundColor: '#eb5e28',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
    },
    buttonText: {
      color: '#fffcf2',
      fontSize: 16,
      fontWeight: "bold",
    }
  },
};
