// 'use server';

// import { ICreateTeam } from '@/interfaces/common';
// import { supabase } from '@/lib/supabase/client';
// import { Team } from '@/lib/supabase/database.types';
// // import { currentUser } from '@clerk/nextjs/server';

// // Create team function
// export async function createTeam(data: ICreateTeam): Promise<Team> {
//     try {


//         const user = await currentUser();

//         if (!user) {
//             throw new Error('User not authenticated');
//         }

//         const { data: team, error } = await supabase
//             .from('teams')
//             .insert({
//                 name: data.name,
//                 owner_id: user.id,
//             })
//             .select()
//             .single();

//         if (error) {
//             throw new Error(error?.message || "Failed to create team");
//         }

//         return team;

//     } catch (error) {
//         console.error('Error in createTeam:', error);
//         throw error;
//     }
// }