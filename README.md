# UAS Cross Platform API
Ini API buat UAS Cross Platform.

NOTE: Kalo mau coba, pake firebase emulator

## Documentation

List Endpoint yang udah ada: login, sign up, add new location, show all location, add new friend, show all friend, remove friend.

URL Local: `http://localhost:5002/uas-crossplatform/us-central1/<ENDPOINT>`

URL Production: `https://us-central1-uas-crossplatform.cloudfunctions.net/<ENDPOINT>`

### Signup

Endpoint: `signup`

**RequestBody**
```typescript
  {
    firstName: string,
    lastName: string,
    email: string,
    password: string // Udah di md5
  }
```

**Response**

Berhasil
```typescript
  {
    "success": true,
    "message": "OK",
    "data": {
      "email": "" // Email yang didaftarin
    }
  }
```


### Login

Endpoint: `login`

**Request Body**

```typescript
  {
    email: string,
    password: string // Udah di md5
  }
```

**Response**

Berhasil
```typescript
  {
    "success": true,
    "message": "OK",
    "data": {
      "email": "" // Email yang didaftarin
    }
  }
```

Email udah terdaftar
```typescript
  {
    "success": false,
    "message": "Account already exist!",
    "data": {}
  }
```

Email atau password salah / user ga ada
```typescript
  {
    "success": false,
    "message": "Email or password is incorrect!",
    "data": {}
  }
```


## Add New Friend

Endpoint: `addNewFriend`

**Request Body**
```typescript
  {
    email: string,
    friendEmail: string // Email temen
  }
```

**Response**

Berhasil
```typescript
  {
    "success": true,
    "message": "OK",
    "data": {
      "friends": [
        {
          "lastName": "",
          "firstName": "",
          "imageBase64": "",
          "email": ""
        },
        { // Teman yang baru di add muncul di paling bawah
          "lastName": "",
          "firstName": "",
          "imageBase64": "",
          "email": ""
        }
        ...
      ]
    }
  }
```

Email temen salah
```typescript
  {
    "success": false,
    "message": "Sorry, your friend email is incorrect!",
    "data": {}
  }
```

## Remove Friend

Endpoint: `removeFriend`

**Request Body**
```typescript
  {
    email: string
  }
```

**Response**

Berhasil
```typescript
  {
    "success": true,
    "message": "OK",
    "data": {
      "friends": [] // Array baru tanpa friend
    }
  }
```

## Sisanya nantian. Mager.

