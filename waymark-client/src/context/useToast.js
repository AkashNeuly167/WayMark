import { useContext } from "react";
import ToastContext from "./toastContextCore";

export const useToast = () => useContext(ToastContext);