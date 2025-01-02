import { useState } from 'react';
import { useSession } from 'next-auth/react';

export function useAdmin() {
  const { data: session } = useSession();
  const [isAdminEnabled, setIsAdminEnabled] = useState(false);

  const isAdmin = 
    session?.user?.email?.toLowerCase() === "vie4ever200@gmail.com" || 
    session?.user?.name === "Sean Mazan";

  // Only allow admin features if user is admin and admin mode is enabled
  const isAdminMode = isAdmin && isAdminEnabled;

  return {
    isAdmin,
    isAdminEnabled,
    toggleAdmin: isAdmin ? () => setIsAdminEnabled(prev => !prev) : undefined,
    isAdminMode
  };
}
