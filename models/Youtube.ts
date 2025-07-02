export interface GoogleUser {
  id: string
  name: string
  email: string
  picture: string
  given_name?: string
  family_name?: string
}

export interface YoutubeConnection {
  username: string
  email: string
  avatar?: string
  userId: string
  accessToken: string
  refreshToken: string
  isActive: boolean
  expiredDate: string
  createdAt: Date
  updatedAt: Date
}
