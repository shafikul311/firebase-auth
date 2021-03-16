import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { useState } from "react";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignIn: false,
    name: "",
    email: "",
    photo: "",
  });

  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        const { displayName, email, photoURL } = res.user;
        const isSignedIn = {
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(isSignedIn);
        console.log(displayName, email, photoURL);
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
      });
  };


  const handlefbSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(fbProvider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        var user = result.user;

        console.log("fb user",user);

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        console.log(errorCode ,errorMessage ,email)


        // ...
      });
  };

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        const signOutUser = {
          isSignIn: false,
          name: "",
          email: "",
          password: "",
          photo: "",
          success: false,
        };
        setUser(signOutUser);
      });
    console.log((err) => {});
  };

  const handleBlur = (e) => {
    // console.log(e.target.name)
    // console.log(e.target.value)

    let isFromValid = true;

    if (e.target.name === "email") {
      isFromValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6;
      const passwoedHasNumber = /\d{1}/.test(e.target.value);
      isFromValid = isPasswordValid && passwoedHasNumber;
    }
    if (isFromValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  };

  const handleSubmit = (e) => {
    // console.log(user.email && user.password);
    if (newUser && user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.success = true;

          // console.log(res)
          setUser(newUserInfo);
          updateUsrInfo(user.name);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          console.log(error);
          setUser(newUserInfo);
        });
    }
    if (!newUser && user.email && user.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.success = true;

          // console.log(res)
          setUser(newUserInfo);
          console.log("sign in user info ", res.user);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          console.log(error);
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  };

  const updateUsrInfo = (name) => {
    const user = firebase.auth().currentUser;

    user
      .updateProfile({
        displayName: name,
        photoURL: name,
      })
      .then(function () {
        // Update successful.
        console.log("user name update successfully");
      })
      .catch(function (error) {
        // An error happened.
        console.log(error);
      });
  };

  
  return (
    <div className="App">
      {user.isSignIn ? (
        <button onClick={handleSignOut}>sign out</button>
      ) : (
        <button onClick={handleSignIn}>sign in</button>
      )}

      <br />
      <button onClick={handlefbSignIn}>Sign in using Facebook</button>

      {user.isSignIn && (
        <div>
          <p>welcome {user.name}</p>
          <p>your Email: {user.email}</p>
          <img src={user.photo} alt="name" />
        </div>
      )}
      {/* login From creation */}

      <h1 >Our own Authentication </h1>
      <input
        type="checkbox"
        onChange={() => setNewUser(!newUser)}
        name="newUser"
        id=""
      />
      <label htmlFor="newUser"> New User for Sign up</label>

      {/* <p>Email :{user.email}</p>
      <p>Password:{user.password}</p>
      <p>name : {user.name}</p> */}

      <form onSubmit={handleSubmit}>
        {newUser && (
          <input
            type="text"
            name="name"
            onBlur={handleBlur}
            placeholder="your name"
            id=""
          />
        )}

        <br />
        <input
          type="email"
          onBlur={handleBlur}
          name="email"
          placeholder="Enter your Email"
          required
          id=""
        />
        <br />
        <input
          type="password"
          onBlur={handleBlur}
          placeholder="password"
          required
          name="password"
          id=""
        />
        <br />
        <br />
        <input type="submit" value={newUser ? "Sign Up " : "Sign In"} />
      </form>

      <p style={{ color: "red", fontSize: "40px" }}>{user.error}</p>

      {user.success && (
        <p style={{ color: "green", fontSize: "40px" }}>
          User {newUser ? "created" : "Logged in"} successfully
        </p>
      )}
    </div>
  );
}

export default App;
