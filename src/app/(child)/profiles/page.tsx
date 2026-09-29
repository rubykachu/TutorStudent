import { loadSubjects } from "@/content/load";
import { ProfilesScreen } from "./profiles-screen";

export default function ProfilesPage() {
  return <ProfilesScreen subjects={loadSubjects()} />;
}
