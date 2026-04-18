import type {PresentationType} from "../PresentaionType.ts";
import {Box, IconButton, Paper, Stack, TextField, Tooltip, Typography} from "@mui/material";
import React, {useState} from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

type EditableField = 'title' | 'description' | null;

type TitleBoxProps = {
  presentation: PresentationType;

  // 提交新的标题给父组件。
  // TitleBox 不直接操作全局 presentation，
  // 它只把“用户确认后的新值”向上交给 Presentation。
  updateTitle: (_nextTitle: string) => void;

  // 提交新的描述给父组件。
  updateDescription: (_nextDescription: string) => void;
};

export default function TitleBox({
  presentation,
  updateTitle,
  updateDescription,
}: TitleBoxProps) {

  // 当前正在编辑的是哪个字段。
  // null 表示当前处于“纯展示态”。
  const [editingField, setEditingField] = useState<EditableField>(null);

  // draft 表示当前输入框中的临时文本。
  // 它是局部 UI 状态，用来承接用户尚未提交的输入。
  const [draft, setDraft] = useState("");

  // 进入编辑态。
  function beginEdit(field: Exclude<EditableField, null>) {
    if (field === 'title') {
      setDraft(presentation.title);
    } else {
      setDraft(presentation.description);
    }

    setEditingField(field);
  }

  // 提交编辑：
  // 只在值真的发生变化时向父组件发送更新，
  // 避免无意义地触发一次本地更新。
  function commitEdit() {
    if (editingField === 'title') {
      if (draft !== presentation.title) {
        updateTitle(draft);
      }
    } else if (editingField === 'description') {
      if (draft !== presentation.description) {
        updateDescription(draft);
      }
    }

    setEditingField(null);
  }

  // 取消编辑：
  // 不提交 draft，只是退出编辑态。
  function cancelEdit() {
    setEditingField(null);
    setDraft("");
  }

  // 统一处理输入框中的快捷键语义。
  //
  // title:
  // - Enter 提交
  // - Escape 取消
  //
  // description:
  // - Ctrl/Cmd + Enter 提交
  // - Escape 取消
  //
  // 这样可以避免多行 description 普通 Enter 被误判为提交。
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    } else if (editingField === 'title' && e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (
      editingField === 'description' &&
      e.key === 'Enter' &&
      (e.ctrlKey || e.metaKey)
    ) {
      e.preventDefault();
      commitEdit();
    }
  }

  const styles = {
    titleBox: {
      p: 2.25,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.74)',
      backdropFilter: 'blur(14px)',
      borderColor: 'rgba(15, 23, 42, 0.08)',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    thumbnailBox: {
      width: 180,
      aspectRatio: '2 / 1',
      bgcolor: "#e0e0e0",
      flexShrink: 0,
      overflow: 'hidden',
      borderRadius: 3,
      background: presentation.thumbnail
        ? '#e0e0e0'
        : 'linear-gradient(135deg, #f8d9a0 0%, #f2efe8 48%, #c5e2ff 100%)',
    },
    textInfo: {
      minWidth: 0,
      flex: 1,
    },
    editIcon: {
      opacity: 0,
      transition: 'opacity 0.15s ease',
    },
    // 这个区域的视觉目标是：
    // 默认看起来像普通文本；
    // hover 时明显提示“可编辑”；
    // 但又不要像一直显示的表单输入框那样打扰页面。
    editableDisplayBox: {
      borderRadius: 1,
      outline: '1px solid transparent',
      transition: 'outline-color 0.15s ease',
      '&:hover': {
        outlineColor: '#fb923c',
        backgroundColor: 'rgba(248, 250, 252, 0.72)',
      },
      // 当鼠标 hover 到当前 Box 上时，选中这个 Box 里面 class 为 .titlebox-edit-icon 的元素
      '&:hover .titlebox-edit-icon': {
        opacity: 1,
      },
    },
  }

  const mediaProps = presentation.thumbnail ?
    {
      component: "img",
      src: presentation.thumbnail,
      alt: presentation.title,
      sx: styles.image,
    } : {
      component: "div",
    };

  const thumbnailBox = (
    <Box sx={styles.thumbnailBox}>
      <Box
        {...mediaProps}
      />
    </Box>
  );

  const editIcon = (
    <Tooltip title="Click to edit description">
      <IconButton
        size="small"
        tabIndex={-1}
        className="titlebox-edit-icon"
        sx={styles.editIcon}
      >
        <EditOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  const titleNode = editingField === 'title' ? (
    <TextField
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commitEdit}
      onKeyDown={handleKeyDown}
      size="small"
    />
  ) : (
    <Stack
      direction='row'
      alignItems='center'
      justifyContent='space-between'
      sx={styles.editableDisplayBox}
      onClick={() => beginEdit('title')}
    >
      <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
        {presentation.title.trim() || 'Untitled presentation'}
      </Typography>

      {editIcon}
    </Stack>
  );

  const descriptionNode = editingField === 'description' ? (
    <TextField
      autoFocus
      multiline
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commitEdit}
      onKeyDown={handleKeyDown}
      size="small"
      helperText="Press Ctrl/Cmd + Enter to save"
    />
  ) : (
    <Stack
      sx={styles.editableDisplayBox}
      onClick={() => beginEdit('description')}
      direction='row'
      alignItems='center'
      justifyContent='space-between'
    >
      <Typography variant="body2" color="text.secondary">
        {presentation.description.trim() || 'Add a short description for this deck.'}
      </Typography>

      {editIcon}
    </Stack>
  );

  return (
    <Paper variant="outlined" sx={styles.titleBox}>
      <Stack direction="row" spacing={2} alignItems="center">
        {thumbnailBox}
        <Stack spacing={1} sx={styles.textInfo}>
          {titleNode}
          {descriptionNode}
        </Stack>
      </Stack>
    </Paper>
  )
}
