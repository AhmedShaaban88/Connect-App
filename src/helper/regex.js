const passwordReg = /[^ ]{8,}$/
const anyReg = /^\S*$/
const phoneReg = /(201)[0-9]{9}/
const nicknameReg = /^[a-zA-Z0-9_][a-zA-Z0-9_.]{2,}$/
const personalEmailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
export {
    passwordReg,
    nicknameReg,
    anyReg,
    personalEmailReg,
    phoneReg
}
