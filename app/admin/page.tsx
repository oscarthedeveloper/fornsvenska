import type {Metadata} from 'next';
import SiteFrame from '@/components/SiteFrame';
import StaticEditorialApp from '@/components/admin/StaticEditorialApp';
export const metadata: Metadata={title:'Administration',robots:{index:false,follow:false}};
export default function AdminPage(){return <SiteFrame centre="Administration" active="/admin"><StaticEditorialApp/></SiteFrame>;}
