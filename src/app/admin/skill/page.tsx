import { getSkillsAction } from "@/actions/skill.action";
import Skill from "@/components/admin/skill/Skill";

export default async function page() {
   const dataSkills = await getSkillsAction();
   return <Skill dataSkills={dataSkills} />;
}
