// DynamicNylasLogin.tsx
import dynamic from 'next/dynamic';

const DynamicNylasLogin = dynamic(() => import('./nylasLogin'), {
  ssr: false, // Avoid rendering on the server
});

export default DynamicNylasLogin;
