export interface ContactInfo {
  address: string
  phone: string
  mobile: string
  email: string
  startDate: string
}

export interface UserProfile {
  userId: number
  name: string
  position: string
  photoUrl: string
  contact: ContactInfo
  experience?: string
  education?: string
}
