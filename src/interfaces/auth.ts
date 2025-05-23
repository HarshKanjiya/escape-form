export interface ISignIn {
    email: string,
    password: string
}

export interface ISignUp {
    email: string,
    username: string,
    phone: string,
    password: string,
    confirmPassword: string
}

export interface IForgotPassword {
    email: string
}