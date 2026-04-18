import {Fragment, type MouseEvent, type ReactNode} from "react";
import type {SlideElement} from "../PresentaionType.ts";
import {Box, Typography} from "@mui/material";

const keywordMap = {
  c: new Set(['int', 'char', 'float', 'double', 'return', 'if', 'else', 'for', 'while', 'void', 'include']),
  python: new Set(['def', 'return', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'class', 'print', 'None', 'True', 'False']),
  javascript: new Set(['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'from', 'export', 'class', 'new']),
};

function detectLanguage(code: string): 'c' | 'python' | 'javascript' {
  if (/#include|printf\s*\(|scanf\s*\(|int\s+main\s*\(/.test(code)) {
    return 'c';
  }
  if (/\bdef\b|\bprint\s*\(|\bimport\b|\bfrom\b|\belif\b|\bNone\b/.test(code)) {
    return 'python';
  }
  return 'javascript';
}

function highlightLine(
  line: string,
  language: 'c' | 'python' | 'javascript'
) {
  const commentPattern = language === 'python' ? /#.*$/ : /\/\/.*$/;
  const match = line.match(commentPattern);
  const commentStart = match?.index ?? -1;
  const codePart = commentStart >= 0 ? line.slice(0, commentStart) : line;
  const commentPart = commentStart >= 0 ? line.slice(commentStart) : '';
  const tokenPattern = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b[A-Za-z_]\w*\b|\b\d+(?:\.\d+)?\b)/g;
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const tokenMatch of codePart.matchAll(tokenPattern)) {
    const token = tokenMatch[0];
    const tokenIndex = tokenMatch.index ?? 0;
    if (tokenIndex > lastIndex) {
      parts.push(codePart.slice(lastIndex, tokenIndex));
    }

    let sx = {};
    if (token.startsWith('"') || token.startsWith('\'')) {
      sx = { color: '#0f766e' };
    } else if (/^\d/.test(token)) {
      sx = { color: '#b45309' };
    } else if (keywordMap[language].has(token)) {
      sx = { color: '#7c3aed', fontWeight: 700 };
    }

    parts.push(
      <Box component="span" sx={sx} key={`${token}-${tokenIndex}`}>
        {token}
      </Box>
    );
    lastIndex = tokenIndex + token.length;
  }

  if (lastIndex < codePart.length) {
    parts.push(codePart.slice(lastIndex));
  }
  if (commentPart) {
    parts.push(
      <Box component="span" sx={{ color: '#64748b' }} key={`comment-${line}`}>
        {commentPart}
      </Box>
    );
  }

  return parts;
}

function renderHighlightedCode(
  code: string,
  language: 'c' | 'python' | 'javascript'
) {
  return code.split('\n').map((line, index) => (
    <Fragment key={`${language}-${index}`}>
      {highlightLine(line, language)}
      {index < code.split('\n').length - 1 ? '\n' : null}
    </Fragment>
  ));
}

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
  {
    const language = element.language || detectLanguage(element.code);
    const highlightedCode = renderHighlightedCode(element.code, language);
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
          {highlightedCode}
        </Box>
      </Box>
    );
  }
  }
}
