import { getServerSession } from 'next-auth'; 
import { options } from '@/app/api/auth/[...nextauth]/options';

export default async function ProfilePage() {
    const session = await getServerSession(options); 
    
    

  return (
    <div>UserProfile</div>
  )
}
