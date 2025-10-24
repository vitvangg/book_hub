import { Container } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Loading from "./components/common/Loading";
import MainLayout from "./pages/protected/MainLayout";
import Error from "./pages/Error";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedLayout from "./pages/protected/ProtectedLayout";
import Content from "./components/home/Content";
import SearchContent from "./components/search/SearchContent";
import TopicContent from "./components/topic/TopicContent";
import PostPage from "./components/post/PostPage";
import ProfileLayout from "./components/profile/ProfileLayout";
import CreatePost from "./components/modals/CreatePost";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route
            path="/"
            element={
              <MainLayout>
                <Content />
              </MainLayout>
            }
          />
          <Route
            path="/search"
            element={
              <MainLayout>
                <SearchContent />
              </MainLayout>
            }
          />
          <Route
            path="/topic"
            element={
              <MainLayout>
                <TopicContent />
              </MainLayout>
            }
          />
          <Route
            path="/post"
            element={
              <MainLayout>
                <PostPage />
              </MainLayout>
            }
          />
          <Route
            path="/author"
            element={
              <MainLayout showSidebar={false}>
                <ProfileLayout />
              </MainLayout>
            }
          />
          <Route
            path="/create"
            element={
              <MainLayout>
                <CreatePost />
              </MainLayout>
            }
          />
          <Route path="/loading" element={<Loading />} />
          <Route path="/*" element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
