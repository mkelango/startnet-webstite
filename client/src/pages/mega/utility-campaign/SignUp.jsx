// /signup → x.startnet.in/signup?src=web&lang=…&return=… (Book 1 Part B §2.2, P1 redirect; §9.4 handoff:
// persona, intent and brand from the query string are passed through).
import SnxHandoff from './SnxHandoff.jsx';

export default function SignUp() {
  return <SnxHandoff mode="signup" />;
}
