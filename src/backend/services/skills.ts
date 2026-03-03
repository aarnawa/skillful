import { db } from "@/db";
import { skills } from "@/db/schema";

export type SkillTreeNode = {
    id: number;
    name: string;
    description: string;
    icon: string;
    color: string;
    parentId: number | null;
    level: number;
    order: number;
    children: SkillTreeNode[];
};

export async function getSkillTree(): Promise<SkillTreeNode[]> {
    const allSkills = await db.select().from(skills);

    // Build tree
    const map = new Map<number, SkillTreeNode>();
    for (const s of allSkills) {
        map.set(s.id, { ...s, children: [] });
    }

    const roots: SkillTreeNode[] = [];
    for (const node of map.values()) {
        if (node.parentId === null) {
            roots.push(node);
        } else {
            const parent = map.get(node.parentId);
            if (parent) parent.children.push(node);
        }
    }

    const sortChildren = (nodes: SkillTreeNode[]) => {
        nodes.sort((a, b) => a.order - b.order);
        nodes.forEach((n) => sortChildren(n.children));
    };
    sortChildren(roots);

    return roots;
}
