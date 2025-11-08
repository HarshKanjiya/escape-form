import { ERROR_ROUTE } from "@/constants/routes.constants";
import { redirect } from "next/navigation";


export default function NotFound() {
    redirect(ERROR_ROUTE.NOT_FOUND);
    return null
}