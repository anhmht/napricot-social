export interface FacebookLoginResponse {
  authResponse: {
    accessToken: string
    userID: string
  } | null
  status: string
}

export interface FacebookUser {
  id: string
  name: string
  email?: string
  picture?: {
    data: {
      url: string
    }
  }
}

export interface FacebookPage {
  id: string
  name: string
  accessToken: string
  tasks: string[]
}

export interface FacebookFormData {
  appId: string
  configId: string
  pages: FacebookPage[]
  selectedPageId: string
  pageName: string
  userId: string
  username: string
  userAccessToken: string
  pageAccessToken: string
  userPicture: string
}

export interface FacebookConnection {
  facebookId: string
  facebookUsername: string
  facebookEmail?: string
  avatar?: string
  pageId: string
  pageName: string
  pageAvatar?: string
  pageCategory?: string
  pageAccessToken: string
  userAccessToken: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
