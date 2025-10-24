import { Box, InputBase } from "@mui/material"
import { BsSearch } from "react-icons/bs"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Search() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("")
  const [showInput, setShowInput] = useState(false)

  function handleSearchClick() {
    if (searchValue.trim()) {
      const searchParams = new URLSearchParams({
        q: searchValue.trim(),
        type: 'post', // hoặc 'book', 'user', etc.
        page: '1',
        sort: 'relevance' // thêm sort mặc định
      });
      navigate(`/search?${searchParams.toString()}`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  }
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "#282828",
        height: "46px",
        width: showInput ? "400px" : "46px",
        borderRadius: showInput ? "9999px" : "100%",
        mx: "auto",
        border: "2px solid transparent",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
        "&:hover": { borderColor: "#403F3F" },
        "&:hover .search-icon": { color: "#F7F7F7 !important" },
        "&:focus-within": { borderColor: "#F7F7F7" },
        "&:focus-within .search-icon": { color: "#F7F7F7 !important" },
      }}
    >
      {/* Vùng icon clickable */}
      <Box
        onClick={() => setShowInput((prev) => !prev)}
        sx={{
          flex: showInput ? 1 : "none",
          width: "46px",
          height: "46px",
          minWidth: "46px",
          minHeight: "46px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: showInput ? "30px 0px 0px 30px" : "100%",
          transition: "all 0.3s ease-in-out"
        }}
      >
        <BsSearch
          className="search-icon"
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 24,
            transition: "color 0.3s ease-in-out",
          }}
        />
      </Box>

      {showInput && (
        <InputBase
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What do you want to find?"
          autoFocus
          sx={{
            flex: 9,
            px: 2,
            color: "white",
            "& input": { padding: "10px 0" },
          }}
        />
      )}
    </Box>
  )
}

export default Search
