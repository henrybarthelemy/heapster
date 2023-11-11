import Image from 'next/image'
import Stack from "@/app/stack/page";
import NavBar from './Navbar';
import Landing from './Landing';
export default function Home() {
  return (
    <div>
      <NavBar />
      <Landing />
      {/* <Stack /> */}
    </div>
  )
}
