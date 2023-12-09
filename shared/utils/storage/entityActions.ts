import lighthouse from '@lighthouse-web3/sdk'
import { Organisation, Post, WebsiteContent } from './entityInterfaces';

interface IPNSDetails {
    ipnsName: string,
    ipnsId: string
}

const lighthouseApiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY!
let ipns: IPNSDetails = {
    ipnsName: "1172290b6daf43139d21590d997ac12d",
    ipnsId: "k51qzi5uqu5dm1n1uc574sza797o41l99sv1cox0p8tshzwv47396pprluw9to"
}

export async function initLighthouseIpns() {
    const keyResponse = await lighthouse.generateKey(lighthouseApiKey);
    ipns = keyResponse.data
}

export async function addNewOrgs(masterData: any, orgs: Organisation) {
    let data: any = masterData;
    data.organisations.push(orgs)
    
    try {
        const response = await lighthouse.uploadText(JSON.stringify(data), lighthouseApiKey)
        const cid = response.data.Hash
    
        await lighthouse.publishRecord(
            cid,
            ipns.ipnsName,
            lighthouseApiKey
        )
        return true
    } catch {return false}
}

export async function addNewPost(masterData: any, orgsId: number, post: Post) {
    let data: any = masterData;
    data.organisations[orgsId].posts.push(post)

    try {
        const response = await lighthouse.uploadText(JSON.stringify(data), lighthouseApiKey)
        const cid = response.data.Hash
        
        await lighthouse.publishRecord(
            cid,
            ipns.ipnsName,
            lighthouseApiKey
        )
        return true
    } catch {return false}
}
  
export async function getWebsiteContent(): Promise<WebsiteContent> {
    // handle if data empty or broken
    try {
        // avoid cache
        const data = await fetch(`https://gateway.lighthouse.storage/ipns/${ipns.ipnsId}?nocache=${new Date().getTime()}`)
        .then(response => {
            return response.json()
        })
        
        return data
    } catch {
        return { organisations: [] };
    }

}

export async function purgeCurrentIpnsData() {
    const emptyData: WebsiteContent = { organisations: [] };
    const response = await lighthouse.uploadText(JSON.stringify(emptyData), lighthouseApiKey)
    const cid = response.data.Hash
    
    await lighthouse.publishRecord(
        cid,
        ipns.ipnsName,
        lighthouseApiKey
    )
    console.log("Successfully purge current data")
}

export async function deleteAllDataRelatedToThisApiKey() {
    const allKeys = await lighthouse.getAllKeys(lighthouseApiKey)
    for (let i = 0; i < allKeys.data.length; i++) {
        await lighthouse.removeKey(allKeys.data[i].ipnsName, lighthouseApiKey)
    }
    console.log("Successfully delete all datas belong to this lighthouseApiKey")
}
