import { Outlet } from 'react-router-dom'
import type {PresentationType} from "./PresentaionType.ts";
import {useEffect, useRef, useState} from "react";
import {getPresentationList, UpdatePresentationList} from "../api.ts";
import Popup from "./Popup.tsx";
import {Box} from "@mui/material";
import LoadingIcon from "./LoadingIcon.tsx";

export type UserOutletContext = {
  presentationList: PresentationType[];
  setErrorMessage: (_message: string) => void;
  getPresentation: (_id: string | undefined) => PresentationType | null;
  appendPresentation: (_newPresentation: PresentationType) => Promise<void>;
  pushPresentation: (_newPresentation: PresentationType) => Promise<void>;
  deletePresentation: (_id: string) => Promise<void>;
};

export default function User(){

  const [presentationList, setPresentationListState] = useState<PresentationType[]>([]);
  const presentationListRef = useRef<PresentationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  function setPresentationList(list: PresentationType[]) {
    presentationListRef.current = list; // 用于异步更新(定时器)
    setPresentationListState(list); // 用于更新渲染
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

  // http://localhost:3000/user/:presentation/:id
  function getPresentation(id: string | undefined): PresentationType | null {
    const matched = presentationListRef.current.find(p => p.id === id);
    return structuredClone(matched) || null;
  }

  async function appendPresentation(newPresentation: PresentationType) {
    newPresentation = structuredClone(newPresentation);
    const newList = [...presentationListRef.current, newPresentation];
    await updateList(newList);
  }

  async function deletePresentation(id: string) {
    const newList = presentationListRef.current.filter(
      p => p.id !== id
    );
    await updateList(newList);
  }

  async function pushPresentation(newPresentation: PresentationType) {
    newPresentation = structuredClone(newPresentation);
    const newList = presentationListRef.current.map(p =>
      p.id === newPresentation.id ? newPresentation : p
    );
    await updateList(newList);
  }

  useEffect(() => {
    void loadPresentationlist();
  }, []);

  const contextValue: UserOutletContext = {
    presentationList,   // 提供给 Dashboard
    appendPresentation, // 提供给 Dashboard
    getPresentation,    // 提供给 Presentation
    pushPresentation,   // 提供给 Presentation
    setErrorMessage,    // 提供给 Dashboard, Presentation
    deletePresentation, // 提供给 Dashboard, Presentation
  };

  const errorPopup = <Popup message={errorMessage} onClose={() => setErrorMessage('')} />;

  return (
    <Box sx={{minHeight: '100vh'}}>
      {errorMessage && errorPopup}
      {loading ? <LoadingIcon /> : <Outlet context={contextValue} />}
    </Box>
  );
}