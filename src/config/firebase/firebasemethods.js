import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile 
  } from "firebase/auth";
  import app from "./config";
  import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    deleteDoc,
    doc,
    updateDoc,
  } from "firebase/firestore";
  
  
  const auth = getAuth(app);
  
  //initialize firestore database
  const db = getFirestore(app);
  
  
  // register user
  let signUpUser = (obj) => {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(auth, obj.email, obj.password)
        .then(async (res) => {
          resolve((obj.id = res.user.uid));
          delete obj.password
          await addDoc(collection(db, "users"), obj)
            .then((res) => {
              console.log("user added to database successfully");
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          reject(err.message);
        });
    });
  };
  
  // login user
  let loginUser = (obj) => {
    return new Promise((resolve, reject) => {
      signInWithEmailAndPassword(auth, obj.email, obj.password)
        .then(async () => {
          const q = query(
            collection(db, "users"),
            where("id", "==", auth.currentUser.uid)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            resolve(doc.data());
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  
  //signout User
  const signOutUser = () => {
    return new Promise((resolve, reject) => {
      signOut(auth)
        .then(() => {
          resolve("user Signout Successfully");
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  
  //send data to firestore
  const sendData =  (obj, colName) => {
    return new Promise(async (resolve, reject) => {
        try {
          const docRef = await addDoc(collection(db, colName), obj );
          console.log("Document written with ID: ", docRef.id);
          resolve(docRef.id)
        } catch (e) {
          reject("Error adding document: ", e);
        }  
    });
  };
  
  //get data with id from firestore
  const getData = (colName , uid) => {
    return new Promise(async (resolve, reject) => {
      const dataArr = []
      
      const q = query(
        collection(db, colName),
        where("uid", "==", uid)
      );
      
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        dataArr.push({...doc.data() , docid: doc.id})
        resolve(dataArr);
      });
      reject("error occured");
    });
  };
  
  //get all data
  const getAllData = (colName) => {
    return new Promise(async (resolve, reject) => {
      const dataArr = []
      const querySnapshot = await getDocs(collection(db, colName));
      querySnapshot.forEach((doc) => {
        const obj = { ...doc.data(), documentId: doc.id }
        dataArr.push(obj)
        resolve(dataArr);
      });
      reject("error occured")
    })
  }
  
  //Delete document by id
  const deleteDocument = async (id, name) => {
    return new Promise((resolve, reject) => {
      deleteDoc(doc(db, name, id));
      resolve("document deleted")
      reject("error occured")
    })
  }
  
  //update document by id
  const updateDocument = async (docId, collectionName, newData) => {
    try {
      const docRef = doc(db, collectionName, docId); // Correct reference to document
      await updateDoc(docRef, newData); // Update document with new data
      return true; // Return success
    } catch (error) {
      console.error("Error updating document:", error);
      throw error; // Throw error for debugging
    }
  };

const updateUserProfile = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    updateProfile(user, {
      displayName: "User Name"
    })
      .then(() => {
        console.log("User profile updated");
      })
      .catch((error) => {
        console.log("Error updating profile:", error);
      });
  }
};

const handleSignUp = async (email, password, displayName) => {
  const auth = getAuth();
  
  try {
    // Create a user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update the displayName after registration
    await updateProfile(user, {
      displayName: displayName,  // Set the displayName here
    });

    console.log("User created and displayName set!");
  } catch (error) {
    console.log("Error signing up:", error);
  }
};


//   async function uploadImage(files , email) {
//     const storageRef = ref(storage, email);
//     try {
//       const uploadImg = await uploadBytes(storageRef, files);
//       const url = await getDownloadURL(storageRef);
//       console.log(url);
//       return url;
//     } catch (error) {
//       console.log(error);
//     }
//   }
  


const updateUsersWithUID = async () => {
  const usersRef = collection(db, "users");
  const usersSnapshot = await getDocs(usersRef);

  usersSnapshot.forEach(async (userDoc) => {
    const userData = userDoc.data();
    const uid = userData.uid || userData.id; // Assuming `id` is equivalent to `uid`

    if (!userData.uid) {
      const userRef = doc(db, "users", userDoc.id);
      await updateDoc(userRef, { uid });
      console.log(`Updated user ${userDoc.id} with UID: ${uid}`);
    }
  });
};


  export { auth, db,updateUsersWithUID, handleSignUp,updateUserProfile, signUpUser, loginUser, signOutUser, sendData, getData, getAllData, deleteDocument, updateDocument };