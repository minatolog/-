import type {MouseEvent} from "react";
import type {SlideElement} from "../PresentaionType.ts";
import {Box, Typography} from "@mui/material";

type ElementRendererProps = {
  element: SlideElement;
  onDelete: () => void;
  onEditText: () => void;
  onEditImage: () => void;
  onEditVideo: () => void;
  onEditCode: () => void;
  readOnly?: boolean;
};

export default function ElementRenderer({
  element,
  onDelete,
  onEditText,
  onEditImage,
  onEditVideo,
  onEditCode,
  readOnly = false,
}: ElementRendererProps) {
  const commonSx = {
    position: 'absolute',
    left: `${element.x}%`,
    top: `${element.y}%`,
    width: `${element.width}%`,
    height: `${element.height}%`,
    zIndex: element.layer,
    border: readOnly ? 'none' : '1px solid',
    borderColor: readOnly ? 'transparent' : 'grey.400',
    overflow: 'hidden',
    bgcolor: '#fff',
  };

  function handleContextMenu(event: MouseEvent) {
    if (readOnly) return;
    event.preventDefault();
    onDelete();
  }

  switch (element.type) {
  case 'text':
    return (
      <Box
        sx={{ ...commonSx, p: 1 }}
        onContextMenu={handleContextMenu}
        onDoubleClick={readOnly ? undefined : onEditText}
      >
        <Typography
          sx={{
            fontSize: `${element.fontSize}em`,
            color: element.color,
            fontFamily: element.fontFamily || 'Georgia, serif',
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
        onDoubleClick={readOnly ? undefined : onEditImage}
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
        onDoubleClick={readOnly ? undefined : onEditVideo}
      >
        {element.src ? (
          <Box
            component="iframe"
            src={element.autoplay ? `${element.src}${element.src.includes('?') ? '&' : '?'}autoplay=1` : element.src}
            title="Embedded video"
            sx={{ width: '100%', height: '100%', border: 0 }}
            allow="autoplay; encrypted-media"
          />
        ) : (
          <Typography variant="caption" color="text.secondary">
            Video placeholder
          </Typography>
        )}
      </Box>
    );
  case 'code':
    return (
      <Box
        sx={{ ...commonSx, p: 1, bgcolor: 'grey.100' }}
        onContextMenu={handleContextMenu}
        onDoubleClick={readOnly ? undefined : onEditCode}
      >
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
