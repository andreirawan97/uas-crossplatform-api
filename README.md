# UAS Cross Platform API
Ini API buat UAS Cross Platform.

NOTE: Kalo mau coba, pake firebase emulator. 

## Schema

1. friends
Doc: email
Collection: 
```typescript
Friend = {
    lastName: string;
    firstName: string;
    email: string;
    imageBase64: string;
}

Collection = Array<Friend>
```

2. locations
Doc: email
Collection: 
```typescript
Location = {
    date: number; // From Date.now() 
    long: number;
    lat: number;
    name: string;
}

Collection = Array<Location>
```

3. secrets
Doc: email
Collection:
```typescript
Collection = {
    secret: string; // base64
}
```

4. users
Doc: email
Collection:
```typescript
Collection = {
    lastName: string;
    firstName: string;
    email: string;
    imageBase64: string;
}
```

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


### Add New Friend

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

### Remove Friend

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

### Show All Friend

Endpoint: `showAllFriend`

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
      "friends": [
        {
          "lastName": "Irawan",
          "firstName": "Andre",
          "imageBase64": "",
          "email": "andre@gmail.com"
        }
      ] // Array of friend
    }
  }
```

### Add New Location

Endpoint: `addNewLocation`

**Request Body**
```typescript
{
	"email": "andre@gmail.com",
	"name": "Kos Andre",
	"lat": -6.250247,
	"long": 106.616089,
	"date": 1607843467
}
```

**Response**

Berhasil
```typescript
{
  "success": true,
  "message": "OK",
  "data": {
    "locations": [
      {
        "name": "Kos Andre",
        "lat": -6.250247,
        "long": 106.616089,
        "date": 1607843467
      },
      { // Lokasi terakhir
        "name": "Kos Andre",
        "lat": -6.250247,
        "long": 106.616089,
        "date": 1607843467
      }
    ]
  }
}
```

### Show All Location

Endpoint: `showAllLocation`

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
    "locations": [
      {
        "date": 1607843467,
        "long": 106.616089,
        "name": "Kos Andre",
        "lat": -6.250247
      }
    ]
  }
}
```
