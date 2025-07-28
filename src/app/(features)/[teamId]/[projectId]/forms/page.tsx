import { redirect } from "next/navigation";

export default function Page() {
    redirect("forms/new");
    return null;
}