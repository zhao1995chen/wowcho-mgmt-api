import { Document } from 'mongoose'

interface IBusinessProfile extends Document {
  businessName: string,
  businessIntro: string,
  businessImage: string,
  businessEmail: string,
  facebook: string,
  instagram: string,
  website: string
}

export {
  IBusinessProfile
}