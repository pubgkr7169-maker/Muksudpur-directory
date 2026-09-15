import {isAdmin} from '../../lib/server';
import Admin from './panel';
import Login from './login';
export const dynamic='force-dynamic';
export default async function AdminPage(){return await isAdmin()?<Admin/>:<Login/>}
