import { db } from "./firebase";

const db = getDatabase();

const reference = ref(db, 'users/' +  userId);

set( reference, {
    username : name,
    email: email,
    profile_picture: imageURL

});

writeUserData("andreaeu", "awu", "myemail@me.com", "myimageurl");
/*const distanceRef = ref(db, 'users/' + userID + '/username');
onValue(distanceRef, (snapshot) => {
    const data = snapshot.val();
    updateDistance(SVGTextPositioningElement, data);
});*/