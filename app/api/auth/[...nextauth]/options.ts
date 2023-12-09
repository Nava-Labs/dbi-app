import TwitterProvider  from 'next-auth/providers/twitter';
import type {NextAuthOptions} from "next-auth"
import { X_CLIENT_ID, X_CLIENT_SECRET } from '@/shared/helpers/constants';

export const options: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: X_CLIENT_ID,
      clientSecret: X_CLIENT_SECRET,
      version: "2.0"
    }),
  ],
}

