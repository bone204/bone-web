'use client'

import Link from "next/link"
import useSWR from 'swr'

export default function App() {
  const fetcher = (url: string) => fetch(url).then(res => res.json())
  const { data, error, isLoading } = useSWR(`http://localhost:4000/destinations`, fetcher)

  console.log({data})
 
  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
 
  return(
    <div>
      <div>{data?.length}</div>
      <ul>
        <li>
          <Link href="/admin"><span>Admin</span></Link>
        </li>
        <li>
          <Link href="/bone">Bone</Link>
        </li>
      </ul>
    </div>
  )
}
