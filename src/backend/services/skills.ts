import { db } from "@/db";
import { skills } from "@/db/schema";

/**
 * Represents a single node in the skill tree hierarchy.
 * Contains skill data and a list of its direct sub-skills.
 */
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

/**
 * Fetches all skills from the database and organizes them into a hierarchical tree structure.
 * Skills are sorted by their defined 'order' property at each level.
 * 
 * @returns A promise that resolves to an array of root-level SkillTreeNodes.
 */
export async function getSkillTree(): Promise<SkillTreeNode[]> {
    // 1. Fetch all skills as a flat list
    const allSkills = await db.select().from(skills);

    // 2. Map all skills by their ID for O(1) lookups during tree building
    // We initialize each node with an empty 'children' array
    const map = new Map<number, SkillTreeNode>();
    for (const s of allSkills) {
        map.set(s.id, { ...s, children: [] });
    }

    // 3. Iterate through the map to establish parent-child relationships
    const roots: SkillTreeNode[] = [];
    for (const node of map.values()) {
        if (node.parentId === null) {
            // No parent means this is a top-level category (e.g., Basketball)
            roots.push(node);
        } else {
            // Find the parent in our map and add this node to its children list
            const parent = map.get(node.parentId);
            if (parent) parent.children.push(node);
        }
    }

    // 4. Recursive helper to sort all levels of the tree by the 'order' property
    const sortChildren = (nodes: SkillTreeNode[]) => {
        nodes.sort((a, b) => a.order - b.order);
        nodes.forEach((n) => sortChildren(n.children));
    };
    
    // Sort starting from the root level
    sortChildren(roots);

    return roots;
}
