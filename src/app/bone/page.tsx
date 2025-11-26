"use client";
import { useRouter } from "next/navigation";
import { Button } from 'react-bootstrap';

const BonesPage = () => {
    const router = useRouter();

    const handleBtn = () => {
        router.push('/');
    }
  return <div>Bones Page Content
    <div>
        <Button variant="danger">Bone</Button>
        <button onClick={() => handleBtn()}>Back</button>
    </div>
  </div>;
}

export default BonesPage;