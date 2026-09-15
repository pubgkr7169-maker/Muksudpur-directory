import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Muksudpur Directory | Important local phone numbers',icons:{icon:'/favicon.svg'},description:'Find and call essential services in Muksudpur. Large, easy-to-read contacts, saved numbers and emergency helplines.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}


