import type {MouseEvent} from "react";
import type {SlideElement} from "../PresentaionType.ts";
import {Box, Typography} from "@mui/material";

type ElementRendererProps = {
  element: SlideElement;
  onDelete: () => void;
};

export default function ElementRenderer({ element, onDelete }: ElementRendererProps) {
  const commonSx = {
    position: 'absolute',
    left: `${element.x}%`,
    top: `${element.y}%`,
    width: `${element.width}%`,
    height: `${element.height}%`,
    zIndex: element.layer,
    border: '1px solid',
    borderColor: 'grey.400',
    overflow: 'hidden',
    bgcolor: '#fff',
  };

  function handleContextMenu(event: MouseEvent) {
    event.preventDefault();
    onDelete();
  }

  switch (element.type) {
  case 'text':
    return (
      <Box sx={{ ...commonSx, p: 1 }} onContextMenu={handleContextMenu}>
        <Typography
          sx={{
            fontSize: `${element.fontSize}em`,
            color: element.color,
            whiteSpace: 'pre-wrap',
            overflow: 'auto',
            width: '100%',
            height: '100%',
          }}
        >
          {element.text}
        </Typography>
      </Box>
    );
  case 'image':
    return (
      <Box
        sx={{ ...commonSx, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onContextMenu={handleContextMenu}
      >
        {element.src ? (
          <Box
            component="img"
            src={element.src}
            alt={element.alt}
            sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        ) : (
          <Typography variant="caption" color="text.secondary">
            Empty image
          </Typography>
        )}
      </Box>
    );
  case 'video':
    return (
      <Box
        sx={{ ...commonSx, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onContextMenu={handleContextMenu}
      >
        <Typography variant="caption" color="text.secondary">
          Video placeholder
        </Typography>
      </Box>
    );
  case 'code':
    return (
      <Box sx={{ ...commonSx, p: 1, bgcolor: 'grey.100' }} onContextMenu={handleContextMenu}>
        <Box
          component="pre"
          sx={{
            m: 0,
            width: '100%',
            height: '100%',
            overflow: 'auto',
            fontSize: `${element.fontSize}em`,
            fontFamily: 'monospace',
          }}
        >
          {element.code}
        </Box>
      </Box>
    );
  }
}
