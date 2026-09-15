import type {Metadata} from 'next';
import Forum from './community';
export const metadata:Metadata={title:'Community suggestions | Muksudpur Directory',description:'Suggest a useful Muksudpur business or service number in a short sentence.'};
export default function CommunityPage(){return <Forum/>}
