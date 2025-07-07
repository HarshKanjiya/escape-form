// "use server";

// import { ICreateTeam } from "@/interfaces/common";
// import { supabase } from "@/lib/supabase/client";
// // import { auth } from "@clerk/nextjs/server";
// import { currentUser } from '@clerk/nextjs/server';
// // import { auth } from "@clerk/nextjs/server";

// export const createTeam = async (data: ICreateTeam) => {
//     const user = await currentUser();
//     if (!user) {
//         throw new Error("User not authenticated");
//     }
//     const { data: team, error } = await supabase.from('teams').insert({
//         name: data.name,
//         owner_id: user.id,
//     }).select();

//     if (error) {
//         throw new Error(error?.message || "Failed to create team");
//     }

//     return team[0];
// }