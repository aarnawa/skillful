import { db } from "./index";
import { skills, users, userProgress } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Basketball skill tree for beginners.
 * Structure: Root → 6 categories → ~5 sub-skills each.
 * Every sub-skill includes a description to guide practice.
 */
const basketballTree = {
    name: "Basketball",
    description: "Master the fundamentals of basketball from the ground up.",
    icon: "basketball",
    color: "#D4AF37",
    children: [
        {
            name: "Ball Handling",
            description: "Control the ball with confidence in any situation.",
            icon: "hand",
            color: "#E8B830",
            children: [
                {
                    name: "Stationary Dribbling",
                    description:
                        "Practice low, controlled dribbles while standing still. Focus on keeping your head up and using your fingertips.",
                    icon: "hand",
                    color: "#E8B830",
                },
                {
                    name: "Crossover",
                    description:
                        "Quickly switch the ball from one hand to the other in front of your body. Start slow, then speed up as you get comfortable.",
                    icon: "crossover",
                    color: "#E8B830",
                },
                {
                    name: "Between the Legs",
                    description:
                        "Dribble the ball between your legs to change direction. Great for protecting the ball from defenders.",
                    icon: "between-legs",
                    color: "#E8B830",
                },
                {
                    name: "Behind the Back",
                    description:
                        "Wrap the dribble behind your back to switch hands. An advanced move that helps you avoid reaching defenders.",
                    icon: "behind-back",
                    color: "#E8B830",
                },
                {
                    name: "Speed Dribble",
                    description:
                        "Push the ball out in front and sprint with it. Used to quickly advance up the court in the open floor.",
                    icon: "speed",
                    color: "#E8B830",
                },
            ],
        },
        {
            name: "Shooting",
            description: "Develop a reliable, repeatable shooting form.",
            icon: "target",
            color: "#C0392B",
            children: [
                {
                    name: "Free Throws",
                    description:
                        "Uncontested shots from the foul line. Focus on consistent form, follow-through, and rhythm.",
                    icon: "flag",
                    color: "#C0392B",
                },
                {
                    name: "Layups",
                    description:
                        "Finish at the rim off one or two steps. Practice with both hands — right side/right hand, left side/left hand.",
                    icon: "layup",
                    color: "#C0392B",
                },
                {
                    name: "Mid-Range",
                    description:
                        "Pull-up or catch-and-shoot from the elbow and baseline areas. Builds rhythm and footwork.",
                    icon: "mid-range",
                    color: "#C0392B",
                },
                {
                    name: "Three-Point",
                    description:
                        "Shoot from beyond the arc. Start close and gradually move back as your form and strength improve.",
                    icon: "three-point",
                    color: "#C0392B",
                },
                {
                    name: "Floater",
                    description:
                        "A soft, high-arcing shot in the lane used to score over taller defenders. Requires touch and feel.",
                    icon: "floater",
                    color: "#C0392B",
                },
            ],
        },
        {
            name: "Passing",
            description: "Move the ball quickly and accurately to teammates.",
            icon: "handshake",
            color: "#2980B9",
            children: [
                {
                    name: "Chest Pass",
                    description:
                        "A two-handed pass from your chest to a teammate's chest. The most fundamental and common pass.",
                    icon: "arrow-right",
                    color: "#2980B9",
                },
                {
                    name: "Bounce Pass",
                    description:
                        "Pass the ball so it bounces once before reaching your teammate. Great for getting around defenders.",
                    icon: "arrow-down",
                    color: "#2980B9",
                },
                {
                    name: "Overhead Pass",
                    description:
                        "Pass the ball from above your head with two hands. Used for outlet passes and skip passes.",
                    icon: "arrow-up",
                    color: "#2980B9",
                },
                {
                    name: "No-Look Pass",
                    description:
                        "Deliver a pass while looking in a different direction to deceive the defense. Requires court awareness.",
                    icon: "eye",
                    color: "#2980B9",
                },
            ],
        },
        {
            name: "Defense",
            description: "Stop your opponent and create turnovers.",
            icon: "shield",
            color: "#27AE60",
            children: [
                {
                    name: "Defensive Stance",
                    description:
                        "Stay low with a wide base, hands active, and feet shoulder-width apart. The foundation of all defense.",
                    icon: "shield",
                    color: "#27AE60",
                },
                {
                    name: "Lateral Sliding",
                    description:
                        "Move side to side in defensive stance without crossing your feet. Essential for staying in front of your man.",
                    icon: "lateral-slide",
                    color: "#27AE60",
                },
                {
                    name: "Closeouts",
                    description:
                        "Sprint toward a shooter, then chop your feet to contest without fouling. Balance speed and control.",
                    icon: "closeout",
                    color: "#27AE60",
                },
                {
                    name: "Rebounding",
                    description:
                        "Box out your opponent and secure the ball after a missed shot. Positioning and timing are key.",
                    icon: "rebound",
                    color: "#27AE60",
                },
                {
                    name: "Steals",
                    description:
                        "Read the opponent's dribble or passing lanes and snatch the ball. Requires anticipation, not just reach.",
                    icon: "steal",
                    color: "#27AE60",
                },
            ],
        },
        {
            name: "Footwork",
            description: "Move efficiently and create separation with your feet.",
            icon: "shoe",
            color: "#8E44AD",
            children: [
                {
                    name: "Triple Threat",
                    description:
                        "Hold the ball in a position where you can shoot, dribble, or pass. The starting point of every offensive move.",
                    icon: "trident",
                    color: "#8E44AD",
                },
                {
                    name: "Pivot Moves",
                    description:
                        "Use one foot as an anchor and rotate to create angles for passing or shooting. Prevents traveling.",
                    icon: "pivot",
                    color: "#8E44AD",
                },
                {
                    name: "Jab Step",
                    description:
                        "A quick, aggressive step toward the defender to get them off balance. Creates space for a shot or drive.",
                    icon: "jab-step",
                    color: "#8E44AD",
                },
                {
                    name: "Euro Step",
                    description:
                        "A two-step move where you take one step in one direction, then step the other way to avoid a shot blocker.",
                    icon: "euro-step",
                    color: "#8E44AD",
                },
                {
                    name: "Drop Step",
                    description:
                        "A post move where you step past a defender to get closer to the basket. Used by forwards and centers.",
                    icon: "drop-step",
                    color: "#8E44AD",
                },
            ],
        },
        {
            name: "Basketball IQ",
            description: "Read the game, make smart decisions, and play as a team.",
            icon: "brain",
            color: "#F39C12",
            children: [
                {
                    name: "Court Vision",
                    description:
                        "See the entire court and know where every player is. Practice keeping your head up at all times.",
                    icon: "court-vision",
                    color: "#F39C12",
                },
                {
                    name: "Spacing",
                    description:
                        "Maintain proper distance from teammates to stretch the defense and create driving lanes.",
                    icon: "spacing",
                    color: "#F39C12",
                },
                {
                    name: "Pick & Roll",
                    description:
                        "Set a screen (pick) for the ball handler and roll to the basket. The most common play in basketball.",
                    icon: "pick-and-roll",
                    color: "#F39C12",
                },
                {
                    name: "Fast Break",
                    description:
                        "Push the ball quickly up the court after a defensive stop to score before the defense sets up.",
                    icon: "fast-break",
                    color: "#F39C12",
                },
                {
                    name: "Off-Ball Movement",
                    description:
                        "Move without the ball to get open — cutting, screening, and relocating to create scoring opportunities.",
                    icon: "off-ball",
                    color: "#F39C12",
                },
            ],
        },
    ],
};

// ─── Seed function ────────────────────────────────────────
type SkillNode = {
    name: string;
    description: string;
    icon: string;
    color: string;
    children?: SkillNode[];
};

async function insertSkillTree(
    node: SkillNode,
    parentId: number | null,
    depth: number,
    order: number
) {
    const [inserted] = await db
        .insert(skills)
        .values({
            name: node.name,
            description: node.description,
            icon: node.icon,
            color: node.color,
            parentId,
            level: depth,
            order,
        })
        .returning();

    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            await insertSkillTree(node.children[i], inserted.id, depth + 1, i);
        }
    }
}

export async function seed() {
    // Check if already seeded
    const existingSkills = await db.select().from(skills);
    if (existingSkills.length > 0) {
        console.log("Database already seeded — skipping.");
        return { message: "Already seeded", skillCount: existingSkills.length };
    }

    // Insert skill tree
    await insertSkillTree(basketballTree, null, 0, 0);

    // Create a default user
    const [user] = await db
        .insert(users)
        .values({
            name: "Player One",
            email: "player@skillful.dev",
        })
        .returning();

    // Initialize progress for every leaf skill at level 0
    const allSkills = await db.select().from(skills);
    const leafSkills = allSkills.filter(
        (s) => !allSkills.some((other) => other.parentId === s.id)
    );

    for (const skill of leafSkills) {
        await db.insert(userProgress).values({
            userId: user.id,
            skillId: skill.id,
            currentLevel: 0,
            xp: 0,
        });
    }

    console.log(
        `Seeded ${allSkills.length} skills and ${leafSkills.length} progress entries.`
    );
    return {
        message: "Seeded successfully",
        skillCount: allSkills.length,
        progressCount: leafSkills.length,
    };
}
