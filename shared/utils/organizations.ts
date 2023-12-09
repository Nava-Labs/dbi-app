export function getOrgsAdmin(organizations:any){
 let orgsAdmins: any = {}
 for (let i = 0; i < organizations.length; i++) {
   orgsAdmins[organizations[i].creator.toLowerCase()] =
     organizations[i].name;
 }
 return orgsAdmins;
}