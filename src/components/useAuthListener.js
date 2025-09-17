import { useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const useAuthListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ثبت listener
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      
      if (session?.user) {
        // کاربر وارد شد → اطلاعات کاربر را localStorage ذخیره کن
        localStorage.setItem('user', JSON.stringify({
          id: session.user.id,
          email: session.user.email
        }));
        // هدایت به داشبورد
        navigate('/Landing/dashboard');
      } else {
        // session نبود → هدایت به login
        navigate('/Landing/login');
      }
    });

    // پاکسازی listener هنگام unmount
    return () => listener.subscription.unsubscribe();
  }, [navigate]);
};

export default useAuthListener;
