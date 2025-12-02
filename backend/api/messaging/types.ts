// router.response
export type MessageResponse = { message: string, id: string, timestamp: number }
export type SharePublicKeyResponse = { status: string }
export type WebrtcSessionResponse = { status: string }
export type GetPublicKeyResponse = { publicKey: string | null, aesKey: string | null }
export type UsersInChannelResponse = { uuid: string }[]


// socket.emit
export type ChatMessageType = {
    channel: string,
    sender: string,
    message: string,
    id: number,
    timestamp: number,
    image?: string,
    audio?: string
}
