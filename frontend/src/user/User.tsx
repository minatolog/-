import { Outlet } from 'react-router-dom';
import type { PresentationType } from './PresentaionType';
import { useState,useRef } from 'react';
export default function User() {
  const [presentationist, setPresentationist] = useState<PresentationType[]>([]);
  const presentationistRef = useRef<PresentationType[]>(presentationist);
  const [loading, setLoading] = useState(true);
  const [errormessage, setErrormessage] = useState('');
  
  function setPresentationList(presentationList: PresentationType[]) {
    presentationistRef.current = presentationList;
    setPresentationist(presentationList);
  }

  return (
    <>
      <Outlet />
    </>
  );
} 