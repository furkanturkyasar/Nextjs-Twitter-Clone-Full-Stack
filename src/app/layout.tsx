import LeftSidebar from '@/components/leftSidebar';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import RightSection from '@/components/rightSection';
import Main from '@/components/main';
import Home from './page';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Twitter',
  description: 'Generated by create next app'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='bg-black'>
      <body className={inter.className}>
      <div className="w-full h-full flex justify-center items-center relative bg-black">
        <div className="xl:max-w-[85vw] w-full h-full flex relative">
          <LeftSidebar/>
          {/* <Home/> */}
          {children}
          <RightSection/>
        </div>
      </div>
     
      </body>
    </html>
  )
} 
