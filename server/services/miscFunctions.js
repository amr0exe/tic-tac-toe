
const generateRoom = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let room = ""

    for (let i=0; i<6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        room += characters[randomIndex]
    }

    return room
}
