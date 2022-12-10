type UserType = {
    id?: Number,
    email: String,
    password: String
}

type SessionType = {
    id?: Number,
    userId: Number,
    token: String
}

type CredentialType = {
    id?: Number,
    title: String,
    url: String,
    username: String,
    password: String,
    userId: Number
}

type NetworkType = {
    id?: Number,
    title: String,
    network: String,
    password: String,
    userId: Number
}