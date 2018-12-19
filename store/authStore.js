import { decorate, observable } from "mobx";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { AsyncStorage } from "react-native";

class AuthStore {
  constructor() {
    (this.user = null), (this.isAuthentication = false);
  }

  loginUser(userData) {
    axios
      .post("http://coffee.q8fawazo.me/api/login/", userData)
      .then(res => res.data)
      .then(user => {
        const decodeUser = jwt_decode(user.token);
        setAuthToken(user.token);
        setCurrentUser(decodeUser);
      })
      .catch(err => console.error(err.response));
  }

  registerUser(userData) {
    axios
      .post("http://coffee.q8fawazo.me/api/register/", userData)
      .then(res => res.data)
      .then(user => {
        this.loginUser(userData);
      })
      .catch(err => console.error(err.response));
  }

  setCurrentUser(decodeUser) {
    if (decodeUser) {
      this.user = decodeUser;
      this.isAuthentication = true;
    } else {
      this.user = null;
      this.isAuthentication = false;
    }
  }

  setAuthToken(token) {
    if (token) {
      AsyncStorage.setItem("token", this.user.token);
      axios.defaults.headers.common.Authorization = `jwt ${token}`;
    } else {
      AsyncStorage.removeItem("token");
    }
  }

  checkForToken() {
    if (AsyncStorage.getItem("token")) {
      setCurrentUser();
      setAuthToken(AsyncStorage.getItem("token"));
    }
  }

  logoutUser() {
    this.setAuthToken();
    this.setCurrentUser();
  }
}

decorate(AuthStore, {
  user: observable,
  isAuthentication: observable
});

export default new AuthStore();
