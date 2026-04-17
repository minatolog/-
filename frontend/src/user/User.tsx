import { Outlet } from 'react-router-dom';
import type { PresentationType } from './PresentaionType';
import { useState,useRef } from 'react';
import { getPresentationList } from '../api';

export default function User() {
  const [presentationist, setPresentationist] = useState<PresentationType[]>([]);
  const presentationistRef = useRef<PresentationType[]>(presentationist);
  const [loading, setLoading] = useState(true);
  const [errormessage, setErrormessage] = useState('');
  
  function setPresentationList(presentationList: PresentationType[]) {
    presentationistRef.current = presentationList;
    setPresentationist(presentationList);
  }
    async function loadPresentationlist() {
    setLoading(true);
    try {
      const list = await getPresentationList();
      setPresentationList(list);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to load presentations.'
      );
    } finally {
      setLoading(false);
    }
  }

 async function updateList(newList: PresentationType[]) {
    try {
      await UpdatePresentationList(newList);
      setPresentationList(newList);
    } catch {
      throw Error('failed to save');
    }
  }






  return (
    <>
      <Outlet />
    </>
  );
} 