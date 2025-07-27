export interface PinterestBoard {
  id: string
  name: string
  description: string
  image: string
}

export interface PinterestCredential {
  accessToken: string
  refreshToken: string
  expiredDate: string
}

export interface PinterestConnection {
  pinterestId: string
  avatar: string
  username: string
  businessName: string
  boardId: string
  boardName: string
  boardAvatar: string
  boardDescription: string
  accessToken: string
  refreshToken: string
  expiredDate: string
  isActive: boolean
}
