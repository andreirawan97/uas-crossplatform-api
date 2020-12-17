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
  const reqBody =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { email, password } = reqBody;

  const secretSnapshot = await firestore.collection("secrets").doc(email).get();
  const secretData = secretSnapshot.data();

  if (secretData && password === secretData.secret) {
    const userSnapshot = await firestore.collection("users").doc(email).get();
    const userData = userSnapshot.data();

    res.set({ "Access-Control-Allow-Origin": "*" });
    res.send({
      success: true,
      message: "OK",
      data: {
        email,
        firstName: userData.firstName,
        lastName: userData.lastName,
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
  const reqBody =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { email, password, firstName, lastName } = reqBody;

  const userSnapshot = await firestore.collection("users").doc(email).get();
  const userData = userSnapshot.data();

  if (userData) {
    res.set({ "Access-Control-Allow-Origin": "*" });
    res.send({
      success: false,
      message: "Account already exist!",
      data: {},
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
        firstName,
        lastName,
      },
    });
  }
});

exports.addNewLocation = functions.https.onRequest(async (req, res) => {
  const reqBody =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { email, name, lat, long, date } = reqBody;

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
  const reqBody =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { email } = reqBody;

  const locationsSnapshot = await firestore
    .collection("locations")
    .doc(email)
    .get();
  const locationsData = locationsSnapshot.data();

  res.set({ "Access-Control-Allow-Origin": "*" });
  res.send({
    success: true,
    message: "OK",
    data: locationsData ? locationsData : [],
  });
});

exports.addNewFriend = functions.https.onRequest(async (req, res) => {
  const reqBody =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { email, friendEmail } = reqBody;

  const userSnapshot = await firestore.collection("users").doc(email).get();
  const userData = userSnapshot.data();
  console.log(userData);

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
      const friendFriendSnapshot = await firestore
        .collection("friends")
        .doc(friendEmail)
        .get();
      let friendFriendData = friendFriendSnapshot.data();

      friendData.friends.push({ ...newFriendData });
      friendFriendData.friends.push({ ...userData });

      await firestore.collection("friends").doc(email).set(friendData);
      await firestore
        .collection("friends")
        .doc(friendEmail)
        .set(friendFriendData);

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
  const reqBody =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { email } = reqBody;

  const friendSnapshot = await firestore.collection("friends").doc(email).get();
  const friendData = friendSnapshot.data();

  res.set({ "Access-Control-Allow-Origin": "*" });
  res.send({
    success: true,
    message: "OK",
    data: friendData ? friendData : [],
  });
});

exports.removeFriend = functions.https.onRequest(async (req, res) => {
  const reqBody =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const { email, friendEmail } = reqBody;

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
