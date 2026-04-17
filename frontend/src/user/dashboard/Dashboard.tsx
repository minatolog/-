import {useState} from "react";
import { Container, Stack, Typography} from "@mui/material";
import Header from "./Header.tsx";
import {useNavigate, useOutletContext} from "react-router-dom";
import type {UserOutletContext} from "../User.tsx";
import PreviewArea from "./PreviewArea.tsx";
import type {PresentationType} from "../PresentaionType.ts";
import NewPresentationDialog from "./NewPresentationDialog.tsx";

export default function Dashboard() {

  const navigate = useNavigate();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  // 从 User 中读取 outlet context
  const {
    presentationList,
    appendPresentation,
    setErrorMessage,
  } = useOutletContext<UserOutletContext>();

  async function onCreated(newPresentation: PresentationType) {
    try {
      await appendPresentation(newPresentation);
      setDialogIsOpen(false);
      navigate(`../presentation/${newPresentation.id}/1`);
    } catch (e) {
      if (e instanceof Error) {
        setErrorMessage(e.message);
      } else {
        setErrorMessage('Failed to create presentation.');
      }
    }
  }

  const header = <Header onAddClick={() => setDialogIsOpen(true)} />;

  const emptyState = (
    <Stack
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Typography variant="h6" color="text.secondary">
        No presentations yet.
      </Typography>
    </Stack>
  );

  const newPresentationModal = (
    <NewPresentationDialog
      onClose={() => setDialogIsOpen(false)}
      onCreated={onCreated}
      onError={(message) => setErrorMessage(message)}
    />
  );

  return (
    <Stack sx={{height: '100vh'}}>
      {header}
      <Container maxWidth="md" sx={{py: 4, flexGrow: 1}}>
        {presentationList.length === 0 ?
          emptyState :
          <PreviewArea presentationList={presentationList} />}
      </Container>
      {dialogIsOpen && newPresentationModal}
    </Stack>
  )
}