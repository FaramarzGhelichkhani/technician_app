import AsyncStorage from '@react-native-async-storage/async-storage';

export const  storeLoginData = async (value) => {
    try {
      await AsyncStorage.setItem('@username', value.username)
      await AsyncStorage.setItem('@password', value.password)
      await AsyncStorage.setItem('@token', value.token)
    } catch (e) {
      // saving error
    }

console.log('has been set.')
  }



export const getLoginData = async () => {
    try {
      var user = await AsyncStorage.getItem('@username')
      var pass = await AsyncStorage.getItem('@password') 
      var token = await AsyncStorage.getItem('@token') 
      var output = {'username':user, 'password':pass , 'token':token}
      return user != null   ? output : null;
    } catch(e) {
      console.log(e.messege)
    }

console.log('get.')
}  

export const  storeLoginState = async (LoginState) => {
  try {
    // var LoginData  = getLoginData();
    // var LoginState = LoginPermission({LoginData});
    await AsyncStorage.setItem('LoginState', JSON.stringify(LoginState))
  } catch (e) {
    // saving error
  }

console.log('Login state has been set on .', LoginState)
}

export const getLoginState = async () => {
    const LoginState = await AsyncStorage.getItem('LoginState')
    console.log(JSON.parse(LoginState),"sdcs")
    return JSON.parse(LoginState);

console.log('login state is got.')
}

export const clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
  
    console.log('clear.')
  }


export  const removepassword = async () => {
    try {
      await AsyncStorage.removeItem('@password')
    } catch(e) {
      // remove error
    }
  
    console.log('password removed.')
  }