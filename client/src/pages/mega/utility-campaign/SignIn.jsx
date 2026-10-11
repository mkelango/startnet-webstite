// /signin → x.startnet.in/login?src=web&lang=…&return=… (Book 1 Part B §2.2, P1 redirect).
import SnxHandoff from './SnxHandoff.jsx';

export default function SignIn() {
  return <SnxHandoff mode="signin" />;
}
