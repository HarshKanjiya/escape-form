import { ERROR_ROUTES } from "@/constants/routes.constants";
import { redirect } from "next/navigation";


export default function NotFound() {
    redirect(ERROR_ROUTES.NOT_FOUND);
    return null
}