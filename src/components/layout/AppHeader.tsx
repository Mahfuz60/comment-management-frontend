import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";

export function AppHeader() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function onTitleClick() {
    dispatch(logout());
    navigate("/", { replace: true });
  }

  return <></>;
}
