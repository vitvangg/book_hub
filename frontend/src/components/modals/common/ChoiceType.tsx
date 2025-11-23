import { Box, Stack } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PhotoRoundedIcon from "@mui/icons-material/PhotoRounded";
import AbcRoundedIcon from "@mui/icons-material/AbcRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';

interface ChoiceTypeProps {
    mode? : "create" | "manage";
    isImage?: boolean;
    onSelectType?: (type: string) => void;
    onDeleteBlock?: () => void;
    onUpdateBlock?: () => void;
    onCreateBlock?: () => void;
}

export function ChoiceType({ mode = "create", onSelectType, onDeleteBlock, onUpdateBlock, onCreateBlock, isImage = false }: ChoiceTypeProps) {
  const [openChoiceType, setOpenChoiceType] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function handleToggle() {
    setOpenChoiceType(!openChoiceType);
  }

  function handleSelect(type: string) {
    onSelectType?.(type);
    setOpenChoiceType(false);
  }

  // ✨ Bắt click ngoài để đóng menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenChoiceType(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Stack ref={ref} sx={{ width: 40, alignItems: "center" }} direction={"row"}>
        {!openChoiceType && (
        <Box
            sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            }}
            onClick={handleToggle}
        >
            <AddRoundedIcon sx={{ color: "white" }} />
        </Box>
        )}

        {openChoiceType && (
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {mode === "create" && (
            <>
                <PhotoRoundedIcon
                sx={{ color: "white", cursor: "pointer" }}
                onClick={() => handleSelect("image")}
                />
                <AbcRoundedIcon
                sx={{ color: "white", cursor: "pointer" }}
                onClick={() => handleSelect("text")}
                />
                <FormatQuoteRoundedIcon
                sx={{ color: "white", cursor: "pointer" }}
                onClick={() => handleSelect("quote")}
                />
            </>
            )}

            {mode === "manage" && (
            <>
                {!isImage && (
                  <EditRoundedIcon
                    sx={{ color: "white", cursor: "pointer" }}
                    onClick={onUpdateBlock}
                    />
                )}
                <DeleteRoundedIcon
                sx={{ color: "white", cursor: "pointer" }}
                onClick={onDeleteBlock}
                />
                <AddBoxRoundedIcon
                sx={{ color: "white", cursor: "pointer" }}
                onClick={onCreateBlock}
                />
            </>
            )}
        </Stack>
        )}
    </Stack>
  );
}
