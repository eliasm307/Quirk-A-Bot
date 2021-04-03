import "./style/index.css";
import { h, JSX } from "preact";
import App from "./components/app";
import UserProvider from "./providers/UserProvider";

export default function Root() {
  let x;

  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}
