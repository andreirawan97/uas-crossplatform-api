const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const firestore = admin.firestore();

const EMPTY_USER_DATA = {
  firstName: "",
  lastName: "",
  email: "",
  imageBase64: "",
};

const EMPTY_SECRET_DATA = {
  secret: "",
};

const EMPTY_LOCATION_DATA = {
  locations: [],
};

const EMPTY_FRIENDS_DATA = {
  friends: [],
};

exports.login = functions.https.onRequest(async (req, res) => {
  const { email, password } = req.body;

  const secretSnapshot = await firestore.collection("secrets").doc(email).get();
  const secretData = secretSnapshot.data();

  if (secretData && password === secretData.secret) {
    res.set({ "Access-Control-Allow-Origin": "*" });
    res.send({
      success: true,
      message: "OK",
      data: {
        email,
      },
    });
  } else {
    res.set({ "Access-Control-Allow-Origin": "*" });
    res.send({
      success: false,
      message: "Email or password is incorrect!",
      data: {},
    });
  }
});

exports.signup = functions.https.onRequest(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const userSnapshot = await firestore.collection("users").doc(email).get();
  const userData = userSnapshot.data();

  if (userData) {
    res.set({ "Access-Control-Allow-Origin": "*" });
    res.send({
      success: false,
      message: "Account already exist!",
      token: "",
    });
  } else {
    await firestore
      .collection("users")
      .doc(email)
      .set({
        ...EMPTY_USER_DATA,
        firstName,
        lastName,
        email,
      });

    // Populate the other collection when user first signup
    await firestore.collection("secrets").doc(email).set({
      secret: password,
    });
    await firestore.collection("locations").doc(email).set(EMPTY_LOCATION_DATA);
    await firestore.collection("friends").doc(email).set(EMPTY_FRIENDS_DATA);

    res.set({ "Access-Control-Allow-Origin": "*" });
    res.send({
      success: true,
      message: "OK",
      data: {
        email,
      },
    });
  }
});

exports.addNewLocation = functions.https.onRequest(async (req, res) => {
  const { email, name, lat, long, date } = req.body;

  const locationsSnapshot = await firestore
    .collection("locations")
    .doc(email)
    .get();
  let locationsData = locationsSnapshot.data();
  locationsData.locations.push({
    name,
    lat,
    long,
    date,
  });

  await firestore.collection("locations").doc(email).set(locationsData);

  res.set({ "Access-Control-Allow-Origin": "*" });
  res.send({
    success: true,
    message: "OK",
    data: locationsData,
  });
});

exports.showAllLocation = functions.https.onRequest(async (req, res) => {
  const { email } = req.body;

  const locationsSnapshot = await firestore
    .collection("locations")
    .doc(email)
    .get();
  const locationsData = locationsSnapshot.data();

  res.set({ "Access-Control-Allow-Origin": "*" });
  res.send({
    success: true,
    message: "OK",
    data: locationsData,
  });
});

exports.addNewFriend = functions.https.onRequest(async (req, res) => {
  const { email, friendEmail } = req.body;

  const userSnapshot = await firestore.collection("users").doc(email).get();
  const userData = userSnapshot.data();

  const newFriendSnapshot = await firestore
    .collection("users")
    .doc(friendEmail)
    .get();
  const newFriendData = newFriendSnapshot.data();

  if (newFriendData) {
    const friendSnapshot = await firestore
      .collection("friends")
      .doc(email)
      .get();
    let friendData = friendSnapshot.data();

    const friendFound = friendData.friends.find(
      (friendEmail_) => friendEmail_ === friendEmail
    );

    if (friendFound) {
      res.set({ "Access-Control-Allow-Origin": "*" });
      res.send({
        success: false,
        message: "Sorry, your friend is already on your list!",
        data: {},
      });
    } else {
      friendData.friends.push({ ...newFriendData });

      await firestore.collection("friends").doc(email).set(friendData);

      res.set({ "Access-Control-Allow-Origin": "*" });
      res.send({
        success: true,
        message: "OK",
        data: friendData,
      });
    }
  } else {
    res.set({ "Access-Control-Allow-Origin": "*" });
    res.send({
      success: false,
      message: "Sorry, your friend email is incorrect!",
      data: {},
    });
  }
});

exports.showAllFriend = functions.https.onRequest(async (req, res) => {
  const { email } = req.body;

  const friendSnapshot = await firestore.collection("friends").doc(email).get();
  const friendData = friendSnapshot.data();

  res.set({ "Access-Control-Allow-Origin": "*" });
  res.send({
    success: true,
    message: "OK",
    data: friendData,
  });
});

exports.removeFriend = functions.https.onRequest(async (req, res) => {
  const { email, friendEmail } = req.body;

  const friendSnapshot = await firestore.collection("friends").doc(email).get();
  const friendData = friendSnapshot.data();
  const newFriendData = friendData.friends.filter(
    (friend) => friend.email !== friendEmail
  );

  await firestore
    .collection("friends")
    .doc(email)
    .update({ friends: newFriendData });

  res.set({ "Access-Control-Allow-Origin": "*" });
  res.send({
    success: true,
    message: "OK",
    data: { friends: newFriendData },
  });
});
